// server.js
import dotenv from 'dotenv';
import express from 'express';
// import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import './config/firebase.js'; // ✅ Firebase Admin SDK initialized
import authRoutes from './routes/auth.js';
import wishlistRoutes from './routes/wishlist.js';
import userRoutes from './routes/user.js'; // ✅ Add this line
import productRoutes from './routes/product.js';
import cartRoutes from "./routes/cart.js";
import shiprocketRoutes from './routes/shiprocket.js'; // ✅ Import Shiprocket routes
import paymentRoutes from './routes/payment.js'; // ✅ Import payment routes
import shiprocketTokenRouter  from './routes/shiprockettoken.js'; // ✅ Import Shiprocket token route
import orderRoutes from './routes/order.js'; // ✅ Import order routes
import searchRouter from './routes/search.js'; // ✅ Import search route

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "https://www.snatchers.in"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if you're using cookies or auth headers
  })
);

app.use(express.json());

// Routes
app.use('/api', authRoutes);              // 🔑 Login (POST /api/auth/google)
app.use('/api/user', userRoutes);              // 👤 User routes (POST /api/user, GET /api/user/me)
app.use('/api/wishlist', wishlistRoutes); // 🛒 Wishlist protected routes
app.use("/api/products", productRoutes); // productRoutes imported correctly
app.use("/api/cart", cartRoutes); // 🛒 Cart protected routes
app.use('/api/shiprocket', shiprocketRoutes); // 🛳️ Shiprocket routes
app.use('/api/payment', paymentRoutes); // 💳 Payment routes
app.use('/api/orders', orderRoutes); // 📦 Order routes
app.use('/api/shiprocket-orders', shiprocketTokenRouter); // 🛳️ Shiprocket token route
app.use('/search', searchRouter);


// Root
app.get('/', (req, res) => {
  res.send('🔥 API is running...');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
