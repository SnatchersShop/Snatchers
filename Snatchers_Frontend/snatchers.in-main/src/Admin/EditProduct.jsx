import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);
        setForm({
          title: res.data.title || '',
          price: res.data.price ?? '',
          offerPrice: res.data.offerPrice ?? '',
          rating: res.data.rating ?? '',
          badgeText: res.data.badgeText || '',
          badgeClass: res.data.badgeClass || '',
          description: res.data.description || '',
          category: res.data.category || '',
          occasion: (res.data.occasion || []).join(','),
        });
      } catch (err) {
        console.error(err);
        alert('Failed to load product');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const priceNum = parseFloat(form.price);
    const offerNum = form.offerPrice === '' ? null : parseFloat(form.offerPrice);
    if (Number.isNaN(priceNum) || priceNum <= 0) newErrors.price = 'Enter a valid price greater than 0';
    if (offerNum !== null) {
      if (Number.isNaN(offerNum) || offerNum < 0) newErrors.offerPrice = 'Offer must be non-negative';
      else if (!Number.isNaN(priceNum) && offerNum >= priceNum) newErrors.offerPrice = 'Offer must be less than price';
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    try {
      const payload = {
        ...form,
        occasion: form.occasion ? form.occasion.split(',').map(s => s.trim()) : [],
        price: Number(form.price),
        offerPrice: form.offerPrice === '' ? null : Number(form.offerPrice),
        rating: form.rating === '' ? 0 : Number(form.rating),
      };
      const res = await api.put(`/products/${id}`, payload);
      alert('Product updated');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Price</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            {errors.price && <div className="text-sm text-red-600 mt-1">{errors.price}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Offer Price</label>
            <input name="offerPrice" type="number" step="0.01" value={form.offerPrice} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            {errors.offerPrice && <div className="text-sm text-red-600 mt-1">{errors.offerPrice}</div>}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <input name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Occasions (comma-separated)</label>
          <input name="occasion" value={form.occasion} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={4} />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          <button type="button" onClick={() => navigate('/admin/products')} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
