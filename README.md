# ¿A Dónde Fui a Parar? / Where the Fvck I've Been?

Una pequeña aplicación web que visualiza los datos de tu Historial de Rutas de Google Maps en un mapa interactivo, ayudándote a descubrir y recordar todas las ciudades que has visitado.

A small web application that visualizes your Google Maps Timeline data on an interactive map, helping you discover and remember all the cities you've visited.

## 🌍 Live Demo / Demo en Vivo

[adondefuiaparar.com](https://adondefuiaparar.com) | [wherethefvckivebeen.com](https://where-the-fvck-i-ve-been.web.app)

## ✨ Características / Features

-   📍 Visualiza tus viajes - Ve todas las ciudades que has visitado en un mapa interactivo
-   📅 Filtra por fecha - Ve visitas por año o mes
-   🏳️ Banderas de países - Cada ciudad está marcada con la bandera de su país
-   🔒 Privacidad primero - Tus datos de rutas se procesan localmente en tu navegador, sólo se utilizan geohashes para resolver los nombres de ciudades con la API de Google Places.
-   🌐 Multi-idoma - Disponible en inglés y español
    map

---

-   📅 Filter by date - View visits by year or month
-   🏳️ Country flags - Each city is marked with its country's flag
-   🔒 Privacy first - Your timeline data is processed locally in your browser, I use geohashes to resolve city names with the help of the Google Places API.
-   🌐 Multilingual - Available in English and Spanish
-   📍 Visualize your travels - See all the cities you've visited on an interactive

## 🔐 Aviso de Privacidad / Privacy Notice

> No se recopilan ni almacenan datos de tu historial de rutas. Tu archivo JSON del Historial de Rutas de Google Maps se procesa completamente en tu navegador. Las únicas llamadas a APIs externas son para resolver coordenadas geohash a nombres de ciudades/países, y estas se almacenan en una caché (Firebase Firestore) para minimizar las solicitudes.

> No timeline data is collected or stored. Your Google Maps Timeline JSON file is processed entirely in your browser. The only external API calls are to resolve geohash coordinates to city/country names, and these are cached (Firebase Firestore) to minimize requests.

## 🏠 Aviso de Alojamiento / Self-Hosted Notice

Esta aplicación está auto-alojada en Firebase. Aunque mi intención es mantenerla funcionando, puede ser desactivada si los costos de alojamiento aumentan demasiado. Si deseas ejecutar tu propia instancia, consulta las instrucciones de despliegue a continuación.

This application is self-hosted on Firebase. While I intend to keep it running, it may be shut down if hosting costs rise too much. If you'd like to run your own instance, see the deployment instructions below.

## 🛠️ Tech Stack

| Layer    | Technology                                             |
| -------- | ------------------------------------------------------ |
| Frontend | React 19, TypeScript, Vite, Leaflet, styled-components |
| Backend  | Firebase Cloud Functions (Node.js)                     |
| Database | Firebase Firestore (geohash cache)                     |
| Hosting  | Firebase Hosting                                       |
| Maps     | MapTiler, Google Places API                            |

## 📁 Project Structure

```
├── frontend/ # React frontend application
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── providers/ # React context providers
│ │ ├── i18n/ # Internationalization
│ │ └── schemas/ # Zod validation schemas
│ └── public/ # Static assets (flags, icons)
├── functions/ # Firebase Cloud Functions
│ └── src/
│ ├── services/ # Firestore & geocoding services
│ ├── utils/ # Geohash utilities
│ └── types/ # TypeScript types
└── scripts/ # Utility scripts (flag processing)
```

## 🚀 Getting Started / Comenzar

### Prerequisites / Requisitos

-   Node.js 22+
-   Firebase CLI
-   Google Cloud account (for Places API)
-   MapTiler account (for map tiles)

### Installation / Instalación

1. Clone the repository / Clona el repositorio:

```bash
git clone https://github.com/cedricborreguin/where-the-fvck-ive-been.git
cd where-the-fvck-ive-been
```

2. Install dependencies / Instala las dependencias:

```bash
cd frontend && npm install
cd ../functions && npm install
```

3. Configure environment variables / Configura las variables de entorno:

```bash
# frontend/.env.local
VITE_BACKEND_URL='http://127.0.0.1:5001/your-project/us-central1/fetchGeohashDetails'
VITE_MAP_TILER_KEY='your_maptiler_key'
```

4. Set up Firebase secrets / Configura los secretos de Firebase:

```bash
firebase functions:secrets:set GOOGLE_MAPS_API_KEY
```

5. Run locally / Ejecuta localmente:

```bash
# Terminal 1 - Functions tsc-watch
cd functions && npm run build:watch

# Terminal 2 - Functions server
firebase emulators:start

# Terminal 3 - Frontend dev server
cd frontend && npm run dev
```

6. 📦 Deployment / Despliegue

```bash
# Build and deploy everything
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only hosting
cd frontend && npm run build
firebase deploy --only hosting
```

## 🎉 PS. Esto fue por diversión / This is for fun

¡Este fue un proyecto divertido de fin de semana! Comenzó cómo una forma para que yo pudiera visualizar mis propios viajes, pero creí que otras personas podrían encontrarlo de utilidad.

This was a fun weekend project! It started as a way for me to visualize my own travels, but I thought others might find it useful.

## 📄 Licencia / License

Este proyecto está licenciado bajo la **GNU General Public License v3.0 (GPL-3.0)**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**. See the [LICENSE](./LICENSE) file for details.

## 👨‍💻 Author / Autor

Cedric Borreguín

[Instagram](https://www.instagram.com/cedricborreguin/) | [LinkedIn](https://www.linkedin.com/in/cedricborreguin/) | [TikTok](https://www.tiktok.com/@cedricborreguin)
