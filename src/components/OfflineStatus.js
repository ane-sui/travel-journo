"use client"; // This is for client-side stuff
import { useState, useEffect } from "react"; // Hooking into React's brain
import { FaWifi, FaExclamationTriangle } from "react-icons/fa"; // Icons for wifi and warning
import { motion, AnimatePresence } from "framer-motion"; // For the fancy moving parts

// This component checks if the internet is working or not
export default function OfflineStatus() {
    const [isOffline, setIsOffline] = useState(false); // Are we offline? Default is no.

    useEffect(() => {
        // This runs once when we start
        setIsOffline(!navigator.onLine); // Check the browser to see if we have internet

        // These tell us when the internet comes back or goes away
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        // Listen for the "online" and "offline" events
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Clean up when we're done so it doesn't leave a mess
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // This puts the little popup on the screen
    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }} // Start above the screen
                    animate={{ y: 0, opacity: 1 }} // Slide down
                    exit={{ y: -50, opacity: 0 }} // Slide back up
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
                >
                    {/* The box that says you are offline */}
                    <div className="glass bg-rose-500/10 border-rose-500/20 px-6 py-4 rounded-2xl flex items-center justify-between shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center animate-pulse">
                                <FaWifi className="text-white transform rotate-45" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Offline Mode</h4>
                                <p className="text-rose-200/60 text-xs">Capturing memories locally...</p>
                            </div>
                        </div>
                        {/* Little warning triangle */}
                        <FaExclamationTriangle className="text-rose-500/40" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

