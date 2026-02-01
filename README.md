
# Travel Journal

Travel Journal is an offline-ready web app built with Next.js that lets users save travel memories with photos, voice notes, and location tags.

## Features

* Installable as a PWA on mobile and desktop
* Works offline using Service Workers and local storage
* Capture photos with the device camera
* Record voice notes with the microphone
* Save location using geolocation
* Responsive, clean UI

## Tech Stack

* Next.js, React, Tailwind CSS
* PWA (Service Workers, Cache API)
* react-icons

## Run Locally

1. Install packages

```bash
npm install
```

2. Start server

```bash
npm run dev
```

3. Open
   [http://localhost:3000](http://localhost:3000)

## Structure

* `src/app` – Pages and routing
* `src/components` – UI components
* `src/utils` – Storage helpers
* `public` – Manifest and icons

## PWA Setup

* Manifest in `public/manifest.json`
* Service worker via `next-pwa`
* Offline detection with `navigator.onLine`

