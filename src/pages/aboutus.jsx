import React from 'react';

const AurelaneAbout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50">
            {/* Header Section */}
            <header
                className="relative py-16 px-4 text-center bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 text-white"
                style={{
                    backgroundImage: 'linear-gradient(135deg,rgb(9, 119, 63) 0%,rgb(179, 146, 110) 50%,rgb(12, 123, 38) 100%)'
                }}
            >
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif tracking-wide">
                        Aurelane
                    </h1>
                    <p className="text-xl md:text-2xl font-light italic max-w-2xl mx-auto leading-relaxed">
                        Where Earth's Ancient Whispers Meet Your Soul's Journey
                    </p>
                </div>

                {/* Decorative Elements */}
                {/* <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-8 py-4">
                    {['🟢', '🔴', '🔵', '✨', '💎'].map((icon, index) => (
                        <span
                            key={index}
                            className="text-2xl opacity-80 transform hover:scale-110 transition-transform duration-300"
                            style={{ animation: `float ${3 + index * 0.5}s infinite ease-in-out` }}
                        >
                            {icon}
                        </span>
                    ))}
                </div> */}
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-16">
                {/* Introduction Section */}
                <section className="mb-12">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-4xl font-bold text-amber-800 mb-6 font-serif">
                                Stories Wrapped as Gifts
                            </h2>
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                At <span className="font-semibold text-amber-700">Aurelane</span>, we believe gifting is a language. Every box is a moment translated into sensory experiences—crafted with theatre, emotion, and detail so the recipient feels seen, celebrated, and remembered.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                What started as bespoke gifting for intimate milestones has evolved into a studio that scripts entire celebration journeys. Today we partner with individuals, founders, and teams to design gifts that carry meaning long after the ribbons are untied.
                            </p>
                        </div>
                        <div
                            className="flex-1 bg-white p-8 rounded-2xl shadow-xl border border-amber-200"
                            style={{
                                background: 'linear-gradient(145deg, #ffffff 0%, #fef3c7 100%)'
                            }}
                        >
                            <h3 className="text-2xl font-bold text-amber-800 mb-4 text-center font-serif">
                                The Meaning Behind Our Name
                            </h3>
                            <div className="text-center mb-4">
                                <span className="text-4xl">🌟</span>
                            </div>
                            <p className="text-gray-700 text-center leading-relaxed">
                                <span className="font-semibold text-amber-700">Aurelane</span> blends “aurelia” (golden glow) with “lane” (a path). It is the path we walk with every client—illuminating the intent behind their gesture and shaping it into a tactile experience that lingers.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className="mb-12">
                    <div
                        className="bg-gradient-to-r from-amber-600 to-amber-800 text-white p-12 rounded-3xl text-center mb-12 shadow-2xl"
                        style={{
                            background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)'
                        }}
                    >
                        <h2 className="text-4xl font-bold mb-6 font-serif">
                            Our Philosophy
                        </h2>
                        <p className="text-2xl font-light italic max-w-4xl mx-auto leading-relaxed">
                            "Gifts should feel like chapters, not products."
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-amber-100">
                            <h3 className="text-2xl font-bold text-amber-800 mb-4 font-serif">
                                Design Strategy
                            </h3>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                Each assignment begins with understanding the sentiment, audience, and story arc. We mood-board the moment, map sensory touch-points, and engineer unboxing layers that reveal the narrative with intent.
                            </p>
                            <div className="flex space-x-4 mt-6">
                                {['🎬 Storyboarding', '🎨 Palette Studies', '🧾 Scripted Messaging'].map((item, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-amber-100">
                            <h3 className="text-2xl font-bold text-amber-800 mb-4 font-serif">
                                Emotion Engineering
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                We choreograph how the recipient feels at every stage—smell, texture, sound, copy, and keepsake longevity. From sourcing artisan-made inserts to personalised notes, every detail is purpose-built to spark connection.
                            </p>
                        </div>
                    </div>
                </section>

                {/* What We Offer Section */}
                <section className="mb-12">
                    <h2 className="text-4xl font-bold text-center text-amber-800 mb-16 font-serif">
                        What We Offer
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: '🎁', title: 'Signature Gift Playbooks', desc: 'Ready-to-deploy edits for birthdays, weddings, launches, and milestones.' },
                            { icon: '🧠', title: 'Concept & Copy Lab', desc: 'Naming, messaging, and storytelling that sound like you.' },
                            { icon: '🧵', title: 'Artisan Sourcing', desc: 'Maker-first sourcing with small-batch ateliers and ethical partners.' },
                            { icon: '📦', title: 'Layered Unboxing', desc: 'Packaging architecture that surprises, protects, and can be repurposed.' },
                            { icon: '👥', title: 'Concierge Gifting', desc: 'Dedicated stylists for c-suites, high-touch clients, and private families.' },
                            { icon: '🌍', title: 'Scale with Soul', desc: 'Bulk fulfillment with handwritten notes, localisation, and logistics handled.' }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                style={{
                                    background: 'linear-gradient(135deg, #ffffff 0%, #fefce8 100%)'
                                }}
                            >
                                <div className="text-3xl mb-4 text-center">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-amber-800 mb-3 text-center font-serif">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-center leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Process Section */}
                <section className="mb-12">
                    <h2 className="text-4xl font-bold text-center text-amber-800 mb-16 font-serif">
                        Our Meticulous Process
                    </h2>

                    <div className="flex flex-col space-y-8">
                        {[
                            { step: '1', title: 'Discovery Call', desc: 'We decode the celebration, recipient profiles, constraints, and brand voice.' },
                            { step: '2', title: 'Experience Blueprint', desc: 'Mood-board, flow, and touch-point strategy shared for sign-off.' },
                            { step: '3', title: 'Sourcing & Prototyping', desc: 'Artisans, flavours, textures, and memorabilia shortlisted and sampled.' },
                            { step: '4', title: 'Personalisation & Production', desc: 'Names, monograms, content, and packaging produced in micro-batches.' },
                            { step: '5', title: 'Fulfilment & Aftercare', desc: 'White-glove dispatch, delivery tracking, and keepsake instructions provided.' }
                        ].map((process, index) => (
                            <div
                                key={index}
                                className="flex items-center bg-white rounded-2xl p-6 shadow-lg border border-amber-100"
                                style={{
                                    background: 'linear-gradient(90deg, #fefce8 0%, #ffffff 50%, #fefce8 100%)'
                                }}
                            >
                                <div
                                    className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mr-6"
                                    style={{
                                        background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)'
                                    }}
                                >
                                    {process.step}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-amber-800 mb-2 font-serif">
                                        {process.title}
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {process.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mission & Why Choose Us */}
                <section className="flex flex-col lg:flex-row gap-12 mb-12">
                    {/* Mission */}
                    <div className="flex-1">
                        <div className="bg-amber-900 text-white p-8 rounded-2xl shadow-2xl h-full">
                            <h2 className="text-3xl font-bold mb-6 text-center font-serif">
                                Our Mission
                            </h2>
                            <p className="text-amber-100 leading-relaxed text-lg mb-4">
                                Our mission is to move people from transactional gifts to transformative gestures. We remove the overwhelm of Pinterest boards and endless catalogues by co-creating gifts that truly echo intent.
                            </p>
                            <p className="text-amber-100 leading-relaxed text-lg font-semibold text-center">
                                At Aurelane, we stand for gifts that feel <span className="text-amber-300">intentional, immersive, unforgettable.</span>
                            </p>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="flex-1">
                        <div
                            className="bg-white p-8 rounded-2xl shadow-2xl border border-amber-200 h-full"
                            style={{
                                background: 'linear-gradient(145deg, #ffffff 0%, #fef3c7 100%)'
                            }}
                        >
                            <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center font-serif">
                                Why Choose Aurelane
                            </h2>
                            <div className="space-y-4">
                                {[
                                    'Dedicated gifting strategists on every project',
                                    'Hybrid sourcing: global artisans + hyperlocal makers',
                                    'In-house copy, design, and print specialists',
                                    'Sustainable, reusable packaging architectures',
                                    'Logistics across India and international delivery support',
                                    'Playbooks, dashboards, and reports for corporate scaling'
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <span className="text-green-600 text-xl mr-3">✅</span>
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final Experience Section */}
                <section
                    className="text-center py-16 px-4 rounded-3xl shadow-2xl"
                    style={{
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fefce8 50%, #fef3c7 100%)',
                        border: '2px solid #fbbf24'
                    }}
                >
                    <h2 className="text-4xl font-bold text-amber-800 mb-8 font-serif">
                        The Aurelane Experience
                    </h2>
                    <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-8">
                        Every Aurelane gift is a carefully arranged storyboard: a beginning that intrigues, a middle that delights, and a finale that stays displayed or cherished long after the day has passed.
                    </p>
                    <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-8">
                        Whether you are celebrating a partner, welcoming a loved one, bonding a team, or thanking a client—your gift is designed to feel personal, premium, and profoundly thoughtful.
                    </p>
                    <div className="text-2xl font-light text-amber-700 italic font-serif">
                        Because at Aurelane, we don’t just ship boxes—we craft memories people replay.
                    </div>
                </section>
            </main>

            {/* Footer */}
            {/* <footer className="bg-amber-900 text-amber-100 py-12 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold mb-4 font-serif">Aurelane</h3>
                    <p className="text-amber-200 mb-6">
                        The Golden Path to Cosmic Alignment
                    </p>
                    <div className="flex justify-center space-x-6 text-2xl">
                        {['💎', '✨', '🌟', '🔮', '📿'].map((icon, index) => (
                            <span key={index} className="opacity-80 hover:opacity-100 transition-opacity">
                                {icon}
                            </span>
                        ))}
                    </div>
                </div>
            </footer> */}

            {/* Floating Animation */}
            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    );
};

export default AurelaneAbout;