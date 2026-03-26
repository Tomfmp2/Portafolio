"use client";

const projects = [
  {
    title: "Sistema de Gestión de Inventarios",
    description:
      "API REST completa para gestión de inventarios empresariales con autenticación JWT, control de stock en tiempo real y reportes automatizados.",
    problem: "Empresas con control manual de inventario perdían eficiencia y cometían errores.",
    solution: "Sistema centralizado con APIs escalables y notificaciones automáticas.",
    stack: [".NET", "C#", "SQL Server", "Docker"],
    image: "inventory",
    github: "#",
    demo: "#",
  },
  {
    title: "Bot de Telegram para CRM",
    description:
      "Bot automatizado para gestión de clientes y leads, integrado con bases de datos MySQL y workflows de n8n para seguimiento automático.",
    problem: "Equipos de ventas perdían seguimiento de leads por falta de centralización.",
    solution: "Bot conversacional con recordatorios y pipeline de ventas automatizado.",
    stack: ["Node.js", "MySQL", "n8n", "Telegram API"],
    image: "bot",
    github: "#",
    demo: "#",
  },
  {
    title: "Microservicios de Facturación",
    description:
      "Arquitectura de microservicios para sistema de facturación electrónica con integración a servicios tributarios y generación de reportes.",
    problem: "Procesos de facturación lentos y propensos a errores humanos.",
    solution: "Microservicios independientes con colas de mensajes y validación automática.",
    stack: [".NET", "Docker", "PostgreSQL", "RabbitMQ"],
    image: "billing",
    github: "#",
    demo: "#",
  },
  {
    title: "API de Analytics en Tiempo Real",
    description:
      "Sistema de analíticas para dashboard empresarial con procesamiento de datos en tiempo real y visualizaciones interactivas.",
    problem: "Datos dispersos dificultaban la toma de decisiones rápidas.",
    solution: "Pipeline de datos con agregaciones en tiempo real y webhooks.",
    stack: ["Node.js", "Express", "PostgreSQL", "WebSockets"],
    image: "analytics",
    github: "#",
    demo: "#",
  },
  {
    title: "Sistema de Automatización de Procesos",
    description:
      "Plataforma de automatización empresarial usando n8n para conectar múltiples servicios y eliminar tareas repetitivas.",
    problem: "Tareas manuales repetitivas consumían tiempo valioso del equipo.",
    solution: "Workflows automatizados con triggers y acciones programables.",
    stack: ["n8n", "Node.js", "Docker", "MySQL"],
    image: "automation",
    github: "#",
    demo: "#",
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
  inventory: (
    <div className="w-full h-48 bg-gradient-to-br from-[#3B82F6]/20 to-[#10B981]/20 flex items-center justify-center">
      <div className="glass rounded-lg p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-xs text-muted-foreground font-mono">inventory.db</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-8 h-6 rounded bg-[#3B82F6]/30" />
          ))}
        </div>
      </div>
    </div>
  ),
  bot: (
    <div className="w-full h-48 bg-gradient-to-br from-[#10B981]/20 to-[#3B82F6]/20 flex items-center justify-center">
      <div className="glass rounded-lg p-4 border border-white/10 max-w-xs">
        <div className="flex flex-col gap-2">
          <div className="self-start bg-muted rounded-lg px-3 py-2 text-xs">Hola, necesito info</div>
          <div className="self-end bg-[#3B82F6] text-white rounded-lg px-3 py-2 text-xs">Claro, te ayudo</div>
          <div className="self-start bg-muted rounded-lg px-3 py-2 text-xs">Gracias!</div>
        </div>
      </div>
    </div>
  ),
  billing: (
    <div className="w-full h-48 bg-gradient-to-br from-[#3B82F6]/20 to-[#10B981]/20 flex items-center justify-center">
      <div className="glass rounded-lg p-4 border border-white/10">
        <div className="text-xs font-mono text-muted-foreground mb-2">FACTURA #001</div>
        <div className="space-y-1">
          <div className="h-2 w-32 bg-foreground/20 rounded" />
          <div className="h-2 w-24 bg-foreground/20 rounded" />
          <div className="h-2 w-28 bg-[#10B981]/50 rounded" />
        </div>
        <div className="mt-3 pt-2 border-t border-white/10 flex justify-between">
          <span className="text-xs text-muted-foreground">Total:</span>
          <span className="text-xs text-[#10B981] font-bold">$1,250.00</span>
        </div>
      </div>
    </div>
  ),
  analytics: (
    <div className="w-full h-48 bg-gradient-to-br from-[#10B981]/20 to-[#3B82F6]/20 flex items-center justify-center">
      <div className="glass rounded-lg p-4 border border-white/10">
        <div className="flex items-end gap-1 h-16">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div
              key={i}
              className="w-4 rounded-t transition-all"
              style={{
                height: `${h}%`,
                background: i % 2 === 0 ? "#3B82F6" : "#10B981",
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Lun</span>
          <span>Dom</span>
        </div>
      </div>
    </div>
  ),
  automation: (
    <div className="w-full h-48 bg-gradient-to-br from-[#3B82F6]/20 to-[#10B981]/20 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </div>
        <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        <div className="w-10 h-10 rounded-lg bg-[#10B981]/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
          </svg>
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
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        techIndex % 2 === 0
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
