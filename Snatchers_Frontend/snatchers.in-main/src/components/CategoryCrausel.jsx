import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: 1, name: "Rings", image: "/product-1.jpg" },
  { id: 2, name: "Necklace", image: "/product-2.jpg" },
  { id: 3, name: "Bangle", image: "/product-3.jpg" },
  { id: 4, name: "Bracelet", image: "/product-4.jpg" },
  { id: 5, name: "Earrings", image: "/product-5.jpg" },
  { id: 6, name: "Anklets", image: "/product-2.jpg" },
  { id: 7, name: "Other categories", image: "/product-3.jpg" }
];

const CategoryCarousel = ({ gender = "women" }) => {
  const navigate = useNavigate();

  // On click, go to the filtering route for intersection: gender + clicked jewelry type
  const handleClick = (cat) => {
    if (cat.name.toLowerCase() === 'other categories') {
      // Redirect to general shop page for both men and women
      navigate('/shop');
    } else {
      // Filter by specific jewelry type and gender
      navigate(
        `/category-shop?gender=${gender}&jewelryType=${encodeURIComponent(cat.name)}`
      );
    }
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide px-6 py-0">
      <div className="flex gap-6 sm:gap-8 md:gap-10 lg:gap-12 min-w-max justify-start items-center">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col items-center min-w-[2rem] cursor-pointer group"
            tabIndex={0}
            role="button"
            aria-label={`Shop ${gender}'s ${cat.name}`}
            onClick={() => handleClick(cat)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleClick(cat);
            }}
          >
            <div className="w-24 h-24 md:w-36 md:h-36 lg:w-[10.5rem] lg:h-[10.5rem] rounded-full overflow-hidden border-4 border-gray-300 shadow-lg group-hover:border-black transition">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p
              className="mt-4 text-base md:text-lg font-semibold text-gray-800 text-center group-hover:text-red-600 transition"
              style={{ fontFamily: "'Italiana', serif" }}
            >
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCarousel;
