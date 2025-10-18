import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import api from '../api';
import ProductCard from '../UI/ProductCard';
import productsFallback from '../Data/ProductData';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { WishlistContext } from '../contexts/WishlistContext';

export default function ProductSection({ title = 'Products', limit = 12 }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const navigate = useNavigate();

  const { cartItems, dispatch } = useCart();
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
  const res = await api.get('/api/products');
        if (!mounted) return;
        setProducts(Array.isArray(res.data) ? res.data.slice(0, limit) : []);
      } catch (err) {
        console.warn('Product API failed, using local data', err?.message || err);
        setError(err?.message || String(err));
        setUsedFallback(true);
        const local = productsFallback.slice(0, limit).map(p => ({
          _id: p._id || p.id?.toString?.() || `${p.title}-${Math.random()}`,
          title: p.title,
          price: p.price,
          offerPrice: p.offerPrice || null,
          rating: p.rating,
          images: p.images || [],
          badgeText: p.badgeText,
          badgeClass: p.badgeClass,
          description: p.description,
          category: p.category,
        }));
        if (mounted) setProducts(local);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => (mounted = false);
  }, [limit]);

  const isInCart = (id) => cartItems.some(i => i._id === id);

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: { _id: product._id, title: product.title, price: product.price, images: product.images || [] } });
  };

  const handleRemoveFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  if (loading) {
    return (
      <section className="my-12">
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <button onClick={() => navigate('/shop')} className="text-sm text-gray-600 hover:text-gray-800">View All →</button>
      </div>

      {usedFallback && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
          <div className="flex items-center justify-between">
            <div>
              Using local product data because the product API failed or is unreachable.
              <div className="text-xs text-gray-600">Error: {error}</div>
            </div>
            <div>
              <button onClick={() => window.location.reload()} className="ml-4 px-3 py-1 bg-white border rounded text-sm">Retry</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((prod) => (
          <ProductCard
            key={prod._id}
            image={prod.images?.[0] || '/fallback-image.jpg'}
            title={prod.title}
            price={prod.price}
            offerPrice={prod.offerPrice}
            rating={prod.rating}
            badgeText={prod.badgeText}
            badgeClass={prod.badgeClass}
            onClick={() => navigate(`/product/${prod._id}`)}
            onAddToCart={() => handleAddToCart(prod)}
            onRemoveFromCart={() => handleRemoveFromCart(prod._id)}
            isInCart={isInCart(prod._id)}
            onToggleWishlist={() => toggleWishlist(prod._id)}
            wishlisted={wishlist.includes(prod._id)}
          />
        ))}
      </div>
    </section>
  );
}
