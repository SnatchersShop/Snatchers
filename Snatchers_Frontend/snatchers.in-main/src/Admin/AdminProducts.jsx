import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex gap-2">
          <Link to="/add-product" className="px-3 py-1 bg-green-600 text-white rounded">Add</Link>
        </div>
      </div>

      <div className="grid gap-3">
        {products.map((product) => (
          <div key={product._id} className="flex items-center justify-between border p-3 rounded">
            <div className="flex items-center gap-4">
              <img src={product.images?.[0]} alt={product.title} className="w-20 h-20 object-cover rounded" />
              <div>
                <div className="font-semibold">{product.title}</div>
                <div className="text-sm text-gray-600">₹{product.offerPrice ?? product.price}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/admin/edit-product/${product._id}`} className="px-3 py-1 border rounded">Edit</Link>
              <button onClick={() => handleDelete(product._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
