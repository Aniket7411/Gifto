import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import giftCollections from '../data/giftCollections';

const GiftPlaybooks = () => {
  const [activeTab, setActiveTab] = useState(giftCollections[0]?.id || '');
  const activePlaybook = giftCollections.find((gift) => gift.id === activeTab) || giftCollections[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0005] to-black text-red-100">
      <div className="relative overflow-hidden border-b border-red-900/40">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-black to-red-900/30 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.5em] uppercase text-red-400 mb-4">Gifting Playbooks</p>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Signature Curations for Every Celebration
            </h1>
            <p className="text-base sm:text-lg text-red-200/80 max-w-3xl mx-auto leading-relaxed">
              Tap into our most-loved gift storyboards—crafted for birthdays, first meetings, love stories,
              team wins, family rituals, and bespoke experiences. Every edit combines storytelling, premium sourcing,
              and personalisation that actually feels personal.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-black/60 backdrop-blur border border-red-900/40 rounded-2xl p-3 shadow-2xl">
          <div className="flex flex-wrap justify-center gap-3">
            {giftCollections.map((gift) => {
              const isActive = gift.id === activeTab;
              return (
                <button
                  key={gift.id}
                  onClick={() => setActiveTab(gift.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wide transition-all duration-300 border ${
                    isActive
                      ? 'border-red-500 bg-red-600 text-white shadow-lg shadow-red-900/40'
                      : 'border-red-900/40 text-red-200 hover:border-red-500 hover:text-white'
                  }`}
                >
                  <img src={gift.image} alt={gift.name} className="w-6 h-6 rounded-md object-cover" />
                  <span>{gift.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePlaybook?.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="bg-black/60 border border-red-900/40 rounded-3xl shadow-[0_40px_80px_rgba(220,38,38,0.15)] overflow-hidden"
          >
            <div className={`bg-gradient-to-br ${activePlaybook.gradient} p-8 sm:p-10`}>
              <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className="bg-black/30 border border-white/10 rounded-2xl p-4 shadow-xl">
                  <img
                    src={activePlaybook.image}
                    alt={activePlaybook.name}
                    className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-xl"
                  />
                </div>

                <div className="flex-1 text-left">
                  <p className="text-xs tracking-[0.4em] uppercase text-red-200/80 mb-3">
                    Playbook #{giftCollections.indexOf(activePlaybook) + 1}
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    {activePlaybook.name}
                  </h2>
                  <p className={`text-base sm:text-lg ${activePlaybook.accent} max-w-3xl`}>
                    {activePlaybook.headline}
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-red-100">
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-widest text-red-300">Ideal Budget</p>
                      <p className="text-lg font-semibold text-white mt-1">{activePlaybook.priceRange}</p>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-widest text-red-300">Lead Time</p>
                      <p className="text-lg font-semibold text-white mt-1">{activePlaybook.leadTime}</p>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-widest text-red-300">Personalisation</p>
                      <p className="text-lg font-semibold text-white mt-1">{activePlaybook.personalisation.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-10">
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-widest">
                  The Blueprint
                </h3>
                <p className="text-sm sm:text-base text-red-200/90 leading-relaxed max-w-4xl">
                  {activePlaybook.description}
                </p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/40 border border-red-900/40 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-red-300 tracking-widest uppercase mb-4">
                    Best For
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activePlaybook.bestFor.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 text-xs font-semibold tracking-wider uppercase border border-red-900/40 rounded-full bg-red-600/20 text-red-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-black/40 border border-red-900/40 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-red-300 tracking-widest uppercase mb-4">
                    Personalisation Hooks
                  </h4>
                  <ul className="space-y-2 text-sm text-red-200/90">
                    {activePlaybook.personalisation.map((hook) => (
                      <li key={hook} className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">✦</span>
                        <span>{hook}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="bg-black/40 border border-red-900/40 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-red-300 tracking-widest uppercase mb-4">
                  Signature Touches
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activePlaybook.signatureTouches.map((touch) => (
                    <div
                      key={touch}
                      className="flex items-start gap-3 bg-black/50 border border-red-900/40 rounded-xl p-4"
                    >
                      <span className="text-red-400">➤</span>
                      <p className="text-sm text-red-200/90">{touch}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GiftPlaybooks;

