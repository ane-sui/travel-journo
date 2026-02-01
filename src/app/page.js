"use client"; // This tells the browser we're doing stuff here
import { useEffect, useState } from "react"; // React's tools for remembering things and doing things at the start
import Link from "next/link"; // This is how we move between pages
import { getEntries, deleteEntry } from "@/utils/storage"; // This is where the magic happens with saving data
import { FaTrash, FaMapMarkerAlt, FaMicrophone, FaCamera, FaCalendarAlt, FaPlus, FaQuoteLeft } from "react-icons/fa"; // Lots of icons for the buttons
import { motion, AnimatePresence } from "framer-motion"; // This makes things move around smoothly

// The main page of the whole website
export default function HomePage() {
  const [entries, setEntries] = useState([]); // This stores all our travel memories in a list

  // This runs when the page first opens
  useEffect(() => {
    setEntries(getEntries()); // Go get all the memories from the box (storage)
  }, []);

  // This happens when you click the trash can
  const handleDelete = (id) => {
    if (confirm("Move this memory to the archives?")) { // Ask the user if they're sure
      deleteEntry(id); // Delete it from the box
      setEntries(getEntries()); // Update the list on the screen
    }
  };

  return (
    <main className="min-h-screen mesh-gradient p-4 md:p-12">
      <header className="mb-20 pt-10 relative">
        {/* A blurry blue circle in the background for style */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* The big title */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              My Journeys
            </span>
          </h1>
          {/* A cool subtitle with fancy spacing */}
          <div className="flex items-center justify-center gap-3 text-slate-400 uppercase tracking-[0.3em] text-[10px] font-bold">
            <div className="h-px w-8 bg-slate-800" />
            Every mile a story
            <div className="h-px w-8 bg-slate-800" />
          </div>
        </motion.div>
      </header>

      {/* If we have no memories, show this part */}
      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          {/* A big plus sign in a box */}
          <div className="w-32 h-32 glass rounded-[2.5rem] flex items-center justify-center mb-8 rotate-12 transition-transform hover:rotate-0">
            <FaPlus className="text-slate-400 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Blank canvas</h2>
          <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">
            Your journal is waiting for its first chapter. Where will you go next?
          </p>
          {/* Button to go to the writing page */}
          <Link href="/journal" className="mt-10 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-[0_15px_30px_rgba(79,70,229,0.3)] active:scale-95">
            Begin Adventure
          </Link>
        </motion.div>
      ) : (
        /* If we DO have memories, show them in a grid */
        <div className="grid gap-8 max-w-5xl mx-auto md:grid-cols-2 lg:grid-cols-2">
          <AnimatePresence>
            {/* Go through each memory and make a card for it */}
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card group"
              >
                {/* Click the whole card to see the full memory */}
                <Link href={`/entries/${entry.id}`}>
                  <div className="relative h-64 overflow-hidden">
                    {/* If there's a picture, show it. Otherwise show a camera icon. */}
                    {entry.photo ? (
                      <img
                        src={entry.photo}
                        alt={entry.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <FaCamera className="text-slate-800 text-5xl" />
                      </div>
                    )}
                    {/* Dark gradient so text is easy to read */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
                    {/* The date bubble */}
                    <div className="absolute top-4 left-4">
                      <span className="glass bg-slate-900/60 px-3 py-1.5 rounded-xl text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <FaCalendarAlt className="text-indigo-400" />
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      {/* The name of the trip */}
                      <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">
                        {entry.title}
                      </h3>
                      {/* Trash button to delete */}
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Don't follow the link if we click delete!
                          handleDelete(entry.id);
                        }}
                        className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>

                    {/* A little bit of the writing */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3 italic font-light">
                      <FaQuoteLeft className="text-indigo-500/20 mb-2" size={12} />
                      {entry.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      {/* Show coordinates if we have them */}
                      {entry.location && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                          <FaMapMarkerAlt />
                          {entry.location.lat.toFixed(2)}, {entry.location.lon.toFixed(2)}
                        </div>
                      )}
                      {/* Tiny icons for voice and photos */}
                      <div className="flex gap-2 ml-auto">
                        {entry.hasVoice && (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <FaMicrophone size={12} />
                          </div>
                        )}
                        {entry.photo && (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-pink-500/10 border border-pink-500/20 text-pink-400">
                            <FaCamera size={12} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}