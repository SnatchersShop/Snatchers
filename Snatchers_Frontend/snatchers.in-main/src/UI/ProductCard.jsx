import React from "react";
import PropTypes from 'prop-types';
import { FaHeart, FaRegHeart } from "react-icons/fa";

// Simple currency formatter (INR). Keeps no fractional digits to match original UI.
const formatCurrency = (value) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  } catch (e) {
    return `₹${value}`;
  }
};

const ProductCard = ({
  image,
  title,
  price,
  offerPrice = null,
  rating = 0,
  onAddToCart,
  onRemoveFromCart,
  isInCart = false,
  badgeText,
  badgeClass = "bg-black",
  onClick,
  onQuickView,
  onCompare,
  wishlisted = false,
  onToggleWishlist,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative bg-gray-50 p-2.5 sm:p-5 overflow-hidden group cursor-pointer transition-shadow duration-400 ease-in-out rounded-xl"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick?.();
      }}
    >
      {/* Pinkish hover overlay */}
      <div
        className="absolute inset-0 bg-pink-500 bg-opacity-10 scale-x-0 origin-center transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-x-100 pointer-events-none z-10"
        aria-hidden
      />

      {/* Badge displayed vertically on the left */}
      {badgeText && (
        <div
          className={`absolute z-10 top-2 left-1 text-white italic px-2 py-0.5 text-[7px] sm:text-[10px] font-serif ${badgeClass} clip-polygon`}
          style={{
            writingMode: "vertical-rl",
            textOrientation: "upright",
            WebkitWritingMode: "vertical-rl",
            WebkitTextOrientation: "upright",
            whiteSpace: "nowrap",
          }}
        >
          {badgeText.toUpperCase()}
        </div>
      )}

      {/* Wishlist heart icon */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist?.();
        }}
        className="absolute top-2 right-2 z-20 text-xl text-pink-500 hover:text-pink-700 transition-colors"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.stopPropagation();
            onToggleWishlist?.();
          }
        }}
      >
        {wishlisted ? <FaHeart /> : <FaRegHeart />}
      </div>

      {/* Product image */}
      <div className="mb-2.5 sm:mb-3 product-thumb overflow-hidden rounded-md">
        <img src={image} alt={title} className="w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" loading="lazy" />
      </div>

      {/* Product details */}
      <div className="product-details relative z-10">
        <h2 className="text-[8px] sm:text-[10px] font-normal uppercase font-montserrat mb-0.5 group-hover:text-pink-600 transition-colors duration-400 ease-in-out">
          <button type="button" onClick={(e) => { e.stopPropagation(); onClick?.(); }} className="text-left w-full">
            {title}
          </button>
        </h2>

        {/* Rating stars */}
        <div
          className="text-yellow-400 text-xs sm:text-sm mb-1 hidden sm:block"
          role="img"
          aria-label={`Rating: ${rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <i key={i} className={`fa fa-star ${i < rating ? "opacity-100" : "opacity-30"} transition-opacity duration-400 ease-in-out`} />
          ))}
        </div>

        {/* Price */}
        <div className="mb-2">
          {offerPrice ? (
            <div className="flex items-baseline gap-3">
              <span className="text-sm text-gray-500 line-through">{formatCurrency(price)}</span>
              <span className="text-black font-semibold text-sm sm:text-base">{formatCurrency(offerPrice)}</span>
              <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded ml-2">Offer</span>
            </div>
          ) : (
            <span className="block text-black font-semibold text-sm sm:text-base mb-2">{formatCurrency(price)}</span>
          )}
        </div>

        {/* Add/Remove from cart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isInCart ? onRemoveFromCart?.() : onAddToCart?.();
          }}
          className={`border ${isInCart ? "border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white" : "border-black text-black hover:bg-black hover:text-white"} uppercase text-xs font-semibold py-1 px-3 rounded transition-colors duration-300 mx-auto block`}
        >
          {isInCart ? "Remove from Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  offerPrice: PropTypes.number,
  rating: PropTypes.number,
  onAddToCart: PropTypes.func,
  onRemoveFromCart: PropTypes.func,
  isInCart: PropTypes.bool,
  badgeText: PropTypes.string,
  badgeClass: PropTypes.string,
  onClick: PropTypes.func,
  onQuickView: PropTypes.func,
  onCompare: PropTypes.func,
  wishlisted: PropTypes.bool,
  onToggleWishlist: PropTypes.func,
};

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  offerPrice: PropTypes.number,
  rating: PropTypes.number,
  onAddToCart: PropTypes.func,
  onRemoveFromCart: PropTypes.func,
  isInCart: PropTypes.bool,
  badgeText: PropTypes.string,
  badgeClass: PropTypes.string,
  onClick: PropTypes.func,
  onQuickView: PropTypes.func,
  onCompare: PropTypes.func,
  wishlisted: PropTypes.bool,
  onToggleWishlist: PropTypes.func,
};

export default ProductCard;


