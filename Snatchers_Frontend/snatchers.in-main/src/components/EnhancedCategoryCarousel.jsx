import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const allCategories = [
  { id: 1, name: "Rings", image: "/product-1.jpg" },
  { id: 2, name: "Pendant", image: "/product-2.jpg" },
  { id: 3, name: "Earrings", image: "/product-5.jpg" },
  { id: 4, name: "Bracelet", image: "/product-4.jpg" },
  { id: 5, name: "Bangle", image: "/product-3.jpg" },
  { id: 6, name: "Anklets", image: "/product-2.jpg" },
  { id: 7, name: "Other categories", image: "/logoonly-black.png" }
];

const EnhancedCategoryCarousel = ({ 
  gender = "women", 
  scrollDirection = "right",
  speed = 0.3,
  stiffness = 120,
  damping = 25,
  movementType = "opposite"
}) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Handle mouse drag to scroll
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Filter and modify categories based on gender
  const getCategoriesForGender = (gender) => {
    let filteredCategories = [...allCategories];
    
    if (gender === "men") {
      // For men: remove Bangle and Anklets, change Pendant to Chain, and use men's specific images
      filteredCategories = filteredCategories
        .filter(cat => cat.name !== "Bangle" && cat.name !== "Anklets")
        .map(cat => {
          if (cat.name === "Pendant") {
            return { ...cat, name: "Chain", image: "/menschain.jpg" };
          }
          // Assign specific men's jewelry images
          switch(cat.name) {
            case "Rings":
              return { ...cat, image: "/mensring.jpg" };
            case "Earrings":
              return { ...cat, image: "/mensearring.jpg" };
            case "Bracelet":
              return { ...cat, image: "/mensbracelet.jpg" };
            default:
              return cat;
          }
        });
      
      // Swap Bracelet and Earrings positions for men
      const braceletIndex = filteredCategories.findIndex(cat => cat.name === "Bracelet");
      const earringsIndex = filteredCategories.findIndex(cat => cat.name === "Earrings");
      if (braceletIndex !== -1 && earringsIndex !== -1) {
        [filteredCategories[braceletIndex], filteredCategories[earringsIndex]] = 
        [filteredCategories[earringsIndex], filteredCategories[braceletIndex]];
      }
    } else if (gender === "women") {
      // For women: use women's specific images
      filteredCategories = filteredCategories.map(cat => {
        switch(cat.name) {
          case "Rings":
            return { ...cat, image: "/product-1.jpg" }; // Keep generic for rings
          case "Pendant":
            return { ...cat, image: "/womennecklace.jpg" };
          case "Bangle":
            return { ...cat, image: "/womenbangle.jpg" };
          case "Bracelet":
            return { ...cat, image: "/womenbracelet.jpg" };
          case "Earrings":
            return { ...cat, image: "/product-5.jpg" }; // Keep generic for earrings
          case "Anklets":
            return { ...cat, image: "/womenankle.jpg" };
          default:
            return cat;
        }
      });
    }
    
    return filteredCategories;
  };

  const categories = getCategoriesForGender(gender);

  const handleClick = (cat) => {
    // Prevent navigation if user was dragging
    if (hasDragged) {
      return;
    }
    
    if (cat.name.toLowerCase() === 'other categories') {
      navigate('/shop');
    } else {
      navigate(
        `/category-shop?gender=${gender}&jewelryType=${encodeURIComponent(cat.name)}`
      );
    }
  };

  return (
    <div 
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="w-full overflow-x-auto overflow-y-hidden px-6 py-4 pb-6 relative carousel-container"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#9ca3af #e5e7eb',
        scrollBehavior: isDragging ? 'auto' : 'smooth',
        WebkitOverflowScrolling: 'touch',
        cursor: 'grab',
        userSelect: 'none'
      }}
    >
      {/* Custom scrollbar styles for Webkit browsers */}
      <style>{`
        .carousel-container::-webkit-scrollbar {
          height: 8px;
        }
        .carousel-container::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .carousel-container::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        .carousel-container::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
      
      {/* Background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      
      <div
        className={`flex gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center pb-2 relative ${
          gender === "men" ? "w-max mx-auto" : "w-max"
        }`}
      >
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            className="flex flex-col items-center min-w-[2rem] cursor-pointer group"
            tabIndex={0}
            role="button"
            aria-label={`Shop ${gender}'s ${cat.name}`}
            onClick={() => handleClick(cat)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleClick(cat);
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
          >
            <motion.div 
              className="w-24 h-24 md:w-36 md:h-36 lg:w-[10.5rem] lg:h-[10.5rem] rounded-full overflow-hidden border-4 border-gray-300 shadow-lg group-hover:border-black transition-all duration-300"
              whileHover={{
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                borderColor: "#d82e2e"
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
            
            <motion.p
              className="mt-4 text-base md:text-lg font-semibold text-gray-800 text-center group-hover:text-red-600 transition-colors duration-300"
              style={{ fontFamily: "'Italiana', serif" }}
              whileHover={{ y: -2 }}
            >
              {cat.name}
            </motion.p>
          </motion.div>
        ))}
      </div>
      
      {/* Scroll indicator removed per design request */}
    </div>
  );
};

export default EnhancedCategoryCarousel;
