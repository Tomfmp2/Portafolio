"use client";

const skillCategories = [
  {
    title: "Lenguajes",
    color: "#3B82F6",
    skills: [
      { name: "C#", level: 90 },
      { name: "JavaScript", level: 85 },
      { name: "Python", level: 80 },
      { name: "SQL", level: 90 },
    ],
  },
  {
    title: "Frameworks & Runtimes",
    color: "#10B981",
    skills: [
      { name: ".NET", level: 90 },
      { name: "Vite", level: 85 },
      { name: "ASP.NET Core", level: 88 },
    ],
  },
  {
    title: "Bases de Datos",
    color: "#3B82F6",
    skills: [
      { name: "MySQL", level: 88 },
      { name: "SQL Server", level: 90 },
    ],
  },
  {
    title: "Herramientas & DevOps",
    color: "#10B981",
    skills: [
      { name: "Docker", level: 85 },
      { name: "n8n", level: 90 },
      { name: "Git/GitHub", level: 92 },
      { name: "Telegram Bots", level: 80 },
    ],
  },
];

const techBadges = [
  { name: ".NET", category: "framework" },
  { name: "C#", category: "language" },
  { name: "Docker", category: "devops" },
  { name: "MySQL", category: "database" },
  { name: "n8n", category: "automation" },
  { name: "Git", category: "devops" },
  { name: "REST APIs", category: "concept" },
  { name: "SQL Server", category: "database" },
  { name: "TypeScript", category: "language" },
];

export default function Skills() {
  return (
    <section id="habilidades" className="relative py-20 lg:py-32 bg-muted/30">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-[#10B981]/10 text-[#10B981] text-sm font-medium mb-4">
            Mis Skills
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Habilidades Técnicas
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tecnologías y herramientas que utilizo para crear soluciones backend robustas
          </p>
        </div>

        {/* Tech badges cloud */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {techBadges.map((badge, index) => (
            <span
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 cursor-default ${index % 2 === 0
                ? "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 hover:bg-[#3B82F6]/20"
                : "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981]/20"
                }`}
            >
              {badge.name}
            </span>
          ))}
        </div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="glass rounded-2xl border border-white/10 p-6 lg:p-8 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: category.color }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-5">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {skill.name}
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: category.color }}
                      >
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${skill.level}%`,
                          background: `linear-gradient(to right, ${category.color}, ${category.color}cc)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-6 sm:gap-12 glass rounded-2xl border border-white/10 p-6 sm:p-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#3B82F6] mb-1">3+</p>
              <p className="text-sm text-muted-foreground">Lenguajes</p>
            </div>
            <div className="hidden sm:block w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-[#10B981] mb-1">3+</p>
              <p className="text-sm text-muted-foreground">Frameworks</p>
            </div>
            <div className="hidden sm:block w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-[#3B82F6] mb-1">4+</p>
              <p className="text-sm text-muted-foreground">Bases de Datos</p>
            </div>
            <div className="hidden sm:block w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-[#10B981] mb-1">5+</p>
              <p className="text-sm text-muted-foreground">Herramientas DevOps</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
