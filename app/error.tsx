"use client";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main id="main-content" className="empty-state shell"><p className="eyebrow">Error / Interrupted signal</p><h1>Something broke while loading this page.</h1><button className="button-light" onClick={reset}>Try again</button></main>; }
