import React, { useState } from "react";
import { motion } from "framer-motion";

const giftCollections = [
  {
    name: "Birthday Bash Box",
    image: "gemimages/banner1.png",
    description:
      "Party-ready curation with gourmet treats, confetti keepsakes, and a personalised wish card designed for midnight surprises.",
    highlights: [
      "Midnight delivery prepared",
      "Add-on mini cake or candles",
      "Custom message card printing",
      "Reusable celebration props",
    ],
  },
  {
    name: "First Meeting Starter Kit",
    image: "gemimages/banner2.jpeg",
    description:
      "Make the very first impression count with artisanal chocolates, conversation prompts, and a neutral keepsake souvenir.",
    highlights: [
      "Curated for any relationship",
      "Eco-luxe minimal packaging",
      "Conversation starter cards",
      "Same-day dispatch option",
    ],
  },
  {
    name: "Soulmate Story Bundle",
    image: "gemimages/rosequartz.png",
    description:
      "Grand gestures made easy—fragrance pairing, handwritten note service, and photo memory booklet included.",
    highlights: [
      "Handwritten letter service",
      "Rose-gold plated keepsakes",
      "Complimentary love playlist",
      "Promise ring slot ready",
    ],
  },
  {
    name: "Best Friend Capsule",
    image: "gemimages/citrinestone.png",
    description:
      "Inside jokes packaged with craft sodas, polaroid props, and a custom nostalgia zine to celebrate your shared chaos.",
    highlights: [
      "Custom zine storytelling",
      "Snack swap upgrade",
      "Friendship charm set",
      "Photo booth prop kit",
    ],
  },
  {
    name: "Office Win Playbook",
    image: "gemimages/astroquery.jpg",
    description:
      "Celebrate promotions and pitch wins with desk statements, gourmet caffeine, and gratitude scripts aligned to your brand voice.",
    highlights: [
      "Logo-ready desk art",
      "Small-batch caffeine pairing",
      "Personalised shout-out card",
      "Keepsake motivation deck",
    ],
  },
  {
    name: "Wedding & Marriage Trunk",
    image: "gemimages/gemstones-in-astrology.jpg",
    description:
      "Layer your love story with vow cards, celebration candles, guest favours, and keepsake trunks for family gifting.",
    highlights: [
      "Couple story cards",
      "Scented celebration candle",
      "Mini gratitude letters",
      "Guest thank-you kits",
    ],
  },
  {
    name: "Return Gift Edit",
    image: "gemimages/yellowsapphire.webp",
    description:
      "Thoughtful favours for after-meet thank-yous—travel friendly, gratitude scripts included, and personalised to each guest.",
    highlights: [
      "Mini gratitude card set",
      "Travel dessert jars",
      "Custom sticker seals",
      "Reusable keepsake pouch",
    ],
  },
  {
    name: "After Marriage Reset",
    image: "gemimages/redcoral.webp",
    description:
      "Housewarming meets honeymoon essentials with rituals, playlists, and reminder tokens to ease into co-living.",
    highlights: [
      "Weekend ritual planner",
      "Home fragrance duo",
      "Breakfast-in-bed kit",
      "Framed vow print",
    ],
  },
  {
    name: "Kids Spark Pack · Boys",
    image: "gemimages/bluetopaz.png",
    description:
      "STEM adventures, allergen-friendly snacks, and cosmic storytelling to keep curious minds busy without screens.",
    highlights: [
      "STEM experiment kit",
      "Personalised superhero cape",
      "Allergy-safe snack box",
      "Adventure mission cards",
    ],
  },
  {
    name: "Kids Spark Pack · Girls",
    image: "gemimages/rosequartz.png",
    description:
      "Imagination-led kits with craft keepsakes, cosy snacks, and dream journals to capture bedtime stories.",
    highlights: [
      "DIY jewellery lab",
      "Dream journal with stickers",
      "Cosy cocoa kit",
      "Star projector nightlight",
    ],
  },
  {
    name: "Custom Story Lab",
    image: "gemimages/opal.webp",
    description:
      "Work 1:1 with our gifting stylists for fully bespoke concepts—from artisan sourcing to logistics and on-ground delivery.",
    highlights: [
      "Dedicated stylist & concierge",
      "Mood-board approval flow",
      "Artisan sourcing network",
      "White-glove delivery options",
    ],
  },
];

const GiftCollections = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCard = () => setActiveIndex((prev) => (prev + 1) % giftCollections.length);
  const prevCard = () => setActiveIndex((prev) => (prev - 1 + giftCollections.length) % giftCollections.length);

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-black via-[#1c0003] to-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-32 w-96 h-96 bg-red-600/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-600/10 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center text-xs font-semibold tracking-[0.4em] uppercase text-red-300/80"
            >
              Gift Collections
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight"
            >
              Curated playbooks to upgrade your gifting ritual
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-red-200/80 text-base sm:text-lg leading-relaxed max-w-xl"
            >
              From midnight surprises to wedding room drops, every collection is mood-boarded, sourced, and scripted to make gifting easy yet unforgettable. Use them as-is or as inspiration for something completely bespoke.
            </motion.p>

            <div className="flex items-center gap-4">
              <button
                onClick={prevCard}
                className="w-11 h-11 rounded-full border border-red-600/40 text-red-200 hover:bg-red-600/20 transition-colors flex items-center justify-center"
                aria-label="Previous collection"
              >
                ‹
              </button>
              <button
                onClick={nextCard}
                className="w-11 h-11 rounded-full border border-red-600/40 text-red-200 hover:bg-red-600/20 transition-colors flex items-center justify-center"
                aria-label="Next collection"
              >
                ›
              </button>
            </div>
          </div>

          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex-1 bg-black/60 border border-red-900/40 rounded-3xl p-6 sm:p-8 shadow-[0_35px_65px_rgba(220,38,38,0.25)]"
          >
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-full sm:w-48 h-48 rounded-2xl overflow-hidden border border-red-900/40 bg-black/30 flex-shrink-0">
                <img
                  src={giftCollections[activeIndex].image}
                  alt={giftCollections[activeIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {giftCollections[activeIndex].name}
                </h3>
                <p className="text-red-200/80 text-sm sm:text-base leading-relaxed mb-4">
                  {giftCollections[activeIndex].description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {giftCollections[activeIndex].highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-black/40 border border-red-900/40 rounded-xl px-3 py-2 text-sm text-red-200"
                    >
                      <span className="text-red-400">✦</span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GiftCollections;

