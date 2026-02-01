"use client"; // This makes it work in the browser
import Link from "next/link"; // Tool for jumping between pages
import { usePathname } from "next/navigation"; // Tells us which page we are on right now
import { FaHome, FaPlus, FaCamera } from "react-icons/fa"; // Icons for the bottom bar
import { motion } from "framer-motion"; // For the smooth sliding dot

// This is the menu at the bottom of the screen
export default function Navbar() {
    const pathname = usePathname(); // Get the current web address

    // These are the buttons we want in the menu
    const links = [
        { href: "/", icon: FaHome, label: "Home" },
        { href: "/journal", icon: FaPlus, label: "New Entry", primary: true }, // The big plus button in the middle
        { href: "/camera", icon: FaCamera, label: "Camera" },
    ];

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 glass rounded-full flex items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Loop through each link and make a button */}
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href; // Is this the page we're on?

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="relative flex flex-col items-center group"
                    >
                        {/* If it's the primary button (the plus), make it bigger and blue */}
                        {link.primary ? (
                            <div className="bg-indigo-600 p-4 rounded-2xl -mt-10 mb-1 shadow-lg shadow-indigo-600/30 group-hover:scale-110 group-hover:-translate-y-1 transition-all">
                                <Icon className="text-white text-xl" />
                            </div>
                        ) : (
                            <>
                                {/* Normal buttons change color when active */}
                                <Icon
                                    className={`text-xl transition-colors ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                                        }`}
                                />
                                {/* A little dot that appears under the active button */}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-dot"
                                        className="absolute -bottom-1 w-1 h-1 bg-indigo-400 rounded-full"
                                    />
                                )}
                            </>
                        )}
                        {/* The label under the icon */}
                        <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isActive ? "text-indigo-400" : "text-slate-500"
                            }`}>
                            {link.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}

