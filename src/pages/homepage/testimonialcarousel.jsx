import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Event Planner",
        content: "Aurelane Gifts nailed a 24-hour brief for a proposal. They handled the handwritten letter, playlist QR, and customized keepsake without me stressing once.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
        id: 2,
        name: "Rajesh Kumar",
        role: "Sales Director",
        content: "We booked 60 office celebration boxes and every hamper had branding, team jokes, and personalised notes. The gifting stylist kept updates crystal clear.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
        id: 3,
        name: "Priya Sharma",
        role: "Bride-to-be",
        content: "Return gifts after our wedding reception needed to feel intimate. Aurelane Gifts built custom trunks with our story cards and delivered them flawlessly.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
        id: 4,
        name: "Michael Chen",
        role: "Dad to Two",
        content: "The kids' birthday boxes were age-perfect. STEM kits, allergy-safe snacks, even astronaut pyjamas. Seeing their faces made my week.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
        id: 5,
        name: "Anita Patel",
        role: "Lifestyle Blogger",
        content: "Every unboxing feels like content gold—rich textures, layered storytelling, and zero plastic waste. My community now swears by their custom boxes.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    }
];

const TestimonialCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <motion.section
            className="py-12 sm:py-16 bg-gradient-to-r from-black via-[#240006] to-black"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-[0_8px_25px_rgba(220,38,38,0.35)]">
                        Love Letters From Our Gifters
                    </h2>
                    <p className="text-lg text-red-100/80 max-w-3xl mx-auto leading-relaxed">
                        Families, teams, and couples trust Aurelane Gifts to translate memories into tangible surprises—
                        from last-minute birthdays to tailored wedding trunks.
                    </p>
                </motion.div>

                {/* Carousel Container */}
                <div className="relative max-w-4xl mx-auto">
                    <div className="overflow-hidden rounded-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white/95 p-8 md:p-12 rounded-2xl shadow-[0_30px_50px_rgba(220,38,38,0.35)] border border-red-500/20 backdrop-blur-xl"
                            >
                                <div className="flex items-center justify-center mb-6">
                                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-2xl">⭐</span>
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-8 italic text-lg md:text-xl text-center leading-relaxed">
                                    "{testimonials[currentIndex].content}"
                                </p>
                                <div className="flex items-center justify-center">
                                    <img
                                        src={testimonials[currentIndex].image}
                                        alt={testimonials[currentIndex].name}
                                        className="w-16 h-16 rounded-full mr-4 object-cover ring-4 ring-red-200"
                                    />
                                    <div className="text-left">
                                        <h4 className="font-semibold text-gray-900 text-lg">
                                            {testimonials[currentIndex].name}
                                        </h4>
                                        <p className="text-red-600 text-sm font-medium">
                                            {testimonials[currentIndex].role}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-600/25 backdrop-blur-lg hover:bg-red-500/35 rounded-full p-3 transition-all duration-300 z-20 shadow-lg group"
                        aria-label="Previous testimonial"
                    >
                        <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextTestimonial}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-600/25 backdrop-blur-lg hover:bg-red-500/35 rounded-full p-3 transition-all duration-300 z-20 shadow-lg group"
                        aria-label="Next testimonial"
                    >
                        <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center mt-10 space-x-3">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'w-10 bg-red-500'
                                : 'w-3 bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default TestimonialCarousel;

