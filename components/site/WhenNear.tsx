"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mounts its children only once the box comes within `margin` of the
 * viewport, so heavy client-only pieces (and the code they import) aren't
 * loaded with the page. Once mounted they stay.
 */
export default function WhenNear({ children, className = "", margin = "800px" }: { children: React.ReactNode; className?: string; margin?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin, near]);

  return (
    <div ref={box} className={className}>
      {near && children}
    </div>
  );
}
