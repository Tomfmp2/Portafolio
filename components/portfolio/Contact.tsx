"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useLanguage } from "@/hooks/use-language";
import SplitChars from "@/components/experience/SplitChars";

const EMAIL = "tom.pradamd@gmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`;

const elsewhere = [
  { name: "GitHub", href: "https://github.com/Tomfmp2" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/tomasmedinadev/" },
  { name: "Telegram", href: "https://t.me/TomasMedinaDev" },
];

type Field = "name" | "email" | "message";
type Status = "idle" | "sending" | "sent" | "failed";

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

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
        body: JSON.stringify({ ...values, _subject: "Nuevo mensaje desde el portafolio", _template: "table" }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setValues({ name: "", email: "", message: "" });
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const fieldClass = (field: Field) =>
    `mt-1.5 w-full rounded-md border bg-void/70 px-3.5 py-3 text-paper placeholder:text-dim/70 transition-colors focus:border-signal focus:outline-none ${
      errors[field] ? "border-destructive" : "border-line"
    }`;

  const field = (name: Field, label: string, type: "text" | "email" | "textarea", autoComplete?: string) => (
    <div>
      <label htmlFor={`contact-${name}`} className="text-sm text-dim">{label}</label>
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
        <p id={`contact-${name}-error`} className="mt-1.5 text-sm text-destructive">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <section id="contacto" data-chapter={6} className="chapter" aria-labelledby="contact-title">
      <div className="chapter-copy page-container">
        <div className="chapter-text">
          <h2 id="contact-title" className="chapter-title"><SplitChars text={c.title} /></h2>
          <p className="lede mt-5">{c.lede}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={`mailto:${EMAIL}`} className="link-underline text-lg font-semibold text-paper">{EMAIL}</a>
            <a href="/CV/Tomas_Medina_CV.pdf" download className="btn-signal">{c.cv}</a>
          </div>

          <p className="mt-6 text-sm text-dim">
            {c.elsewhere}:{" "}
            {elsewhere.map((l, i) => (
              <span key={l.name}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-underline text-phosphor">{l.name}</a>
                {i < elsewhere.length - 1 && ", "}
              </span>
            ))}
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-10 space-y-4 rounded-lg border border-line bg-c64-deep/40 p-5 backdrop-blur-sm sm:p-6">
            <h3 className="font-bold text-paper">{c.formTitle}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("name", c.nameLabel, "text", "name")}
              {field("email", c.emailFieldLabel, "email", "email")}
            </div>
            {field("message", c.messageLabel, "textarea")}
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn-signal" disabled={status === "sending"}>
                {status === "sending" ? c.sending : c.send}
              </button>
              <p role="status" className={`text-sm ${status === "failed" ? "text-destructive" : "text-phosphor"}`}>
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
