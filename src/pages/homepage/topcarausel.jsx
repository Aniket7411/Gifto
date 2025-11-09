import React, { useState } from "react";

export default function GiftInquirySection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    giftingOccasion: "",
    budget: "",
    ageRange: "",
    details: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.giftingOccasion) {
      alert("Please fill in name, email, and gifting occasion.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://your-api.com/gift-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          giftingOccasion: "",
          budget: "",
          ageRange: "",
          details: "",
        });
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black relative flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-[#210005]/80 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.35),_transparent_55%)]"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto gap-6 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-16">
        {/* LEFT SIDE - FORM */}
        <div className="lg:w-1/2 w-full bg-black/70 backdrop-blur-xl rounded-2xl p-8 shadow-[0_35px_60px_rgba(220,38,38,0.25)] mb-8 lg:mb-0 border border-red-500/30 text-white">
          <h2 className="text-3xl font-bold text-white mb-3 text-center lg:text-left">
            Plan a Bespoke Gift with Us
          </h2>
          <p className="text-red-100/90 mb-6 text-center lg:text-left">
            Share the occasion and mood. Our gifting stylists craft a personalised box, complete with suggested add-ons,
            age-appropriate picks, and packaging ideas within 12 hours.
          </p>

          {submitted ? (
            <div className="text-red-200 font-semibold text-center py-4">
              ✅ Thank you! Our gifting stylist will reach out shortly.
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full border border-red-500/40 bg-black/40 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email or WhatsApp"
                className="w-full border border-red-500/40 bg-black/40 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
              />
              <select
                name="giftingOccasion"
                value={formData.giftingOccasion}
                onChange={handleChange}
                className="w-full border border-red-500/40 bg-black/40 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
              >
                <option value="">Gifting Occasion *</option>
                <option value="birthday">Birthday</option>
                <option value="first-meeting">First Meeting</option>
                <option value="love">For Love</option>
                <option value="best-friend">Best Friend</option>
                <option value="office">Office Celebration</option>
                <option value="marriage">Marriage / Wedding</option>
                <option value="return-gift">Return Gift</option>
                <option value="kids-boy">Kids (Boy)</option>
                <option value="kids-girl">Kids (Girl)</option>
                <option value="custom">Custom Story</option>
              </select>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Budget (₹)"
                  className="w-full border border-red-500/40 bg-black/40 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
                />
                <input
                  type="text"
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleChange}
                  placeholder="Recipient age range"
                  className="w-full border border-red-500/40 bg-black/40 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
                />
              </div>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="Add preferences: colors, delivery date, favourite snacks..."
                className="w-full border border-red-500/40 bg-black/40 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all min-h-[120px]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 text-white p-3.5 rounded-lg font-semibold tracking-wide uppercase text-sm transition-all duration-300 shadow-[0_20px_35px_rgba(220,38,38,0.4)] hover:-translate-y-1"
              >
                {loading ? "Designing..." : "Request Gift Blueprint"}
              </button>
            </form>
          )}
        </div>

        {/* RIGHT SIDE - CONTENT */}
        <div className="lg:w-1/2 w-full relative">
          <div className="flex flex-col justify-center px-4 lg:px-10 text-white space-y-6">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-wide leading-tight">
              Let’s build a gift that feels{" "}
              <span className="text-red-500 drop-shadow-[0_0_18px_rgba(220,38,38,0.45)]">made-for-them.</span>
            </h2>
            <p className="text-lg lg:text-xl text-red-100/90 leading-relaxed">
              Share a little about the relationship, the moment, and the vibe. Our stylists come back with a curated
              blueprint—complete with packaging, age filters, and optional personalisation add-ons.
            </p>
            <ul className="space-y-3 text-red-100/80 text-sm sm:text-base">
              <li>• Responses within 12 hours (6 hours for urgent celebrations)</li>
              <li>• Video call walkthrough for corporate or large events</li>
              <li>• Custom message printing, video QR cards, and photo inserts supported</li>
              <li>• Pan-India delivery with express and white-glove options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
