"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface AnimatedPracticeRibbonProps {
  src: string;
  alt: string;
  className?: string;
}

export function AnimatedPracticeRibbon({ src, alt, className = "" }: AnimatedPracticeRibbonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  useEffect(() => {
    if (!webglSupported || reducedMotion) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_amplitude;
      uniform float u_speed;

      varying vec2 v_texCoord;

      void main() {
        vec2 pos = a_position;
        float normX = pos.x / u_resolution.x;
        float normY = pos.y / u_resolution.y;

        // Primary wave traveling left to right
        float wave1 = sin(normX * 6.28318 * 2.2 - u_time * u_speed) * u_amplitude;
        // Secondary subtle cross wave for organic ripple
        float wave2 = cos(normX * 6.28318 * 4.1 - u_time * u_speed * 1.35 + normY * 1.5) * (u_amplitude * 0.35);

        // Ground the left curled edge slightly
        float edgeFactor = smoothstep(0.02, 0.18, normX);

        pos.y += (wave1 + wave2) * edgeFactor;

        vec2 zeroToOne = pos / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    // Fragment Shader Source
    const fsSource = `
      precision mediump float;
      uniform sampler2D u_image;
      varying vec2 v_texCoord;

      void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
      }
    `;

    const createShader = (glCtx: WebGLRenderingContext, type: number, source: string) => {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error(glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertShader || !fragShader) {
      setWebglSupported(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      setWebglSupported(false);
      return;
    }

    gl.useProgram(program);

    // Look up shader attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const amplitudeLocation = gl.getUniformLocation(program, "u_amplitude");
    const speedLocation = gl.getUniformLocation(program, "u_speed");

    // Load image texture
    const texture = gl.createTexture();
    const image = new window.Image();
    let imageLoaded = false;
    let imgWidth = 1200;
    let imgHeight = 520;

    image.crossOrigin = "anonymous";
    image.src = src;
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      imgWidth = image.naturalWidth || 1200;
      imgHeight = image.naturalHeight || 520;
      imageLoaded = true;
      resize();
    };

    // Subdivided Plane Mesh (60 columns x 20 rows)
    const COLS = 60;
    const ROWS = 20;
    let positionBuffer: WebGLBuffer | null = null;
    let texCoordBuffer: WebGLBuffer | null = null;
    let indexBuffer: WebGLBuffer | null = null;
    let numIndices = 0;

    const buildMesh = (width: number, height: number) => {
      const positions: number[] = [];
      const texCoords: number[] = [];
      const indices: number[] = [];

      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const u = c / COLS;
          const v = r / ROWS;
          const x = u * width;
          const y = v * height;
          positions.push(x, y);
          texCoords.push(u, v);
        }
      }

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const first = r * (COLS + 1) + c;
          const second = first + COLS + 1;
          indices.push(first, second, first + 1);
          indices.push(second, second + 1, first + 1);
        }
      }

      numIndices = indices.length;

      positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

      indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    };

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const displayWidth = rect.width;
      const aspect = imgHeight / imgWidth;
      const displayHeight = displayWidth * aspect;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(displayWidth * dpr);
      const height = Math.round(displayHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        gl.viewport(0, 0, width, height);
        buildMesh(width, height);
      }
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    let isIntersecting = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let animFrameId: number;
    let startTime: number | null = null;

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedSec = (timestamp - startTime) / 1000.0;

      if (isIntersecting && imageLoaded && positionBuffer && texCoordBuffer && indexBuffer) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, elapsedSec);
        // Amplitude scales with resolution
        const amp = canvas.height * 0.035;
        gl.uniform1f(amplitudeLocation, amp);
        // Seamless 6.0 second cycle speed (2 * PI / 6.0 = 1.047)
        gl.uniform1f(speedLocation, 1.047);

        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(texCoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, numIndices, gl.UNSIGNED_SHORT, 0);
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, [src, webglSupported, reducedMotion]);

  if (!webglSupported || reducedMotion) {
    return (
      <div className={`practice-ribbon-fallback ${className}`}>
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={520}
          sizes="100vw"
          priority
          className="practice-ribbon-img"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`practice-ribbon-canvas-container ${className}`}>
      <canvas ref={canvasRef} className="practice-ribbon-canvas" />
    </div>
  );
}
