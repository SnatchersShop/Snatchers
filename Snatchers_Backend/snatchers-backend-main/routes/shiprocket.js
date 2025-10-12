import express from 'express';
import axios from 'axios';
const router = express.Router();

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

let shiprocketToken = null;
let tokenExpiry = null;

const getShiprocketToken = async () => {
  const shouldRefresh = !shiprocketToken || (tokenExpiry && Date.now() >= tokenExpiry);
  if (!shouldRefresh) return shiprocketToken;

  const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
    email: SHIPROCKET_EMAIL,
    password: SHIPROCKET_PASSWORD,
  });
  shiprocketToken = res.data.token;
  tokenExpiry = Date.now() + ((res.data.expires_in ? res.data.expires_in : 240 * 60 * 60) * 1000);
  return shiprocketToken;
};

router.post('/create-order', async (req, res) => {
  try {
    const token = await getShiprocketToken();

    // Defensive: Ensure both emails are set, even if backend or frontend misses it
    const orderData = {
      ...req.body,
      billing_email: req.body.billing_email || req.body.email || "",
      shipping_email: req.body.shipping_email || req.body.billing_email || req.body.email || "",
    };

    // Debug: Show exactly what payload you're sending to Shiprocket
    console.log("Payload sent to Shiprocket order API:", orderData);

    const result = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Debug: Show complete Shiprocket response after order creation
    console.log("Response from Shiprocket order API:", result.data);

    res.json({ status: 'SUCCESS', shiprocket: result.data });
  } catch (err) {
    console.error("Shiprocket order creation error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      status: 'ERROR',
      message: err.response?.data || err.message,
    });
  }
});

export default router;
