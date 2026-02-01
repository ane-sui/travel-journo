import Navbar from "@/components/Navbar";
import OfflineStatus from "@/components/OfflineStatus";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import "./globals.css";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <title>Travel Journal Pro</title>
      </head>
      <body className="bg-gray-950 text-gray-100 overflow-x-hidden pb-24">
        <ServiceWorkerRegistration />
        <OfflineStatus />
        {children}
        <Navbar />
      </body>
    </html>
  );
}
