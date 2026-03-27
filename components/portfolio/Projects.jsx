"use client";

const projects = [
  {
    title: "Simulador Liga Betplay",
    description:
      "Simulador de la Liga BetPlay desarrollado en C# (.NET 8) como aplicación de consola, que gestiona equipos, calendario “todos contra todos”, simulación de partidos y actualización de tabla de posiciones en tiempo real, en un entorno modular y mantenible.",
    problem: "Simular y gestionar un torneo tipo Liga BetPlay con reglas claras y estadísticas completas.",
    solution: "App de consola en C# que genera el fixture, simula partidos y actualiza la tabla de posiciones.",
    stack: [".NET 8", "C#"],
    image: "ligabetplay",
    github: "https://github.com/melokaso1/ligaBetplay_C-",
    demo: "https://github.com/melokaso1/ligaBetplay_C-",
  },
  {
    title: "TechDistrib ERP — Base de Datos Comercial",
    description:
      "Modelo de base de datos en MySQL para una empresa distribuidora de tecnología con reglas de negocio, SPs, vistas, triggers y reportes gerenciales.",
    problem: "La empresa ficticia manejaba inventario, facturación y comisiones con hojas de cálculo y procesos manuales.",
    solution: "Modelo de base de datos relacional con SPs, triggers, vistas y reportes para gestionar inventario, ventas, clientes y comisiones.",
    stack: ["MySQL", "SQL", "Stored Procedures", "Triggers"],
    image: "techdistrib",
    github: "https://github.com/Tomfmp2/MySQL-2-final-project",
    demo: "https://github.com/Tomfmp2/MySQL-2-final-project",
  },
  {
    title: "LMS Educational System",
    description:
      "Sistema LMS para gestión de cursos, estudiantes y docentes, orientado a centralizar contenidos y seguimiento académico.",
    problem: "Instituciones pequeñas carecían de una plataforma centralizada para administrar cursos y progreso de estudiantes.",
    solution: "Diseño de un sistema LMS modular que organiza usuarios, cursos, matrículas y reportes de avance.",
    stack: ["SQL", "LMS Conceptual"],
    image: "LMS",
    github: "https://github.com/Tomfmp2/LMS-educational-system",
    demo: "https://github.com/Tomfmp2/LMS-educational-system",
  },
  {
    title: "Sistema Bancario en Consola",
    description:
      "Aplicación de terminal en Python que simula operaciones bancarias básicas como creación de cuentas, depósitos y retiros.",
    problem: "Se necesitaba practicar modelado de lógica financiera y flujos transaccionales en un entorno controlado.",
    solution: "Sistema en Python con menús por consola que gestiona usuarios, cuentas y movimientos con validaciones básicas.",
    stack: ["Python"],
    image: "banking",
    github: "https://github.com/Tomfmp2/banking-system-Python",
    demo: "https://github.com/Tomfmp2/banking-system-Python",
  },
  {
    title: "Portafolio Web Personal",
    description:
      "Sitio de portafolio desarrollado con Next.js y TypeScript, orientado a presentar proyectos, skills y experiencia de forma profesional.",
    problem: "Necesitaba una plataforma propia para mostrar mis proyectos y perfil profesional.",
    solution: "Aplicación web moderna con routing, componentes reutilizables y despliegue continuo en Vercel.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    image: "portfolio",
    github: "https://github.com/Tomfmp2/Portafolio",
    demo: "https://portafolio-alpha-nine-96.vercel.app/#proyectos",
  },
  {
    title: "API de Autenticación Centralizada",
    description:
      "Servicio de autenticación SSO para múltiples aplicaciones con OAuth2, JWT y gestión de roles y permisos granulares.",
    problem: "Múltiples sistemas con autenticación independiente generaban inconsistencias.",
    solution: "Sistema centralizado con tokens seguros y auditoría de accesos.",
    stack: [".NET", "C#", "SQL Server", "Redis"],
    image: "auth",
    github: "#",
    demo: "#",
  },
];

const projectImages = {
  ligabetplay: (
    <div className="w-full h-48 bg-gradient-to-br from-[#3B82F6]/20 to-[#10B981]/20 flex items-center justify-center">
      <div className="glass rounded-lg p-4 border border-white/10 flex flex-col items-center">
        <svg className="w-12 h-12 text-[#3B82F6] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <div className="text-xs font-mono text-muted-foreground">LigaBetplay.exe</div>
        <div className="mt-2 text-[10px] text-[#10B981]">Simulando jornada...</div>
      </div>
    </div>
  ),
  techdistrib: (
    <div className="w-full h-48 bg-gradient-to-br from-[#10B981]/20 to-[#3B82F6]/20 flex items-center justify-center">
      <div className="glass rounded-lg p-4 border border-white/10 flex flex-col items-center">
        <svg className="w-12 h-12 text-[#10B981] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
        <div className="text-xs font-mono text-foreground">TechDistrib_DB</div>
        <div className="flex gap-1 mt-2">
          <div className="h-1 w-6 bg-[#3B82F6]/50 rounded" />
          <div className="h-1 w-6 bg-[#10B981]/50 rounded" />
          <div className="h-1 w-6 bg-[#3B82F6]/50 rounded" />
        </div>
      </div>
    </div>
  ),
  LMS: (
    <div className="w-full h-48 bg-gradient-to-br from-[#3B82F6]/20 to-[#10B981]/20 flex items-center justify-center">
      <div className="glass rounded-lg p-5 border border-white/10 flex flex-col items-center">
        <svg className="w-12 h-12 text-[#3B82F6] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14v7" />
        </svg>
        <div className="text-xs font-mono text-muted-foreground">LMS System</div>
      </div>
    </div>
  ),
  banking: (
    <div className="w-full h-48 bg-gradient-to-br from-[#10B981]/20 to-[#3B82F6]/20 flex items-center justify-center">
      <div className="glass rounded-lg p-4 border border-white/10 flex flex-col items-center w-40">
        <div className="flex w-full justify-between items-center border-b border-white/10 pb-2 mb-2">
           <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <div className="text-xs font-mono text-muted-foreground">py_bank</div>
        </div>
        <div className="text-left w-full space-y-1">
           <div className="text-[10px] text-muted-foreground">&gt; deposito 500</div>
           <div className="text-[10px] text-[#10B981]">Transacción exitosa</div>
           <div className="text-[10px] text-muted-foreground">&gt; saldo</div>
        </div>
      </div>
    </div>
  ),
  portfolio: (
    <div className="w-full h-48 bg-gradient-to-br from-[#3B82F6]/20 to-[#10B981]/20 flex items-center justify-center">
      <div className="glass rounded-lg p-4 border border-white/10 w-44">
        <div className="flex gap-1.5 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex flex-col gap-2">
           <div className="w-full h-12 bg-[#3B82F6]/20 rounded" />
           <div className="flex gap-2">
             <div className="w-1/2 h-8 bg-[#10B981]/20 rounded" />
             <div className="w-1/2 h-8 bg-white/5 rounded" />
           </div>
        </div>
      </div>
    </div>
  ),
  auth: (
    <div className="w-full h-48 bg-gradient-to-br from-[#10B981]/20 to-[#3B82F6]/20 flex items-center justify-center">
      <div className="glass rounded-lg p-4 border border-white/10 text-center">
        <div className="w-12 h-12 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="text-xs text-muted-foreground">SSO Login</div>
        <div className="mt-2 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
          <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
        </div>
      </div>
    </div>
  ),
};

export default function Projects() {
  return (
    <section id="proyectos" className="relative py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-[#3B82F6]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-[#10B981]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-sm font-medium mb-4">
            Mi Trabajo
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Proyectos Destacados
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Una selección de proyectos backend que demuestran mi experiencia en desarrollo de APIs, automatización y arquitectura de sistemas
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group glass rounded-2xl border border-white/10 overflow-hidden hover:border-[#3B82F6]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#3B82F6]/10"
            >
              {/* Project image */}
              <div className="overflow-hidden">
                {projectImages[project.image]}
              </div>

              {/* Project content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[#3B82F6] transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Stack badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.stack.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${techIndex % 2 === 0
                        ? "bg-[#3B82F6]/10 text-[#3B82F6]"
                        : "bg-[#10B981]/10 text-[#10B981]"
                        }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <a
                    href={project.github}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-border text-foreground hover:bg-white/5 rounded-lg text-sm font-medium transition-all duration-200"
                    aria-label={`Ver código de ${project.title}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Código
                  </a>
                  <a
                    href={project.demo}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white rounded-lg text-sm font-medium transition-all duration-200"
                    aria-label={`Ver demo de ${project.title}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white rounded-xl font-medium transition-all duration-200"
            aria-label="Ver más proyectos en GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Ver todos los proyectos en GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
