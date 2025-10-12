import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import OrderPlacedModal from "./OrderPlacedModal";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PICKUP_LOCATION = "warehouse";

const BuyNowComponent = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Prefill email from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token, redirect to login or show login prompt
      console.log("No authentication token found");
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const user = response.data;
        setForm((prev) => ({
          ...prev,
          email: user.email || "",
        }));
      })
      .catch((error) => {
        console.log("Authentication error:", error.response?.status);
        if (error.response?.status === 401) {
          // Token is invalid or expired, clear it and redirect to login
          localStorage.removeItem("token");
          setAuthError("Your session has expired. Please login again to continue.");
          console.log("Token expired or invalid, please login again");
          // You can add a redirect to login page here if needed
          // window.location.href = "/login";
        } else {
          setAuthError("Unable to load user information. Please try again.");
        }
      });
  }, []);

  useEffect(() => {
    setLoadingProduct(true);
    axios
      .get(`${API_BASE_URL}/api/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setLoadingProduct(false);
      })
      .catch((error) => {
        console.log("Product fetch error:", error.response?.status);
        setProduct(null);
        setLoadingProduct(false);
      });
  }, [productId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePayNow = async () => {
    if (!product) return;
    setLoading(true);
    setResult(null);

    if (!(window && window.Razorpay)) {
      setResult({
        success: false,
        error: "Razorpay SDK has not loaded. Please refresh the page.",
      });
      setLoading(false);
      return;
    }

    try {
      const paymentPayload = {
        amount: product.price,
        currency: "INR",
        receipt: "rcptid_" + Date.now(),
      };
      const paymentRes = await axios.post(
        `${API_BASE_URL}/api/payment/create-order`,
        paymentPayload
      );
      const { id: razorpayOrderId, amount, currency } = paymentRes.data.order;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Your Shop Name",
        description: "Product Purchase",
        order_id: razorpayOrderId,
        handler: async function (response) {
          const payment_id = response.razorpay_payment_id;

          try {
            const payload = {
              order_id: "ORD-" + Date.now(),
              order_date: new Date().toISOString().slice(0, 10),
              pickup_location: PICKUP_LOCATION,
              billing_customer_name: form.name,
              billing_last_name: "",
              billing_address: form.address,
              billing_city: form.city,
              billing_pincode: form.pincode,
              billing_state: form.state,
              billing_country: form.country,
              billing_email: form.email,
              shipping_email: form.email, // <--- ADDED THIS LINE
              billing_phone: form.phone,
              shipping_is_billing: true,
              order_items: [
                {
                  name: product.title || product.name,
                  sku: product.sku || product._id,
                  units: 1,
                  selling_price: product.price,
                },
              ],
              sub_total: product.price * 1,
              length: 20.32,
              breadth: 20.32,
              height: 3.81,
              weight: 0.2,
              payment_method: "Prepaid",
              payment_id,
            };

            const responseSR = await axios.post(
              `${API_BASE_URL}/api/shiprocket/create-order`,
              payload
            );

            // Store order locally for profile page
            const orderData = {
              id: "ORD-" + Date.now(),
              orderId: responseSR.data?.shiprocket?.order_id || "ORD-" + Date.now(),
              productId: product._id,
              productTitle: product.title || product.name,
              productImage: product.images?.[0] || "/product-placeholder.jpg",
              price: product.price,
              orderDate: new Date().toISOString().slice(0, 10),
              status: "Ordered",
              customerEmail: form.email,
              customerName: form.name,
              address: form.address,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
              phone: form.phone,
              paymentId: payment_id
            };

            // Store in localStorage
            const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
            const updatedOrders = [...existingOrders, orderData];
            localStorage.setItem('userOrders', JSON.stringify(updatedOrders));

            // Also try to save to backend API
            try {
              const token = localStorage.getItem("token");
              if (token) {
                await axios.post(
                  `${API_BASE_URL}/api/orders`,
                  orderData,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log('Order saved to backend successfully');
              }
            } catch (backendError) {
              console.log('Backend order save failed, but order is saved locally:', backendError);
              // Don't fail the entire process if backend save fails
            }

            setResult({ success: true, response: responseSR.data });
          } catch (err) {
            setResult({
              success: false,
              error:
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Unknown error (order creation)",
            });
          }
          setLoading(false);
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#d32f2f" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setResult({
              success: false,
              error: "Payment cancelled by user.",
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setResult({ success: false, error: err.message });
      setLoading(false);
    }
  };

  const renderError = (error) => {
    if (!error) return null;
    if (typeof error === "string") return error;
    if (error.message) return error.message;
    return (
      <pre className="whitespace-pre-wrap text-xs">
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  };

  if (loadingProduct) return <div>Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  // Show authentication error if present
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">{authError}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = "/login"}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result && result.success) {
    const orderId =
      result.response?.shiprocket?.order_id ||
      result.response?.order_id ||
      "N/A";
    return (
      <OrderPlacedModal
        orderId={orderId}
        onClose={() => (window.location.href = "/")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Complete Your Purchase</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Details Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Product Details</h3>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={product.images?.[0] || "/product-placeholder.jpg"}
                  alt={product.title || product.name}
                  className="w-full md:w-64 h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.src = "/product-placeholder.jpg";
                  }}
                />
              </div>
              
              {/* Product Information */}
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.title || product.name}
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-black">₹{product.price}</span>
                  </div>
                  
                  {product.category && (
                    <div>
                      <span className="text-sm text-gray-500">Category:</span>
                      <span className="ml-2 text-gray-700 capitalize">{product.category}</span>
                    </div>
                  )}
                  
                  {product.brand && (
                    <div>
                      <span className="text-sm text-gray-500">Brand:</span>
                      <span className="ml-2 text-gray-700">{product.brand}</span>
                    </div>
                  )}
                  
                  {product.description && (
                    <div>
                      <span className="text-sm text-gray-500">Description:</span>
                      <p className="mt-1 text-gray-700 text-sm leading-relaxed">
                        {product.description.length > 150 
                          ? `${product.description.substring(0, 150)}...` 
                          : product.description}
                      </p>
                    </div>
                  )}
                  
                  {product.sku && (
                    <div>
                      <span className="text-sm text-gray-500">SKU:</span>
                      <span className="ml-2 text-gray-700 font-mono text-sm">{product.sku}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Form Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Shipping Information</h3>
            <div className="flex flex-col gap-4">
              <input
                className="border border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors"
                placeholder="Full Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
              />
              
              <input
                className="border border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors"
                placeholder="Address"
                name="address"
                value={form.address}
                required
                onChange={handleChange}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors"
                  placeholder="City"
                  name="city"
                  value={form.city}
                  required
                  onChange={handleChange}
                />
                
                <input
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors"
                  placeholder="State"
                  name="state"
                  value={form.state}
                  required
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors"
                  placeholder="Pincode"
                  name="pincode"
                  value={form.pincode}
                  required
                  onChange={handleChange}
                />
                
                <input
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors"
                  placeholder="Country"
                  name="country"
                  value={form.country}
                  required
                  onChange={handleChange}
                />
              </div>
              
              <input
                className="border border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors bg-gray-50"
                placeholder="Email"
                name="email"
                type="email"
                value={form.email}
                required
                readOnly
              />
              
              <input
                className="border border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors"
                placeholder="Phone Number"
                name="phone"
                value={form.phone}
                required
                onChange={handleChange}
              />
              
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Product:</span>
                  <span className="text-gray-800">{product.title || product.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="text-gray-800">1</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-green-600">Free</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total:</span>
                  <span className="font-bold text-xl text-black">₹{product.price}</span>
                </div>
              </div>
              
              <button
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
                disabled={loading}
                onClick={handlePayNow}
                type="button"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay ₹${product.price} Now`
                )}
              </button>
              
              {result && !result.success && (
                <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                  <strong>Order Failed:</strong>
                  <br />
                  {renderError(result.error)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowComponent;
