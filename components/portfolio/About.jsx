"use client";

const contributions = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
        />
      </svg>
    ),
    title: "Diseño de Bases de Datos",
    description:
      "Arquitecturas SQL optimizadas para alto rendimiento y escalabilidad.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "APIs Escalables",
    description:
      "Desarrollo de APIs RESTful robustas con .NET y Node.js.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    title: "Automatización",
    description:
      "Flujos de trabajo automatizados con n8n y scripts personalizados.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
        />
      </svg>
    ),
    title: "Integración de Servicios",
    description:
      "Conexión de sistemas y servicios de terceros de forma eficiente.",
  },
];

export default function About() {
  return (
    <section id="sobre-mi" className="relative py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[#10B981]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-sm font-medium mb-4">
            Conóceme
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Sobre mí
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Un desarrollador backend apasionado por crear soluciones tecnológicas eficientes
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Bio card */}
          <div className="glass rounded-2xl border border-white/10 p-8 lg:p-10 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#10B981] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Tomas Felipe Medina Prada
                </h3>
                <p className="text-[#3B82F6] font-medium">
                  Backend Developer
                </p>
              </div>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Soy un desarrollador backend con sede en{" "}
                <span className="text-foreground font-medium">
                  Bucaramanga, Santander, Colombia
                </span>
                . Mi enfoque principal está en el desarrollo de{" "}
                <span className="text-[#3B82F6] font-medium">
                  Gestion de proyectos robustos utilizando C# y .NET
                </span>{" "}
                y{" "}
                <span className="text-[#3B82F6] font-medium">
                  sistemas de bases de datos
                </span>{" "}
                eficientes.
              </p>
              <p>
                Cuento con experiencia sólida en{" "}
                <span className="text-[#10B981] font-medium">.NET</span>,{" "}
                <span className="text-[#10B981] font-medium">C#</span>,{" "} y {" "}
                <span className="text-[#10B981] font-medium">SQL</span>
                creando soluciones que resuelven problemas reales de negocio.
              </p>
              <p>
                Me especializo en la{" "}
                <span className="text-foreground font-medium">
                  automatización de procesos
                </span>{" "}
                utilizando herramientas como{" "}
                <span className="text-[#3B82F6] font-medium">Docker</span> para
                contenedores y{" "}
                <span className="text-[#3B82F6] font-medium">n8n</span> para
                workflows, optimizando flujos de trabajo empresariales.
              </p>
            </div>

            {/* Location badge */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-muted-foreground">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Bucaramanga, Santander, Colombia</span>
              </div>
            </div>
          </div>

          {/* Contributions grid */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Lo que puedo aportar
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {contributions.map((item, index) => (
                <div
                  key={index}
                  className="group glass rounded-xl border border-white/10 p-6 hover:border-[#3B82F6]/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-12 h-12 rounded-lg ${index % 2 === 0
                      ? "bg-[#3B82F6]/20 text-[#3B82F6]"
                      : "bg-[#10B981]/20 text-[#10B981]"
                      } flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
