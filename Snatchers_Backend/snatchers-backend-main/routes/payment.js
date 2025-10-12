import express from 'express';
import Razorpay from 'razorpay';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create new order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in paise (₹10 => 1000)
      currency,
      receipt: receipt || `rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ status: "SUCCESS", order });
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: error.message });
  }
});

export default router;
