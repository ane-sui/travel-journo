"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getEntryById, deleteEntry } from "@/utils/storage";
import {
    FaArrowLeft, FaTrash, FaMapMarkerAlt,
    FaCalendarAlt, FaMicrophone, FaCamera, FaQuoteLeft
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function EntryDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [entry, setEntry] = useState(null);

    useEffect(() => {
        const data = getEntryById(id);
        if (!data) router.push("/");
        else setEntry(data);
    }, [id]);

    const handleDelete = () => {
        if (confirm("Permanently archive this memory?")) {
            deleteEntry(id);
            router.push("/");
        }
    };

    if (!entry) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen mesh-gradient pb-40"
        >
            {/* Immersive Header */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                {entry.photo ? (
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                        src={entry.photo}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <FaCamera className="text-slate-800 text-9xl opacity-20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10">
                    <button
                        onClick={() => router.back()}
                        className="p-5 glass text-white hover:bg-white/10 transition-all rounded-3xl"
                    >
                        <FaArrowLeft />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-5 glass text-rose-400 hover:bg-rose-500/20 transition-all rounded-3xl"
                    >
                        <FaTrash />
                    </button>
                </div>

                <div className="absolute bottom-12 left-8 right-8 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
                            {entry.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6">
                            <span className="glass px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-3">
                                <FaCalendarAlt />
                                {new Date(entry.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </span>
                            {entry.location && (
                                <span className="glass px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-300 flex items-center gap-3">
                                    <FaMapMarkerAlt />
                                    {entry.location.lat.toFixed(4)}, {entry.location.lon.toFixed(4)}
                                </span>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Narrative Content */}
            <div className="px-8 max-w-4xl mx-auto -mt-10 relative z-20 space-y-12">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-12 relative overflow-hidden"
                >
                    <FaQuoteLeft className="text-indigo-500/10 absolute top-8 left-8" size={60} />
                    <p className="text-slate-200 text-xl leading-relaxed whitespace-pre-wrap relative z-10 font-light first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-indigo-400">
                        {entry.content || "An untold story, captured in time."}
                    </p>
                </motion.div>

                {entry.hasVoice && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="glass-card p-10 flex flex-col items-center text-center gap-6 group"
                    >
                        <div className="w-20 h-20 glass bg-indigo-500/10 border-indigo-500/30 rounded-[2rem] flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                            <FaMicrophone size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Voice Memo</h3>
                            <p className="text-slate-500 text-sm font-medium">
                                Echoes of the journey, archived forever.
                            </p>
                        </div>
                        <div className="w-full max-w-md h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                            <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full w-2/3 animate-pulse" />
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
