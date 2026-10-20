import { Fragment } from "react";

/**
 * Renders copy where ==this== marks a highlighted phrase. The highlight is a
 * real <mark>, so the emphasis survives without CSS and is announced by
 * screen readers that support it; Motion animates the sweep.
 */
export default function Marked({ text }: { text: string }) {
  const parts = text.split(/==(.+?)==/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="hl" data-hl>
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}
