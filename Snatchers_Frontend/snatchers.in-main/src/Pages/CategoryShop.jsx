import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../UI/ProductCard";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const CategoryShop = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const query = useQuery();

  const gender = query.get("gender");
  const jewelryType = query.get("jewelryType");
  const occasion = query.get("occasion");

  const placeholderImg =
    "https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
  const res = await api.get(`/products`);
        console.log("Fetched products:", res.data);
        console.log("Gender filter:", gender);
        console.log("Jewelry type filter:", jewelryType);
        console.log("Occasion filter:", occasion);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [gender, jewelryType, occasion]);

  // ✅ Fixed filtering logic
  const filteredProducts = products.filter((product) => {
    let matchesGender = true;
    let matchesJewelryType = true;
    let matchesOccasion = true;

    // Filter by gender (men/women) if provided - handle both singular and plural forms
    if (gender) {
      const normalizedGender = gender.toLowerCase();
      const productCategory = product.category?.toLowerCase();
      
      // Create gender mapping to handle both URL parameter and API data variations
      const genderMapping = {
        'men': ['men', 'mens'],           // "men" in URL matches both "men" and "mens" in API data
        'mens': ['men', 'mens'],          // "mens" in URL matches both "men" and "mens" in API data
        'women': ['women', 'womens'],     // "women" in URL matches both "women" and "womens" in API data
        'womens': ['women', 'womens']     // "womens" in URL matches both "women" and "womens" in API data
      };
      
      const allowedCategories = genderMapping[normalizedGender] || [normalizedGender];
      matchesGender = allowedCategories.includes(productCategory);
    }

    // Filter by jewelry type (rings, necklace, etc.) if provided - only use occasion array
    if (jewelryType) {
      // 'Other categories' should just show everything (no extra filter)
      if (jewelryType.toLowerCase() === 'other categories') {
        matchesJewelryType = true;
      } else {
        const normalize = (s) =>
          String(s || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();

        const q = normalize(jewelryType);

        // synonyms mapping for common jewelry type names
        const synonyms = {
          ring: ['ring', 'rings', 'band', 'bands'],
          necklace: ['necklace', 'necklaces', 'pendant', 'pendants'],
          bangle: ['bangle', 'bangles', 'bracelet', 'bracelets'],
          bracelet: ['bracelet', 'bracelets', 'bangle', 'bangles'],
          earring: ['earring', 'earrings', 'studs', 'hoop', 'hoops'],
          anklet: ['anklet', 'anklets'],
          watch: ['watch', 'watches']
        };

        // create a flat set of synonyms to check
        const synSet = new Set();
        Object.values(synonyms).forEach(arr => arr.forEach(v => synSet.add(v)));

        const productTitle = normalize(product.title || '');
        const productOccasions = (product.occasion || []).map(normalize);
        const productType = normalize(product.type || '');
        const productCategory = normalize(product.category || '');

        // Match if jewelryType appears in title, matches a product.type field, or exists in occasion (some sites tag types in occasion)
        const matchesInTitle = q && productTitle.includes(q);
  const matchesInType = q && productType && (productType === q || (synSet.has(q) && synSet.has(productType)));
        const matchesInOccasion = q && productOccasions.some(o => o === q);

        // Also check synonyms (e.g., 'ring' vs 'rings', 'bracelet' vs 'bangle') by seeing if any synonym matches title/type/occasion
        const matchesSynonym = (() => {
          // find synonym group that contains q
          const group = Object.values(synonyms).find(arr => arr.includes(q));
          if (!group) return false;
          return group.some(syn =>
            productTitle.includes(syn) || productOccasions.includes(syn) || productType === syn || productCategory === syn
          );
        })();

        matchesJewelryType = matchesInTitle || matchesInType || matchesInOccasion || matchesSynonym;
      }
    }

    // Filter by occasion (genz, minimalist, vintage, heritage) if provided
    if (occasion) {
      matchesOccasion = product.occasion && product.occasion.some(occ => 
        occ.toLowerCase() === occasion.toLowerCase()
      );
    }

    // Return products that match all provided filters (intersection)
    return matchesGender && matchesJewelryType && matchesOccasion;
  });

  let headingText = "Shop";
  if (gender && jewelryType) {
    // Both gender and jewelry type are present
    const genderText = gender === "men" ? "Men's" : gender === "women" ? "Women's" : gender;
    headingText = `Shop ${genderText} ${jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}`;
  } else if (gender) {
    headingText =
      gender === "men"
        ? "Shop For Men"
        : gender === "women"
        ? "Shop For Women"
        : `Shop For ${gender}`;
  } else if (jewelryType) {
    headingText = `Shop For ${jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}`;
  } else if (occasion) {
    headingText = `Shop For ${
      occasion.charAt(0).toUpperCase() + occasion.slice(1)
    }`;
  }

  const handleAddToCart = (product) => {
    alert(`Added "${product.title}" to cart!`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          className="text-3xl sm:text-4xl lg:text-6xl mb-5 text-center text-gray-800 font-medium"
          style={{ fontFamily: "'Italiana', serif" }}
        >
          {headingText}
        </h1>

        <div className="flex justify-center items-center mb-4 sm:mb-6">
          <img
            src="./title-line.png"
            alt="Decorative underline"
            className="h-4 sm:h-6 md:h-8 lg:h-10 max-w-full object-contain"
          />
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                image={product.images?.[0] || placeholderImg}
                title={product.title}
                price={product.price}
                offerPrice={product.offerPrice}
                rating={product.rating}
                badgeText={product.badgeText}
                badgeClass={product.badgeClass}
                onAddToCart={() => handleAddToCart(product)}
                onClick={() => navigate(`/product/${product._id}`)}
              />
            ))
          ) : (
            <div className="text-center col-span-full text-gray-500">
              <p>No products found.</p>
              {gender && jewelryType && (
                <p className="text-sm mt-2">
                  No {gender}'s {jewelryType.toLowerCase()} available at the moment.
                </p>
              )}
              {occasion && !gender && !jewelryType && (
                <p className="text-sm mt-2">
                  No {occasion.toLowerCase()} products available at the moment.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryShop;
