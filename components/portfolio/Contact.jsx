"use client";

import { useState } from "react";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/Tomfmp2",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/tomasmedinadev/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/TomasMedinaDev",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "Email",
    href: "mailto:tom.pradamd@gmail.com",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }

    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es requerido";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "El mensaje debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/tom.pradamd@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: "Nuevo mensaje de contacto desde tu Portafolio",
          _template: "table"
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        alert("Hubo un error al enviar el mensaje. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Hubo un error al enviar el mensaje. Revisa tu conexión a internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="relative py-20 lg:py-32 bg-muted/30">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#3B82F6]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#10B981]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-[#10B981]/10 text-[#10B981] text-sm font-medium mb-4">
            Hablemos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Contacto
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Estoy disponible para oportunidades laborales, proyectos freelance o colaboraciones. No dudes en contactarme.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact info */}
          <div className="space-y-8">
            <div className="glass rounded-2xl border border-white/10 p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Conectemos
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Ya sea que tengas una oportunidad de trabajo, un proyecto interesante o simplemente quieras charlar sobre tecnología backend, estaré encantado de escucharte.
              </p>

              {/* Contact details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[#3B82F6]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ubicación</p>
                    <p className="text-foreground font-medium">
                      Bucaramanga, Santander, Colombia
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[#10B981]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href="mailto:tom.pradamd@gmail.com"
                      className="text-foreground font-medium hover:text-[#10B981] transition-colors"
                    >
                      tom.pradamd@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Sígueme en redes
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-[#3B82F6]/20 hover:text-[#3B82F6] transition-all duration-200"
                      aria-label={`Ir a ${link.name}`}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability card */}
            <div className="glass rounded-2xl border border-[#10B981]/30 p-6 bg-[#10B981]/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center flex-shrink-0">
                  <span className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">
                    Disponible para trabajar
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Actualmente busco oportunidades remotas o en Colombia. Tiempo de respuesta: 48-72 horas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="glass rounded-2xl border border-white/10 p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Envíame un mensaje
            </h3>

            {submitSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-[#10B981]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-[#10B981] font-medium">
                    Mensaje enviado correctamente. Te responderé pronto.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  className={`w-full px-4 py-3 rounded-xl bg-muted border ${errors.name ? "border-red-500" : "border-border"
                    } text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all duration-200`}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 text-sm text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className={`w-full px-4 py-3 rounded-xl bg-muted border ${errors.email ? "border-red-500" : "border-border"
                    } text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all duration-200`}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Cuéntame sobre tu proyecto o propuesta..."
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl bg-muted border ${errors.message ? "border-red-500" : "border-border"
                    } text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all duration-200 resize-none`}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-2 text-sm text-red-500">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3B82F6] hover:bg-[#3B82F6]/90 disabled:bg-[#3B82F6]/50 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#3B82F6]/25 disabled:cursor-not-allowed"
                aria-label="Enviar mensaje"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar mensaje
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
