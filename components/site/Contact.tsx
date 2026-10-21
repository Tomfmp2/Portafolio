"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/content";
import { gsap, initGSAP, MEDIA } from "@/lib/gsap";
import { deckState, subscribeDeck } from "@/lib/deck";
import { useSceneIndex } from "./Deck";
import WhenNear from "./WhenNear";

// WebGL (three.js) is the heaviest code on the page: fetched only as the visitor nears the contact.
const Keycaps = dynamic(() => import("./three/Keycaps"), { ssr: false });
// Same names as in three/Keycaps; not imported from there so the WebGL chunk stays lazy.
const ENTER_HOVER = "contact:enter-hover";
const ENTER_PRESS = "contact:enter-press";

/** Our own route: it emails the message to the owner (app/api/contact/route.ts). */
const FORM_ENDPOINT = "/api/contact";

const elsewhere = [
  { name: "GitHub", href: links.github },
  { name: "LinkedIn", href: links.linkedin },
  { name: "Telegram", href: links.telegram },
];

type Field = "name" | "email" | "message";
type Status = "idle" | "sending" | "sent" | "failed";

/** The email as the main call to action: copies on click and leans toward the pointer. */
function EmailButton() {
  const { t } = useLanguage();
  const c = t.contact;
  const ref = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    initGSAP();
    const mm = gsap.matchMedia();
    mm.add(`${MEDIA.finePointer} and ${MEDIA.motion}`, () => {
      const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * 0.18);
        y((e.clientY - (r.top + r.height / 2)) * 0.3);
      };
      const onLeave = () => {
        x(0);
        y(0);
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    });
    return () => mm.revert();
  }, []);

  // Pressing the 3D Enter key copies the email too.
  useEffect(() => {
    const onPress = () => void copy();
    window.addEventListener(ENTER_PRESS, onPress);
    return () => window.removeEventListener(ENTER_PRESS, onPress);
  });

  const hover = (down: boolean) => window.dispatchEvent(new CustomEvent(ENTER_HOVER, { detail: down }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${links.email}`;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <button ref={ref} type="button" data-own-magnet onClick={copy} onPointerEnter={() => hover(true)} onPointerLeave={() => hover(false)} onFocus={() => hover(true)} onBlur={() => hover(false)} className="btn btn-ink min-h-14 px-7 text-[clamp(1rem,1.6vw,1.25rem)]" aria-describedby="copy-status">
        {links.email}
      </button>
      <span className="small" id="copy-status" role="status">
        {copied ? c.copied : c.copy}
      </span>
    </div>
  );
}

/**
 * Where the 3D keys load: in the deck, the first time the contact scene is reached (and they only
 * render while it's on screen); as a plain document, once the visitor scrolls near them.
 */
function KeycapsSlot() {
  const index = useSceneIndex();
  const current = useSyncExternalStore(subscribeDeck, () => deckState.index, () => -1);
  // Decided after mount from the class the head script set: rendering before that would guess
  // wrong and, in the deck, every scene overlaps the viewport (so "near" would always be true).
  const [mode, setMode] = useState<"pending" | "deck" | "document">("pending");
  const [seen, setSeen] = useState(false);
  useEffect(() => setMode(document.documentElement.classList.contains("deck-on") ? "deck" : "document"), []);
  const active = mode === "deck" && current === index;
  useEffect(() => {
    if (active) setSeen(true);
  }, [active]);
  if (mode === "pending") return null;
  if (mode === "document")
    return (
      <WhenNear className="h-full w-full">
        <Keycaps className="h-full w-full" />
      </WhenNear>
    );
  return seen ? <Keycaps className="h-full w-full" active={active} /> : null;
}

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const honeypot = useRef<HTMLInputElement>(null);

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) next.name = c.errors.nameRequired;
    if (!values.email.trim()) next.email = c.errors.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = c.errors.emailInvalid;
    if (!values.message.trim()) next.message = c.errors.messageRequired;
    else if (values.message.trim().length < 10) next.message = c.errors.messageMin;
    setErrors(next);
    return next;
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as Field;
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (status === "sent" || status === "failed") setStatus("idle");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate();
    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, company: honeypot.current?.value ?? "" }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setValues({ name: "", email: "", message: "" });
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const fieldClass = (field: Field) =>
    `mt-2 w-full border-0 border-b-[1.5px] bg-transparent px-0 py-3 text-lg placeholder:text-ink-soft/70 focus:border-ink focus:outline-none focus-visible:outline-none focus:bg-marker/25 transition-colors ${
      errors[field] ? "border-destructive" : "border-ink/40"
    }`;

  const field = (name: Field, label: string, type: "text" | "email" | "textarea", autoComplete?: string) => (
    <div data-reveal>
      <label htmlFor={`contact-${name}`} className="text-sm font-medium">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={`contact-${name}`}
          name={name}
          rows={4}
          value={values[name]}
          onChange={onChange}
          placeholder={c.messagePlaceholder}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
          className={`${fieldClass(name)} resize-y`}
        />
      ) : (
        <input
          id={`contact-${name}`}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={values[name]}
          onChange={onChange}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
          className={fieldClass(name)}
        />
      )}
      {errors[name] && (
        <p id={`contact-${name}-error`} className="mt-1.5 text-sm text-destructive">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <section className="scene-fill pb-16 pt-[clamp(5.5rem,11vh,7rem)]" aria-labelledby="contact-title">
      <div className="wrap">
        <h2 id="contact-title" className="headline" data-lines>
          {c.title}
        </h2>
        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p data-reveal className="lead max-w-[32ch]">{c.lede}</p>
            <div data-reveal className="mt-7">
              <EmailButton />
            </div>
            <p data-reveal className="mt-7 text-ink-soft">
              {c.elsewhere}{" "}
              {elsewhere.map((l, i) => (
                <span key={l.name}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="link font-medium text-ink">
                    {l.name}
                  </a>
                  {i < elsewhere.length - 1 && ", "}
                </span>
              ))}
            </p>
            <div data-reveal className="mt-6">
              <a href={links.cv} download className="btn btn-line">
                {t.hero.cv}
              </a>
            </div>
            <div data-parallax="0.1" className="mt-4 h-[clamp(10rem,24vh,16rem)] w-full max-w-[28rem]">
              <KeycapsSlot />
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate className="space-y-6">
            <h3 data-reveal className="title !text-[clamp(1.5rem,2.6vw,2.1rem)]">{c.formTitle}</h3>
            <div className="grid gap-7 sm:grid-cols-2">
              {field("name", c.nameLabel, "text", "name")}
              {field("email", c.emailLabel, "email", "email")}
            </div>
            {field("message", c.messageLabel, "textarea")}
            {/* Honeypot: hidden from people and assistive tech; only bots fill it in. */}
            <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
            <div data-reveal className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn btn-ink" disabled={status === "sending"}>
                {status === "sending" ? c.sending : c.send}
              </button>
              <p role="status" className={`text-sm ${status === "failed" ? "text-destructive" : ""}`}>
                {status === "sent" && c.success}
                {status === "failed" && c.failure}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
