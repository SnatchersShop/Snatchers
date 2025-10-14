import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [form, setForm] = useState({
    title: '',
    price: '',
    offerPrice: '',
    rating: '',
    badgeText: '',
    badgeClass: '',
    description: '',
    category: '',
    occasion: '',
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setForm({ ...form, images: files });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation for offerPrice
    const newErrors = {};
    const priceNum = parseFloat(form.price);
    const offerNum = form.offerPrice === '' ? null : parseFloat(form.offerPrice);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Enter a valid price greater than 0';
    }
    if (offerNum !== null) {
      if (Number.isNaN(offerNum) || offerNum < 0) {
        newErrors.offerPrice = 'Offer price must be a non-negative number';
      } else if (!Number.isNaN(priceNum) && offerNum >= priceNum) {
        newErrors.offerPrice = 'Offer price must be less than the regular price';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'images') {
        for (let i = 0; i < val.length; i++) {
          formData.append('images', val[i]);
        }
      } else {
        // Only append offerPrice if it's a valid number; normalize empty strings
        if (key === 'offerPrice') {
          if (val === '') {
            // skip appending empty offerPrice
            return;
          }
          formData.append(key, Number(val));
        } else {
          formData.append(key, val);
        }
      }
    });

    try {
  const res = await axios.post(`/api/products`, formData);
      console.log(res.data);
      alert('✅ Product uploaded!');
    } catch (err) {
      console.error(err);
      alert('❌ Upload failed. Check console.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            name="title"
            onChange={handleChange}
            placeholder="Silver Bracelet"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Price</label>
            <input
              name="price"
              type="number"
              onChange={handleChange}
              placeholder="149.99"
              required
              className="w-full border rounded px-3 py-2"
            />
            {errors.price && <div className="text-sm text-red-600 mt-1">{errors.price}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Offer Price</label>
            <input
              name="offerPrice"
              type="number"
              step="0.01"
              onChange={handleChange}
              placeholder="129.99"
              className="w-full border rounded px-3 py-2"
            />
            {errors.offerPrice && <div className="text-sm text-red-600 mt-1">{errors.offerPrice}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Rating</label>
            <input
              name="rating"
              type="number"
              onChange={handleChange}
              placeholder="4"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Badge Text</label>
            <input
              name="badgeText"
              onChange={handleChange}
              placeholder="Trending"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Badge Class</label>
            <input
              name="badgeClass"
              onChange={handleChange}
              placeholder="bg-purple-700"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            onChange={handleChange}
            placeholder="Elegant bracelet description..."
            className="w-full border rounded px-3 py-2"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <input
              name="category"
              onChange={handleChange}
              placeholder="women"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Occasions</label>
            <input
              name="occasion"
              onChange={handleChange}
              placeholder="minimalist, datenight"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Product Images</label>
          <input
            name="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;