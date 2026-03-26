"use client";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3B82F6]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#10B981]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Disponible para nuevos proyectos
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance">
              <span className="text-foreground">Hola, soy </span>
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#10B981] bg-clip-text text-transparent">
                Tomas Felipe
              </span>
              <br />
              <span className="text-foreground">Medina Prada</span>
            </h1>

            <p className="text-xl sm:text-2xl text-[#3B82F6] font-semibold mb-4">
              Desarrollador Backend
            </p>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 text-pretty">
              Especializado en crear soluciones robustas con{" "}
              <span className="text-[#3B82F6] font-medium">.NET</span>,{" "}
              <span className="text-[#3B82F6] font-medium">C#</span>,{" "} y{" "}
              <span className="text-[#3B82F6] font-medium">SQL</span>.
              Automatizo procesos con{" "}
              <span className="text-[#10B981] font-medium">Docker</span> y{" "}
              <span className="text-[#10B981] font-medium">n8n</span> para
              impulsar la eficiencia de tu negocio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#proyectos"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#3B82F6]/25 hover:-translate-y-0.5"
                aria-label="Ver mis proyectos"
              >
                <span>Ver proyectos</span>
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                aria-label="Contactar conmigo"
              >
                <span>Contactar</span>
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
              </a>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-[#3B82F6]">
                  1+
                </p>
                <p className="text-sm text-muted-foreground">
                  Años de experiencia
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-[#10B981]">
                  15+
                </p>
                <p className="text-sm text-muted-foreground">
                  Proyectos completados
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-[#3B82F6]">
                  100%
                </p>
                <p className="text-sm text-muted-foreground">Compromiso</p>
              </div>
            </div>
          </div>

          {/* Visual Block */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Main card with code preview */}
              <div className="relative glass rounded-2xl border border-white/10 p-6 shadow-2xl">
                {/* Terminal header */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-sm text-muted-foreground font-mono">
                    backend.cs
                  </span>
                </div>

                {/* Code snippet */}
                <pre className="text-sm font-mono overflow-x-auto">
                  <code>
                    <span className="text-[#3B82F6]">public class</span>{" "}
                    <span className="text-[#10B981]">ApiService</span>
                    {"\n"}
                    {"{"}
                    {"\n"}
                    {"  "}
                    <span className="text-[#3B82F6]">private readonly</span>{" "}
                    ILogger _logger;
                    {"\n\n"}
                    {"  "}
                    <span className="text-[#3B82F6]">public async</span>{" "}
                    Task&lt;Result&gt;
                    {"\n"}
                    {"  "}
                    <span className="text-[#10B981]">ProcessRequest</span>
                    (Request req)
                    {"\n"}
                    {"  {"}
                    {"\n"}
                    {"    "}
                    <span className="text-muted-foreground">
                      {"// Validación y procesamiento"}
                    </span>
                    {"\n"}
                    {"    "}
                    <span className="text-[#3B82F6]">await</span>{" "}
                    _db.SaveAsync(req);
                    {"\n"}
                    {"    "}
                    <span className="text-[#3B82F6]">return</span>{" "}
                    Result.Success();
                    {"\n"}
                    {"  }"}
                    {"\n"}
                    {"}"}
                  </code>
                </pre>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 glass rounded-xl border border-white/10 p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
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
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      APIs REST
                    </p>
                    <p className="text-xs text-muted-foreground">Escalables</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 glass rounded-xl border border-white/10 p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
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
                        d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 22V12h6v10M9 12V8h6v4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Docker
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Contenedores
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a
          href="#sobre-mi"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Ir a la siguiente sección"
        >
          <span className="text-xs">Scroll</span>
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
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
