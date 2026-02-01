"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveEntry } from "@/utils/storage";
import {
    FaCamera, FaMicrophone, FaStop, FaMapMarkerAlt,
    FaCheck, FaTimes, FaSave, FaArrowLeft, FaCompass
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function NewEntryPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [location, setLocation] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [recording, setRecording] = useState(false);
    const [hasVoice, setHasVoice] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const getLocation = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                setIsLocating(false);
            },
            (err) => {
                console.error(err);
                setIsLocating(false);
                alert("Could not get location. Please check permissions.");
            }
        );
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access denied", err);
        }
    };

    const takePhoto = () => {
        const canvas = document.createElement("canvas");
        const video = videoRef.current;
        if (video) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);
            setPhoto(canvas.toDataURL("image/jpeg"));
            const stream = video.srcObject;
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
            mediaRecorder.onstop = () => {
                setHasVoice(true);
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            console.error("Microphone access denied", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const handleSave = () => {
        if (!title.trim()) return alert("Give your adventure a name.");
        setIsSaving(true);
        saveEntry({ title, content, location, photo, hasVoice });
        setTimeout(() => router.push("/"), 800);
    };

    return (
        <div className="min-h-screen mesh-gradient p-4 pb-40">
            <div className="max-w-2xl mx-auto">
                <header className="flex items-center justify-between mb-12 py-6">
                    <button onClick={() => router.back()} className="p-4 glass rounded-2xl text-slate-400 hover:text-white transition-colors">
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-[0.2em] text-white">New Entry</h1>
                    <div className="w-12 h-12" /> {/* Spacer */}
                </header>

                <div className="space-y-8">
                    {/* Input Group */}
                    <div className="glass-card p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1">Adventure Title</label>
                            <input
                                type="text"
                                placeholder="Where did you go?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-5 text-2xl font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">The Story</label>
                            <textarea
                                placeholder="Describe the feeling, the sights, the sounds..."
                                rows={6}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-5 text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-700 leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Media Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Camera Slot */}
                        <div className="glass-card aspect-square relative group">
                            {photo ? (
                                <>
                                    <img src={photo} className="absolute inset-0 w-full h-full object-cover" />
                                    <button onClick={() => setPhoto(null)} className="absolute top-4 right-4 p-2 glass bg-slate-950/50 rounded-xl text-white">
                                        <FaTimes size={14} />
                                    </button>
                                </>
                            ) : (
                                <button onClick={startCamera} className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-indigo-400 transition-colors">
                                    <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30">
                                        <FaCamera size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Snapshot</span>
                                </button>
                            )}
                            <video ref={videoRef} autoPlay playsInline className={`absolute inset-0 w-full h-full object-cover ${videoRef.current?.srcObject ? 'block' : 'hidden'}`} />
                            {videoRef.current?.srcObject && !photo && (
                                <button onClick={takePhoto} className="absolute bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full border-4 border-slate-900 shadow-2xl flex items-center justify-center active:scale-90 transition-transform" />
                            )}
                        </div>

                        {/* Audio Slot */}
                        <div className="glass-card aspect-square flex flex-col items-center justify-center group">
                            {recording ? (
                                <button onClick={stopRecording} className="flex flex-col items-center gap-4 text-rose-500">
                                    <div className="w-16 h-16 glass bg-rose-500/10 border-rose-500/30 rounded-2xl flex items-center justify-center animate-pulse">
                                        <FaStop size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Recording...</span>
                                </button>
                            ) : hasVoice ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 glass bg-emerald-500/10 border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400">
                                        <FaCheck size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Captured</span>
                                    <button onClick={() => setHasVoice(false)} className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter hover:text-slate-400">Redo</button>
                                </div>
                            ) : (
                                <button onClick={startRecording} className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-pink-400 transition-colors">
                                    <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center group-hover:bg-pink-500/10 group-hover:border-pink-500/30">
                                        <FaMicrophone size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Voice Memo</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Geolocation */}
                    <div className="glass-card p-8 flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center glass transition-colors ${location ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'text-slate-600'}`}>
                                <FaCompass size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Localize</p>
                                <p className="text-sm font-bold text-white font-mono tracking-tight">
                                    {location ? `${location.lat.toFixed(4)}°, ${location.lon.toFixed(4)}°` : 'Awaiting coordinates...'}
                                </p>
                            </div>
                        </div>
                        {!location && (
                            <button
                                onClick={getLocation}
                                disabled={isLocating}
                                className="px-6 py-3 glass bg-white hover:bg-white/90 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                            >
                                {isLocating ? 'Scanning...' : 'Detect'}
                            </button>
                        )}
                    </div>

                    {/* Final CTA */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-6 glass bg-indigo-600 hover:bg-indigo-500 border-none text-white rounded-[2rem] font-black text-xl shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        ) : (
                            <>
                                <FaSave />
                                Preserve Memory
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}