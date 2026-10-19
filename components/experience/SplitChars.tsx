/**
 * Renders text as one span per character so TextFx can animate letters, while
 * screen readers get the plain string. Built by React rather than by GSAP's
 * SplitText so a language switch re-renders cleanly instead of fighting a
 * DOM that GSAP rewrote.
 */
export default function SplitChars({ text }: { text: string }) {
  let index = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="split" aria-hidden="true">
        {text.split(" ").map((word, w, words) => (
          <span key={w}>
            <span className="split-word">
              {[...word].map((char, c) => (
                <span key={c} className="char" style={{ "--i": index++ } as React.CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
            {w < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </>
  );
}
