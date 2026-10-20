<div align="center">

# 🚀 Portafolio Personal — Tomas Felipe Medina Prada

[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://portafolio-alpha-nine-96.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)

**Sitio web de portafolio profesional que presenta proyectos, habilidades técnicas y experiencia como Desarrollador Backend.**

[🌐 Ver en vivo](https://portafolio-alpha-nine-96.vercel.app) · [📂 Repositorio](https://github.com/Tomfmp2/Portafolio) · [✉️ Contacto](mailto:tom.pradamd@gmail.com)

</div>

---

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#-sobre-el-proyecto)
- [Vista Previa](#-vista-previa)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Uso Local](#-instalación-y-uso-local)
- [Despliegue](#-despliegue)
- [Diseño y experiencia](#-diseño-y-experiencia)
- [Autor](#-autor)
- [Licencia](#-licencia)

---

## 📌 Sobre el Proyecto

Este portafolio fue diseñado y desarrollado para presentar de forma profesional la experiencia, habilidades y proyectos de **Tomas Felipe Medina Prada**, desarrollador Backend con sede en Bucaramanga, Colombia.

El sitio combina un diseño limpio y moderno con un stack tecnológico de alto rendimiento, garantizando accesibilidad, velocidad y una experiencia de usuario fluida en cualquier dispositivo.

**Características principales:**

- ⚡ Renderizado del lado del servidor con **Next.js 16**
- 🎨 Interfaz completamente responsiva con **Tailwind CSS v4**
- 🧩 Componentes accesibles y reutilizables con **Radix UI / shadcn/ui**
- 📊 Analíticas de visitas integradas con **Vercel Analytics**
- 💯 Código 100% tipado en **TypeScript**

---

## 🖼️ Vista Previa

> Visita el sitio en vivo: **[portafolio-alpha-nine-96.vercel.app](https://portafolio-alpha-nine-96.vercel.app)**

---

## 🛠️ Tecnologías

### Frontend

| Tecnología | Versión | Descripción |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.2.0 | Framework React con SSR y App Router |
| [React](https://react.dev/) | 19.2.4 | Biblioteca de interfaces de usuario |
| [TypeScript](https://www.typescriptlang.org/) | 5.7.3 | Tipado estático para JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Framework de estilos utility-first |

### Componentes UI

| Tecnología | Descripción |
|---|---|
| [Radix UI](https://www.radix-ui.com/) | Primitivos de componentes accesibles y sin estilos |
| [shadcn/ui](https://ui.shadcn.com/) | Sistema de componentes construido sobre Radix UI |
| [Lucide React](https://lucide.dev/) | Librería de íconos SVG |
| [Embla Carousel](https://www.embla-carousel.com/) | Carrusel ligero y accesible |
| [Recharts](https://recharts.org/) | Librería de gráficos para React |

### Formularios y Validación

| Tecnología | Descripción |
|---|---|
| [React Hook Form](https://react-hook-form.com/) | Manejo de formularios con alto rendimiento |
| [Zod](https://zod.dev/) | Esquemas de validación con inferencia de tipos |

### Utilidades y DevOps

| Tecnología | Descripción |
|---|---|
| [Vercel](https://vercel.com/) | Plataforma de despliegue y alojamiento |
| [Vercel Analytics](https://vercel.com/analytics) | Análisis de tráfico en tiempo real |
| [next-themes](https://github.com/pacocoursey/next-themes) | Gestión de temas claro/oscuro |
| [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Utilidades para composición de clases CSS |
| [Sonner](https://sonner.emilkowal.ski/) | Componente de notificaciones toast |

---

## 📁 Estructura del Proyecto

```
Portafolio/
├── app/                    # Rutas y páginas (Next.js App Router)
├── components/             # Componentes reutilizables de la UI
├── hooks/                  # Custom hooks de React
├── lib/                    # Utilidades y helpers compartidos
├── public/                 # Archivos estáticos (imágenes, íconos, fuentes)
├── styles/                 # Estilos globales y configuración de Tailwind
├── components.json         # Configuración de shadcn/ui
├── next.config.mjs         # Configuración de Next.js
├── tailwind.config         # Configuración de Tailwind CSS
├── tsconfig.json           # Configuración de TypeScript
└── package.json            # Dependencias y scripts
```

---

## 💻 Instalación y Uso Local

### Requisitos Previos

- [Node.js](https://nodejs.org/) `>= 18.x`
- [npm](https://www.npmjs.com/) `>= 9.x` o [pnpm](https://pnpm.io/)

### Pasos

1. **Clona el repositorio:**

```bash
git clone https://github.com/Tomfmp2/Portafolio.git
cd Portafolio
```

2. **Instala las dependencias:**

```bash
npm install
```

3. **Inicia el servidor de desarrollo:**

```bash
npm run dev
```

4. **Abre en el navegador:**

```
http://localhost:3000
```

### Scripts Disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en modo hot-reload |
| `npm run build` | Genera el build de producción optimizado |
| `npm run start` | Inicia el servidor en modo producción |
| `npm run lint` | Analiza el código con ESLint |

---

## 🚢 Despliegue

El proyecto está desplegado automáticamente en **Vercel** desde la rama `main`.

Cualquier push a `main` dispara un nuevo despliegue en producción.

Para desplegar tu propia instancia:

1. Haz un **fork** de este repositorio.
2. Conéctalo a tu cuenta de [Vercel](https://vercel.com/).
3. Vercel detectará automáticamente la configuración de Next.js y desplegará el sitio.

---

## ✨ Diseño y experiencia

**Concepto: una hoja de vida subrayada.** El sitio se lee como un documento que alguien ya repasó con fosforito: lo que un reclutador debe recordar se subraya en lima mientras se hace scroll, y las notas a mano del margen comentan cada dato. El marcador es el único elemento llamativo; todo lo demás es papel y tinta.

| Token | Valor | Uso |
|---|---|---|
| Papel | `#F2EFE6` | Fondo |
| Tinta | `#111111` | Texto y trazos |
| Marcador | `#D4FF3A` | Solo como fondo de subrayado o relleno, nunca como texto sobre papel (no pasa contraste) |
| Noche | `#141414` | La sección de OCAP |

Tipografía: **Bricolage Grotesque** (títulos y texto, con sus ejes de ancho y tamaño óptico), **Reenie Beanie** solo para las notas a mano y **JetBrains Mono** solo en la terminal.

**Recorrido** (`app/page.tsx`, componentes en `components/site/`):

| Sección | Qué ocurre |
|---|---|
| Precarga | Cortina de tinta con contador. Una vez por sesión; un script en `<head>` evita destellos y la omite con movimiento reducido. |
| Portada | El nombre entra letra a letra, una franja lima se pinta bajo el apellido y se subraya la frase clave. Al empezar a bajar, la portada se queda fija mientras se dibuja un anillo alrededor de "Descargar CV". Con ratón se puede subrayar arrastrando (`HighlighterCanvas`). La cabecera está oculta arriba del todo y aparece al bajar. |
| Si tienes 30 segundos | Escena fija (también en móvil): tres afirmaciones se leen palabra a palabra, se subrayan y se anotan, una tras otra. |
| Verbos | Aprender, construir, probar, entregar, en dos filas que se deslizan en sentidos opuestos. |
| Proyectos | Cada caso cuenta qué aprendí, con una línea que avanza con el scroll. OCAP va en una hoja nocturna que se desliza sobre el papel. |
| Cómo pienso un sistema | Las capas de la arquitectura como placas en CSS 3D que se separan con el scroll. |
| Sobre mí y contacto | Línea de tiempo que se dibuja, correo que se copia con un clic y teclas 3D cuyo Enter también lo copia. |

**Cómo está organizado el movimiento.** `lib/gsap.ts` registra GSAP y sus plugins una sola vez. `components/site/Motion.tsx` aplica los comportamientos comunes por atributo (`data-hl`, `data-note`, `data-lines`, `data-count`, `data-parallax`); cada sección con coreografía propia se marca con `data-motion-owned`. El contenido se vuelve a montar al cambiar de idioma (`key={lang}`) para que SplitText nunca choque con React.

**Escenas de scroll.** Cada momento animado es una escena (`lib/scene.ts`): cuando el bloque llega a su sitio se queda fijo, el scroll reproduce la animación y, al terminar (con un breve respiro, `settle`), la página sigue bajando con normalidad. Son escenas la portada, «Si tienes 30 segundos», los verbos, el título «Proyectos», la cabecera y las lecciones de cada proyecto, la pila de capas y «Sobre mí». Solo se fija lo que cabe en la pantalla: en móvil la cabecera de los proyectos, la pila de capas y el texto de «Sobre mí» se animan mientras pasan. Como React crea las escenas en orden de efectos (hijos antes que padres), `Motion` ordena todos los disparadores por su posición en la página y vuelve a medir al final.

**3D.** Las teclas del contacto (`three/Keycaps.tsx`) están modeladas en código, sin modelos ni HDR descargados. Se cargan solo en el cliente y solo renderizan mientras están en pantalla.

**Accesibilidad y rendimiento.**
- Con `prefers-reduced-motion` todo el texto aparece completo y estático, sin precarga ni 3D animado.
- El cursor lima acompaña al puntero del sistema, que nunca se oculta.
- Las notas que repiten un dato del texto se ocultan a los lectores de pantalla; las cintas animadas tienen su texto equivalente.
- Medido en Chrome headless con GPU: 60 fps durante el scroll continuo con todos los efectos activos.

**Contenido.** Todo el texto, en español e inglés, está en `lib/content.ts`. Las frases entre `==así==` se subrayan.

---

## 👨‍💻 Autor

<div align="center">

**Tomas Felipe Medina Prada**

*Backend Developer — Bucaramanga, Santander, Colombia*

[![Email](https://img.shields.io/badge/Email-tom.pradamd@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:tom.pradamd@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-Tomfmp2-181717?style=for-the-badge&logo=github)](https://github.com/Tomfmp2)
[![Portfolio](https://img.shields.io/badge/Portfolio-Ver%20sitio-000000?style=for-the-badge&logo=vercel)](https://portafolio-alpha-nine-96.vercel.app)

> Especializado en **.NET**, **C#**, **SQL**, **Docker** y **n8n**.
> Disponible para oportunidades remotas o en Colombia.

</div>

---

## 📄 Licencia

Este proyecto es de uso personal. Si deseas usar partes del código como referencia o inspiración, por favor da crédito al autor original.

---

<div align="center">

Hecho con ❤️ usando **Next.js** + **Tailwind CSS** · © 2026 Tomas Felipe Medina Prada

</div>
