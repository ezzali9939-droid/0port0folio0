import Image from "next/image";

export default function Loading() {
  return (
    <div className="ez-loading-overlay" aria-label="Loading content" role="status">
      <div className="ez-loading-logo-wrapper">
        <Image
          src="/assets/brand/logo/ez-wordmark-black.webp"
          alt="Ezz Eldin Logo Loading Indicator"
          width={240}
          height={72}
          priority
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
          className="ez-loading-logo"
        />
      </div>
    </div>
  );
}
