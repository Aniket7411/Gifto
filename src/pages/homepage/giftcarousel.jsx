import React from "react";
import "./giftcarousel.css";

const giftTags = [
  { name: "Birthday Joy", src: "./gemimages/banner1.png" },
  { name: "First Meeting", src: "./gemimages/banner2.jpeg" },
  { name: "For Love", src: "./gemimages/rosequartz.png" },
  { name: "Best Friend", src: "./gemimages/citrinestone.png" },
  { name: "Office Cheers", src: "./gemimages/astroquery.jpg" },
  { name: "Wedding Bliss", src: "./gemimages/gemstones-in-astrology.jpg" },
  { name: "Kids Spark", src: "./gemimages/amethuststone.png" },
  { name: "Custom Story", src: "./gemimages/opal.webp" },
];

const GiftsCarousel = () => {
  return (
    <div className="gift-carousel-container">
      <div className="gift-track">
        {[...Array(3)].map((_, copyIndex) =>
          giftTags.map((tag, index) => (
            <div key={`${copyIndex}-${index}`} className="gift-item">
              <img src={tag.src} alt={tag.name} />
              <p>{tag.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GiftsCarousel;

