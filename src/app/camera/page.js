"use client"; // This says we are using the client side of things
import { useState, useRef } from "react"; // We need some react stuff to remember things
import { FaMicrophone, FaStop, FaDownload, FaPlay, FaWaveSquare } from "react-icons/fa"; // These are some icons from a library I found

// This is the big function that does everything for the memo page
export default function TravelVoiceMemo() {
    const [recording, setRecording] = useState(false); // Variable to keep track if we are recording or not. Starts at no.
    const [audioURL, setAudioURL] = useState(null); // This is where the music goes after we record it
    const mediaRecorderRef = useRef(null); // I think this is a container for the recorder
    const audioChunksRef = useRef([]); // This stores the sound bits as they come in

    // This part starts the actual recording. Hope I did it right!
    const startRecording = async () => {
        try {
            // Ask the person if they can use the mic. Fingers crossed they say yes.
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream); // This makes the blue thing that records

            // When new sound comes in, put it in the list
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            // This part stops it and makes the file
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" }); // Mix all sound bits together
                const url = URL.createObjectURL(audioBlob); // Make a link for the file
                setAudioURL(url); // Save the link so we can play it
                audioChunksRef.current = []; // Empty the list for next time
            };

            mediaRecorder.start(); // Go!
            mediaRecorderRef.current = mediaRecorder;
            setRecording(true); // Now we are recording!
        } catch (error) {
            // If it breaks, show this message
            console.error("Error accessing microphone:", error);
            alert("Please allow microphone access in your browser settings.");
        }
    };

    // This stops the recording. Easy.
    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false); // No longer recording
        }
    };

    // The design part of the page
    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 to-rose-900 flex items-center justify-center p-6 relative">
            {/* The pretty background colors */}
            <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-rose-500/20 rounded-xl">
                        <FaWaveSquare className="text-2xl text-rose-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Travel Voice Memo</h2>
                </div>

                <p className="text-white/80 italic mb-8 text-center bg-black/20 p-4 rounded-xl border border-white/10">
                    🎙️ &rdquo;Capture the soul of your journey - bustling markets,
                    ocean whispers, mountain echoes...&rdquo;
                </p>

                <div className="flex justify-center">
                    {/* If it is not recording, show the start button. Otherwise show the stop button. */}
                    {!recording ? (
                        <button
                            onClick={startRecording}
                            className="flex items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 px-8 py-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <FaMicrophone className="text-xl animate-pulse" />
                            <span className="font-semibold">Start Adventure Recording</span>
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 px-8 py-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-pulse"
                        >
                            <FaStop className="text-xl" />
                            <span className="font-semibold">Stop recording</span>
                        </button>
                    )}
                </div>

                {/* Only show this if we actually have a recording */}
                {audioURL && (
                    <div className="mt-8 animate-fade-in-up">
                        <div className="bg-black/20 p-6 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <FaPlay className="text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Your Travel Memory </h3>
                            </div>

                            {/* The player thingy */}
                            <audio
                                controls
                                src={audioURL}
                                className="w-full mt-4 rounded-lg [&::-webkit-media-controls-panel]:bg-gray-800 [&::-webkit-media-controls-play-button]:bg-white/10 [&::-webkit-media-controls-timeline]:bg-white/20"
                            />

                            {/* Link to download the MP3 */}
                            <a
                                href={audioURL}
                                download="travel-memory.mp3"
                                className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg w-full"
                            >
                                <FaDownload />
                                Download Memory
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}