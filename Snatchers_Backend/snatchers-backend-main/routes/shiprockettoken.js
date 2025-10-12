import express from "express";
import fetch from "node-fetch";
import Product from "../models/Product.js"; // Adjust path as needed
import mongoose from "mongoose";
const router = express.Router();

const SHIPROCKET_API_USER_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_API_USER_PASSWORD = process.env.SHIPROCKET_PASSWORD;

let cachedToken = null;
let tokenExpiresAt = 0;

async function getShiprocketToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const url = "https://apiv2.shiprocket.in/v1/external/auth/login";
  const payload = { email: SHIPROCKET_API_USER_EMAIL, password: SHIPROCKET_API_USER_PASSWORD };
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to authenticate with Shiprocket");
  const data = await response.json();
  cachedToken = data.token;
  tokenExpiresAt = Date.now() + 1000 * 60 * 60 * 6; // 6 hours
  return cachedToken;
}

router.get("/", async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) return res.status(400).json({ error: "Missing user email" });

    const canonUserEmail = userEmail.trim().toLowerCase();
    console.log("User email requested:", canonUserEmail);

    const token = await getShiprocketToken();

    let allUserOrders = [];
    let page = 1;
    while (true) {
      const response = await fetch(`https://apiv2.shiprocket.in/v1/external/orders?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      const orders = data.data || [];
      console.log(
        `Fetched page ${page}:`,
        orders.length,
        "orders; customer_emails:",
        orders.map((o) => o.customer_email)
      );
      if (orders.length === 0) break;

      const userOrders = orders.filter(
        (order) =>
          order.customer_email &&
          order.customer_email.trim().toLowerCase() === canonUserEmail
      );
      allUserOrders = allUserOrders.concat(userOrders);

      if (orders.length < 50) break;
      page++;
    }
    console.log("Total matching orders found:", allUserOrders.length);

    if (allUserOrders.length > 0) {
      console.log("DEBUG: First matching order object:");
      console.log(JSON.stringify(allUserOrders[0], null, 2));
    }

    // For each order, robustly lookup product by both string and ObjectId
    const responseOrders = await Promise.all(
      allUserOrders.map(async (o, idx) => {
        const prod = Array.isArray(o.products) && o.products.length > 0 ? o.products[0] : null;
        let productId = "";
        let lookupKey = prod?.channel_sku || prod?.sku || "";

        let dbProduct = null;
        if (lookupKey) {
          // Try string _id (most likely with your current data)
          dbProduct = await Product.findOne({ _id: lookupKey });
          if (dbProduct) {
            console.log(`(Order #${idx + 1}) Found by string _id: ${lookupKey}`);
          }
          // If not found, try ObjectId (covers all cases)
          if (!dbProduct && mongoose.Types.ObjectId.isValid(lookupKey)) {
            dbProduct = await Product.findOne({ _id: mongoose.Types.ObjectId(lookupKey) });
            if (dbProduct) {
              console.log(`(Order #${idx + 1}) Found by ObjectId: ${lookupKey}`);
            }
          }
        }

        if (dbProduct) {
          productId = dbProduct._id.toString();
        }

        // Use the first real image if available, else placeholder
        const productImage =
          dbProduct && Array.isArray(dbProduct.images) && dbProduct.images.length > 0
            ? dbProduct.images[0]
            : "/product-placeholder.jpg";

        return {
          id: o.id || o.order_id,
          productId,
          productTitle: prod?.name || "Product",
          productImage,
          price: prod?.price ? Number(prod.price) : 0,
          status: o.status || "Processing",
          orderDate: o.created_at ? o.created_at.substring(0, 10) : "",
        };
      })
    );

    res.json({ orders: responseOrders });
  } catch (err) {
    console.error("Shiprocket fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
