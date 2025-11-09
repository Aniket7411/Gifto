import React from "react";
import { Link } from "react-router-dom";

const spotlights = [
    { name: "Birthday Gift Sets", src: "./gemimages/banner1.png" },
    { name: "First Meeting Kits", src: "./gemimages/banner2.jpeg" },
    { name: "For Love & Romance", src: "./gemimages/rosequartz.png" },
    { name: "Best Friend Hampers", src: "./gemimages/citrinestone.png" },
    { name: "Office Cheers", src: "./gemimages/astroquery.jpg" },
    { name: "Wedding & Marriage", src: "./gemimages/gemstones-in-astrology.jpg" },
    { name: "Return Gifts", src: "./gemimages/yellowsapphire.webp" },
    { name: "Kids Surprise (Boys)", src: "./gemimages/bluetopaz.png" },
    { name: "Kids Surprise (Girls)", src: "./gemimages/rosequartz.png" },
    { name: "Custom Gift Lab", src: "./gemimages/opal.webp" },
];

const RingSection = () => {
    return (
        <div className="bg-gradient-to-b from-black via-[#200005] to-black py-12 sm:py-16 px-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-3 drop-shadow-[0_8px_25px_rgba(220,38,38,0.35)]">
                Shop by Gifting Mood
            </h2>
            <p className="text-center text-red-100/80 max-w-3xl mx-auto mb-8 sm:mb-12 text-sm sm:text-base leading-relaxed">
                Tap into ready-to-go gift collections built for every celebration. Filters cover birthdays, first meetings,
                love, friendships, office wins, weddings, returns, and kids—plus a custom lab for the story you want to tell.
            </p>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6">
                {spotlights.map((item) => (
                    <Link
                        key={item.name}
                        to="/shop"
                        className="w-[46%] sm:w-[30%] md:w-1/4 lg:w-[18%] flex flex-col items-center bg-white/[0.06] border border-red-500/30 backdrop-blur-xl p-4 rounded-2xl shadow-[0_18px_35px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_45px_rgba(220,38,38,0.35)] hover:-translate-y-2 transition-all duration-300 text-center"
                    >
                        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden border border-red-500/40 bg-black/40 flex items-center justify-center">
                            <img
                                src={item.src}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="mt-4 font-semibold text-sm sm:text-base text-white leading-snug">
                            {item.name}
                        </p>
                    </Link>
                ))}
            </div>
        </div>

    );
};

export default RingSection;
