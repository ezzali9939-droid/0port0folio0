# Interaction Specification

## Global

- Use GSAP ScrollTrigger for section choreography and Framer Motion only for local component state.
- Keep motion restrained and physical: no elastic effects, random rotations or decorative particles.
- Every scroll animation must have a reduced-motion fade fallback.
- Blue signal points are the only luminous accent and should never glow continuously across the whole page.

## Header and Navigation

- Fade and slide the header into place over 650ms on the first visit.
- Use a thin underline for the active route.
- Collapse to a full-screen minimal menu below tablet width.

## Home

- Reveal the portrait through a horizontal clip with a short motion smear.
- Slice the PORTFOLIO title into horizontal bands that settle into alignment.
- Give the Z architecture three depth planes with subtle scroll parallax and sequential blue signal activation.
- The runner character is removed.
- The tools ring uses pointer tilt and slow inertial drift, not fake 360-degree rotation.

## About

- Keep ABOUT readable while a thin horizontal slice offsets briefly on entry.
- Let the practice ribbon drift horizontally against the scroll direction.
- Separate the thinking layers by a few pixels on scroll and return them to alignment near the section center.

## Work

- Use one selected-work carousel/grid only.
- Cards reveal with a small depth shift and image mask; avoid scaling beyond 1.03.
- The process stages illuminate from left to right as the narrative progresses.
- The gyroscope uses layered 2.5D rotation with a limited range to preserve realism.

## Contact

- Build the form as real HTML controls inside an SVG/CSS circuit ring.
- Animate the signal through Receive, Clarify and Build the Brief only after the section enters the viewport.
- Calibration controls react to pointer position with a maximum translation of 6px.

## Shared CTA and Footer

- The off-white page transitions into the dark CTA through the approved curved divider.
- The metal frame receives a soft moving highlight once, then remains still.
- Contact links use clear focus states and preserve full keyboard navigation.
