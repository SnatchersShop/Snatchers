import React, { useEffect, useState } from "react";

const offers = [
  // "🎁 Free Shipping on Orders Over ₹999 – Shop Now!",
  "🎉 New Arrivals Just Dropped – Explore Now!",
  "Jewellery made for every mood, every day",
  "Wear your confidence - Monday to Sunday",
  "Unleash Your Shine with Snatchers",
  "Snatch the Trend. Own the Look",
  
];

const TopOfferBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 2000); // Change offer every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full bg-black text-white text-xs sm:text-sm text-center py-2 z-30 px-2 overflow-hidden">
      <div className="relative h-5 sm:h-6">
        <div
          key={currentIndex}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-100 animate-fade"
        >
          <p className="truncate">{offers[currentIndex]}</p>
        </div>
      </div>
    </div>
  );
};

export default TopOfferBar;
