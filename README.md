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

### Animación y 3D

| Tecnología | Descripción |
|---|---|
| [GSAP](https://gsap.com/) | Núcleo, Observer (rueda y gestos), SplitText, DrawSVG y CustomEase para la baraja de escenas |
| [React Three Fiber](https://r3f.docs.pmnd.rs/) + [drei](https://drei.docs.pmnd.rs/) | Las teclas 3D del contacto (se cargan solo al acercarse) |
| [Framer Motion](https://motion.dev/) + [Lucide](https://lucide.dev/) | La terminal de demos (se carga solo al abrirla) |

### Utilidades y DevOps

| Tecnología | Descripción |
|---|---|
| [Vercel](https://vercel.com/) | Plataforma de despliegue y alojamiento |
| [Vercel Analytics](https://vercel.com/analytics) | Análisis de tráfico |

---

## 📁 Estructura del Proyecto

```
Portafolio/
├── app/                    # Rutas y páginas (Next.js App Router)
├── components/site/        # Secciones y piezas del sitio
├── hooks/                  # Custom hooks de React
├── lib/                    # Utilidades y helpers compartidos
├── public/                 # Archivos estáticos (imágenes, íconos, fuentes)
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

**Concepto: una hoja de vida subrayada.** El sitio se recorre como un documento que alguien ya repasó con fosforito: lo que un reclutador debe recordar se subraya en lima y las notas a mano del margen comentan cada dato. El marcador es el único elemento llamativo; todo lo demás es papel y tinta.

| Token | Valor | Uso |
|---|---|---|
| Papel | `#F2EFE6` | Fondo |
| Tinta | `#111111` | Texto y trazos |
| Marcador | `#D4FF3A` | Solo como fondo de subrayado o relleno, nunca como texto sobre papel (no pasa contraste) |
| Noche | `#141414` | La escena de OCAP |

Tipografía: **Bricolage Grotesque** (títulos y texto, con sus ejes de ancho y tamaño óptico), **Reenie Beanie** solo para las notas a mano y **JetBrains Mono** solo en la terminal.

### Navegación: una baraja de escenas

La ventana no hace scroll. El sitio es una baraja de 10 escenas a pantalla completa (`components/site/Deck.tsx`, estado en `lib/deck.ts`) y solo una está activa. La rueda, el gesto de deslizar (GSAP Observer), las flechas, AvPág, espacio, Inicio y Fin piden avanzar o retroceder; el controlador decide:

1. Si la escena es más alta que la pantalla (formulario, listas en móvil), primero se recorre su contenido; la escena solo cambia cuando ese recorrido descansa en el borde.
2. Si la escena tiene pasos (las tres afirmaciones, las dos composiciones de cada proyecto, las cuatro capas), avanza un paso.
3. Si no, transiciona a la escena siguiente.

Cada transición es una sola línea de tiempo de GSAP en tres tiempos: sale el contenido de la escena actual, cambia el escenario y entra el contenido de la siguiente (`changeStage`, `enterContent` y `leaveContent` en `lib/reveal.ts`). Hay tres cambios de escenario: **empuje en profundidad** (la escena se aleja y se inclina mientras la nueva llega por debajo), **barrido** (una franja lima inclinada cubre la pantalla y la descubre ya cambiada) e **iris** (la noche de OCAP se abre en círculo). Cada escena declara cuál usa al entrar en `app/page.tsx`.

Cada escena registra con `useScene` su entrada, su salida y sus pasos. Lo común se marca con atributos y lo resuelve `lib/reveal.ts`: `data-lines` (un bloque de marcador pasa sobre cada línea de un título), `data-reveal` (cortinilla con sesgo, `"x"` de lado), `data-hl` (subrayado), `data-note` (nota a mano) y `data-count` (contador). Lo que una escena anima por su cuenta va dentro de `data-motion-owned`.

**Reglas del controlador.** Los gestos (rueda, tacto) se descartan durante una transición y en los 420 ms siguientes, para que la inercia del trackpad no se convierta en pasos de más; las teclas, los controles y los enlaces sí se guardan y se ejecutan al terminar. La entrada vuelve a aceptarse en cuanto el escenario ha cambiado, aunque el contenido siga animándose: si llega otra orden, esa animación se completa al instante. Con el menú o un diálogo abiertos, la baraja no se mueve.

**Controles y enlaces.** Índice lateral con las 10 escenas, contador con el nombre de la escena y botones de anterior y siguiente; en móvil, contador y botones. Cada escena tiene su hash (`#proyectos`, `#ocap`, `#contacto`…): el menú, los botones internos, los enlaces directos y el botón Atrás del navegador llevan a ella. El cambio de idioma conserva la escena. Un aviso para lectores de pantalla anuncia cada cambio, y con teclado el foco pasa a la escena nueva.

**Sin animación.** Con `prefers-reduced-motion` (o sin JavaScript) la baraja no se activa: la página es un documento normal con scroll nativo, todas las escenas en orden y su contenido completo. El script del `<head>` decide el modo antes del primer pintado.

### Las escenas

| Escena | Entrada, pasos y salida |
|---|---|
| Inicio | Cartel: el nombre ocupa todo el ancho y sus letras suben desde la línea base pasando de trazo fino a grueso; se dibujan la regla y la franja bajo el apellido, cae un sello giratorio y un rasgo rotativo se subraya. Con ratón, las letras cercanas al cursor se afinan y ensanchan (ejes `wght`/`wdth` de la fuente variable); en reposo o en táctil una ola las recorre sola. Hora local en vivo. Salida: las letras se hunden en su línea base. |
| Lo importante | Tres pasos: cada afirmación entra palabra a palabra girando en 3D, se subraya y se anota; la anterior se dispersa. |
| Cómo trabajo | Las filas de verbos cruzan la pantalla en sentidos opuestos y los verbos en contorno se entintan. |
| Proyectos | Las letras caen desde distintas alturas y tamaños y se traza la franja; salen estallando. |
| Feria Mágica, OCAP | Dos composiciones: primero el proyecto (nombre, resumen, cifras que cuentan); después el nombre se encoge a la esquina y las lecciones ocupan la escena con una línea que se dibuja. OCAP entra en iris y es nocturna. |
| Otros proyectos | Las filas entran de lado; tres abren la terminal de demos. |
| Cómo pienso | Cuatro pasos: la pila de placas en CSS 3D se abre y cada paso levanta una capa, del núcleo hacia fuera. Las placas salen volando. |
| Sobre mí | La línea de tiempo se dibuja y cada etapa entra al alcanzarla. |
| Contacto | Correo que se copia con un clic, formulario, teclas 3D (el Enter también copia el correo) y el pie. |

**Interacción.** Botones magnéticos, letras del nombre que pasan a contorno bajo el cursor, verbos que se subrayan al pasar, capas cuya placa se levanta al señalar su descripción y puntos de las lecciones que laten.

**3D.** Las teclas del contacto (`three/Keycaps.tsx`) están modeladas en código, sin modelos ni HDR descargados. three.js se descarga la primera vez que se llega al contacto y solo se renderiza mientras esa escena está activa (en modo documento, al acercarse).

**Accesibilidad y rendimiento.**
- El cursor lima acompaña al puntero del sistema, que nunca se oculta.
- Las notas que repiten un dato se ocultan a los lectores de pantalla; las cintas animadas tienen su texto equivalente.
- Medido con el build de producción en Chrome headless con GPU: 205 KB de JavaScript al cargar, transiciones a 60 fps y unos 80 ms de bloqueo del hilo principal en escritorio (unos 330 ms con la CPU 4 veces más lenta).

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
