# Travel Journal Pro PWA

A premium, offline-capable travel journal application built with Next.js. Capture your memories with photos, voice notes, and geolocation.

## Features

- **Installable (PWA)**: Add to home screen and use like a native app.
- **Offline First**: Works without internet connection using Service Workers and LocalStorage.
- **Native Device Features**:
  - **Camera**: Capture stunning travel moments directly in the app.
  - **Microphone**: Record voice memos to remember the sounds of your journey.
  - **Geolocation**: Automatically tag your entries with precise coordinates.
- **Premium Design**: Modern aesthetic with glassmorphism, smooth animations (Framer Motion), and responsive layout.

## Technologies

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **PWA**: `next-pwa`, Service Workers, Cache API
- **Icons**: `react-icons`

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Page components and routing.
- `src/components`: Reusable UI components (Navbar, OfflineStatus).
- `src/utils`: Helper functions (Storage).
- `public`: Static assets including the manifest and icons.

## PWA Implementation Details

- **Manifest**: Located in `public/manifest.json`, defines app identity and colors.
- **Service Worker**: Configured via `next-pwa` in `next.config.mjs` for caching strategy (Stale-while-revalidate).
- **Offline Detection**: `OfflineStatus.js` uses `navigator.onLine` to inform users of their connectivity status.
# travel-journal
