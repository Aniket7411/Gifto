import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const TopSection = () => {
    const [showNotification, setShowNotification] = useState(false);
    const hasShownRef = useRef(false);

    useEffect(() => {
        let timer;

        if (!hasShownRef.current) {
            timer = setTimeout(() => {
                setShowNotification(true);
                hasShownRef.current = true;
            }, 300);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, []);

    const handleDismissNotification = useCallback(() => {
        setShowNotification(false);
    }, []);

    useEffect(() => {
        if (!showNotification) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                handleDismissNotification();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showNotification, handleDismissNotification]);

    return (
        <section className="relative min-h-screen flex items-center justify-center lg:justify-start px-4 sm:px-6 lg:px-12 overflow-hidden bg-gradient-to-br from-black via-[#1a0005] to-black">
            {/* Background accents */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-red-700 opacity-30 blur-3xl" />
                <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-red-500 opacity-20 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.05),_transparent_65%)]" />
            </div>

            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ y: -40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="absolute left-0 right-0 w-full px-4 z-30"
                        style={{ top: "calc(var(--header-height, 64px) - 5.4rem)" }}
                    >
                        <div className="max-w-3xl mx-auto bg-black/80 backdrop-blur-lg border border-red-500/40 shadow-lg rounded-2xl px-5 py-4 text-white">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-4 flex-1">
                                    <div className="flex-shrink-0 h-11 w-11 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center shadow-inner border border-red-500/50">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base font-semibold text-white">
                                            Limited-edition gifting studio
                                        </p>
                                        <p className="text-sm text-red-100 leading-relaxed">
                                            We craft and curate gifts exclusively online with express delivery, bespoke packaging, and personal gifting assistants to perfect every celebration.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDismissNotification}
                                    className="flex-shrink-0 p-1.5 rounded-full text-red-300 hover:bg-red-600/20 hover:text-white transition"
                                    aria-label="Close notification"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 text-center lg:text-left max-w-3xl text-white py-24 lg:py-0">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="uppercase tracking-[0.3em] text-xs sm:text-sm text-red-300 mb-4"
                >
                    AURELANE GIFTS
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4"
                >
                    Gifts that feel personal,
                    <span className="text-red-500 drop-shadow-[0_0_18px_rgba(220,38,38,0.45)]"> moments that last.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-base sm:text-lg lg:text-xl text-red-100/90 leading-relaxed mb-8"
                >
                    Surprise the people you love with curated presents for birthdays, first meetings, office wins,
                    or just because. From customized keepsakes to kid-approved bundles, every gift is designed to
                    delight.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-4"
                >
                    <Link to="/shop" className="inline-flex">
                        <span className="px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold tracking-wide uppercase text-sm shadow-[0_20px_35px_rgba(220,38,38,0.35)] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_25px_45px_rgba(220,38,38,0.45)]">
                            Explore Gifts
                        </span>
                    </Link>
                    <Link to="/shop?query=custom" className="inline-flex">
                        <span className="px-8 py-3.5 rounded-full border border-red-500/60 text-red-200 font-semibold tracking-wide uppercase text-sm hover:bg-red-600/10 transition-all duration-300">
                            Build a Custom Box
                        </span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.35 }}
                    className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left"
                >
                    {[
                        { label: "Birthday Surprises", value: "Same-day curation" },
                        { label: "Kids (4-14 yrs)", value: "Age-smart picks" },
                        { label: "Love & Forever", value: "Handwritten notes" },
                        { label: "Corporate Moments", value: "On-brand bundles" }
                    ].map((item) => (
                        <div key={item.label} className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3">
                            <p className="text-xs uppercase tracking-widest text-red-400 mb-1">{item.label}</p>
                            <p className="text-sm font-semibold text-white">{item.value}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TopSection;