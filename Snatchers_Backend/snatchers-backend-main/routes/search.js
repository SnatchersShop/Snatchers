import express from 'express';
import Fuse from 'fuse.js';
import Product from '../models/Product.js'; // Adjust the path as needed

const router = express.Router();

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" });

  try {
    // Fetch all products from MongoDB
    const products = await Product.find().lean();

    // Configure Fuse.js options
    const fuseOptions = {
      keys: [
        'title',
        'description',
        'badgeText',
        'category',
        'occasion'
      ],
      threshold: 0.3
    };
    const fuse = new Fuse(products, fuseOptions);

    // Perform search
    const results = fuse.search(q).map(r => r.item);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

export default router;
