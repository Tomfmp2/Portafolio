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
- [Secciones del Portafolio](#-secciones-del-portafolio)
- [Experiencia de partículas](#-experiencia-de-partículas)
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
- 🌙 Soporte para modo claro/oscuro con `next-themes`
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

## 🗂️ Secciones del Portafolio

Cada sección es un capítulo del scroll. Una sola nube de partículas se reensambla en la forma de cada capítulo:

| Sección (`id`) | Forma de las partículas | Contenido |
|---|---|---|
| Inicio (`#inicio`) | Commodore 64 | Nombre, rol, CV y acceso a proyectos |
| Cómo trabajo (`#habilidades`) | Cuatro anillos concéntricos | Clean Architecture capa por capa, con el stack de cada una |
| OCAP (`#proyectos`) | Grafo de servicios sobre una esfera | Proyecto destacado .NET |
| Feria Mágica (`#feria-magica`) | Bola de nieve | Web y API en producción para un cliente |
| Más proyectos (`#mas-proyectos`) | Pantalla en modo texto | Proyectos de formación y demos en terminal |
| Sobre mí (`#sobre-mi`) | Nube dispersa | Formación y datos personales |
| Contacto (`#contacto`) | Monograma `tfm` | Correo, CV y formulario |

---

## ✨ Experiencia de partículas

**Cómo funciona.** `components/experience/` dibuja un único `THREE.Points` fijo detrás de la página. La geometría guarda las siete formas como atributos (`a_c64`, `a_layers`, …) y el vertex shader las mezcla con pesos, así que cambiar de forma no copia datos en la CPU.

**Una sola fuente de verdad.** `lib/experience/chapters.ts` define el orden de los capítulos y la pose de cámara y objeto de cada uno (escritorio y móvil). `Experience.tsx` traduce el scroll a un número, `scrollState.chapter` (2.4 = 40 % del camino entre el capítulo 2 y el 3), mediante un `ScrollTrigger` por sección. La forma, la cámara y la turbulencia se derivan de ese número en `useFrame`. No hay timelines paralelos que puedan desincronizarse.

**Un viaje, no diapositivas.** Cada capítulo es una estación más al fondo de la escena (`stationAt`, separadas por `STATION_GAP` y con una trayectoria que serpentea). Mientras la nube cambia de forma, la cámara vuela a la siguiente estación y atraviesa un portal con el número y el nombre del nivel. La velocidad del vuelo (`journey.warp`) abre el campo de visión, estira las partículas y las estrellas en estelas y aumenta la aberración cromática. El decorado vive en `components/experience/World.tsx`: rejilla retro en el suelo, polvo, bloques de píxeles y portales. Solo aporta profundidad; no contiene información.

**Accesibilidad y rendimiento.**
- El scroll es nativo (Lenis solo lo suaviza en escritorio); nada se fija con pin ni secuestra el desplazamiento.
- `prefers-reduced-motion`: la escena salta a cada forma sin animar, sin turbulencia, parallax ni estelas, y renderiza bajo demanda. Los textos aparecen completos y sin efectos.
- Postproducción (bloom, aberración cromática y viñeta) solo en equipos que no son de bajo consumo.
- Sin WebGL se muestra un fondo estático; todo el contenido está en el DOM.
- Partículas: 36 000 en escritorio, 22 000 en equipos de bajo consumo y 14 000 en móvil.
- Medido con Chrome y GPU real (Intel UHD): 60 fps durante el scroll, también con la CPU estrangulada ×4.

**Capa de juego.** El portafolio se recorre como un juego, con el C64 como hilo conductor:

| Pieza | Archivo | Qué hace |
|---|---|---|
| Pantalla de arranque | `components/experience/BootScreen.tsx` | Arranque de C64 que pide elegir con o sin sonido; al entrar se encoge dentro del monitor de partículas. Se muestra una vez por sesión, se cierra con Escape y no aparece sin JavaScript. |
| Partículas interactivas | `components/experience/ParticleCloud.tsx` | El cursor las empuja, un clic o un toque lanza una onda y arrastrar gira el objeto. Mover el ratón rápido agita la bola de nieve. Pasar el cursor (o el foco) por una capa de «Cómo trabajo» levanta su anillo. |
| Disquetes | `components/experience/Floppies.tsx` | Un disquete de 5¼" por proyecto: al hacer clic carga la demo de terminal o abre el repositorio. La lista del DOM ofrece las mismas acciones con teclado. |
| HUD | `components/experience/Hud.tsx` | Niveles 1–7 (clicables), una pista de control por nivel, sonido y consola. |
| Consola | `components/experience/Console.tsx` | Se abre con `/`. Comandos como `AYUDA`, `LISTA`, `IR 3`, `CARGAR "OCAP"`, `DEMO BANCO`, `CV`, `SONIDO` e `IDIOMA`. |
| Tipografía | `components/experience/TextFx.tsx`, `SplitChars.tsx` | Los títulos se arman letra a letra y las etiquetas se descifran como en la pantalla del C64. En escritorio, el texto de cada capítulo llega desde el fondo y pasa junto a la cámara al salir. Las letras del nombre reaccionan al cursor. `SplitChars` genera las letras con React, así que el cambio de idioma no rompe nada. |
| Sonido | `lib/experience/sound.ts` | Efectos tipo chip SID sintetizados con WebAudio, sin archivos. Solo suenan si el visitante lo elige. |

El DOM y la escena se comunican mediante `lib/experience/store.ts` (estado mutable que la escena lee en cada frame, más eventos para React). La capa de la página (`.page-ui`) deja pasar los eventos del puntero al canvas, salvo en el texto, la navegación y los diálogos.

**Modelos.** Los modelos originales no se descargan en el sitio (el C64 pesa unos 100 MB por sus texturas 4K). `scripts/bake-particles.mjs` muestrea su superficie una sola vez y guarda 40 000 puntos en `public/particles/*.bin` (234 KB cada uno). Para regenerarlos:

```bash
node scripts/bake-particles.mjs commodore_64__computer_full_pack.glb public/particles/c64.bin \
  --count 40000 --weight cable=0 --weight connector=0 --weight peripherals=0 \
  --weight monitor_plug=0 --weight monitor_screen=2.5
node scripts/bake-particles.mjs snow_globe.glb public/particles/globe.bin \
  --count 40000 --weight material_0=0.15 --weight Material.003=0.2 --weight sneg=0.7
```

Las formas restantes (anillos, grafo, pantalla, nube y monograma) son procedurales a propósito: son diagramas, no sustitutos de modelos.

**Créditos (CC BY 4.0, atribución obligatoria, visible en el footer):**
- [Commodore 64 || Computer (Full Pack)](https://sketchfab.com/3d-models/commodore-64-full-pack-1f43612fa2d54041bbe2bdff8164c2cd) de dark_igorek.
- [Snow Globe](https://sketchfab.com/3d-models/none-090bfce9ce394b11bcef261636827b94) de celestial fox.

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
