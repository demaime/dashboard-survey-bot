# Encuestas Guazú - Dashboard

Dashboard de análisis en tiempo real para visualizar y exportar los resultados de encuestas recopiladas por un bot de WhatsApp. Construido con Next.js, MongoDB y Recharts.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-latest-47A248?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## Funcionalidades

### Panel de estadísticas

El header muestra tres tarjetas con métricas clave:

- **Total Encuestas** — cantidad total de encuestas almacenadas en la base de datos.
- **Encuestas Hoy** — cantidad de encuestas recibidas en el día actual.
- **Última respuesta recibida** — fecha y hora de la encuesta más reciente.

### Vista de Gráficos

Genera gráficos de barras interactivos (Recharts) para cada pregunta de la encuesta:

| Pregunta | Tipo        | Contenido                                                    |
| -------- | ----------- | ------------------------------------------------------------ |
| 1        | Lista       | ¿Qué imagen tenés del gobierno de Javier Milei?              |
| 2        | Botones     | ¿Pensás que la economía en los próximos meses va a estar...? |
| 2a       | Texto libre | ¿Por qué creés que va a estar peor?                          |
| 3        | Lista       | ¿Cuál es el máximo nivel de estudios que alcanzaste?         |
| 4        | Botones     | ¿Podés indicarme tu género?                                  |

Cada gráfico incluye al pie un resumen con total de respuestas, cantidad de opciones y el valor más popular.

### Nube de palabras

Para la pregunta abierta (2a), se genera una nube de palabras usando `d3-cloud` que visualiza las respuestas de texto libre. Las palabras se filtran con un diccionario de _stopwords_ en español para mostrar únicamente términos relevantes.

### Base de datos (tabla)

Vista tabular de todas las encuestas con:

- Búsqueda por nombre, teléfono o respuesta.
- Ordenamiento: más recientes, más antiguas o alfabético por nombre.
- Filas expandibles que muestran el detalle de cada respuesta.
- Datos del encuestado: nombre de usuario de WhatsApp, número de teléfono y fecha.

### Exportar a PDF

Genera un reporte PDF completo con `@react-pdf/renderer` que incluye:

- **Portada** con estadísticas generales (total, encuestas del día, última respuesta).
- **Una página por pregunta** con gráfico de barras renderizado nativamente en el PDF.
- **Página de nube de palabras** capturada como imagen PNG desde el DOM usando `html-to-image`.

El archivo se descarga automáticamente con el nombre `encuestas-guazu-YYYY-MM-DD.pdf`.

### Tema claro / oscuro

Toggle de tema con `next-themes`. El tema por defecto es oscuro.

## Tech Stack

| Categoría        | Tecnología                          |
| ---------------- | ----------------------------------- |
| Framework        | Next.js 16 (App Router)             |
| UI               | React 19, Tailwind CSS 4, shadcn/ui |
| Base de datos    | MongoDB                             |
| Gráficos         | Recharts                            |
| Nube de palabras | d3-cloud, d3-scale                  |
| Exportación PDF  | @react-pdf/renderer, html-to-image  |
| Animaciones      | Framer Motion                       |
| Analytics        | Vercel Analytics                    |
| Tipografía       | Rubik (Google Fonts)                |

## Estructura del proyecto

```
dashboard-testbot/
├── app/
│   ├── api/surveys/route.ts    # API GET → MongoDB
│   ├── layout.tsx              # Layout con ThemeProvider
│   ├── page.tsx                # Página principal
│   └── globals.css
├── components/
│   ├── ui/                     # Componentes shadcn/ui
│   ├── charts-view.tsx         # Gráficos de barras + nube de palabras
│   ├── data-table.tsx          # Tabla con búsqueda y expansión
│   ├── export-pdf-button.tsx   # Botón de exportar PDF
│   ├── pdf-document.tsx        # Estructura del documento PDF
│   ├── word-cloud.tsx          # Componente de nube de palabras (SVG)
│   ├── theme-toggle.tsx        # Toggle claro/oscuro
│   └── theme-provider.tsx      # Provider de next-themes
├── lib/
│   ├── survey-questions.ts     # Definición de preguntas y opciones
│   ├── stopwords-es.ts         # Stopwords en español + función cleanText
│   └── utils.ts                # Utilidad cn()
└── hooks/
    ├── use-mobile.ts
    └── use-toast.ts
```

## Requisitos previos

- Node.js 18+
- Una instancia de MongoDB con la base de datos `guazu-bot` y la colección `surveys`
