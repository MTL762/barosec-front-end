/** Document scroll depth — CSS-driven via animation-timeline when supported. */
export function ScrollProgress() {
  return (
    <div
      className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-primary"
      aria-hidden
    />
  );
}
