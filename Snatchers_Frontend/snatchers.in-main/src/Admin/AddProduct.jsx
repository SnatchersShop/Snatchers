import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [form, setForm] = useState({
    title: '',
    price: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'images') {
        for (let i = 0; i < val.length; i++) {
          formData.append('images', val[i]);
        }
      } else {
        formData.append(key, val);
      }
    });

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/products`, formData);
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