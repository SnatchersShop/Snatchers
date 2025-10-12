// routes/order.js
import express from "express";
import Order from "../models/Order.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// POST: Create a new order
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.uid || req.user?.['cognito:username'];
    const orderData = {
      ...req.body,
      userId,
    };
    
    const order = new Order(orderData);
    await order.save();
    
    res.status(201).json({ 
      message: "Order saved successfully", 
      order 
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ 
      message: "Error saving order", 
      error: err.message 
    });
  }
});

// GET: Fetch user's orders
router.get("/", verifyToken, async (req, res) => {
  try {
  const userId = req.user?.sub || req.user?.uid || req.user?.['cognito:username'];
  const orders = await Order.find({ userId })
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.json({ orders });
  } catch (err) {
    console.error("Orders fetch error:", err);
    res.status(500).json({ 
      message: "Error fetching orders", 
      error: err.message 
    });
  }
});

// GET: Fetch orders by email (for profile page)
router.get("/email/:email", verifyToken, async (req, res) => {
  try {
    const email = req.params.email;
    const orders = await Order.find({ customerEmail: email })
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.json({ orders });
  } catch (err) {
    console.error("Orders fetch error:", err);
    res.status(500).json({ 
      message: "Error fetching orders", 
      error: err.message 
    });
  }
});

export default router;
