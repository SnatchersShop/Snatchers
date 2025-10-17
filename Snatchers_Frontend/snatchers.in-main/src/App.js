import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import Home from "./Pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Mens from "./Pages/Mens";
import Womens from "./Pages/Womens";
import About from "./Pages/About";
import ProductDialog from "./UI/ProductDialog";
import CategoryShop from "./Pages/CategoryShop";
import ProfilePage from "./Pages/ProfilePage";
import ProtectedRoute from './components/ProtectedRoute';
import UnauthRoute from './components/UnauthRoute';
import AuthSuccess from "./Pages/AuthSuccess";
import AuthError from "./Pages/AuthError";
import Blog1 from "./Pages/Blog1";
import Blog2 from "./Pages/Blog2";
import Blog3 from "./Pages/Blog3";
import TopOfferBar from "./components/TopOffer";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AddProduct from "./Admin/AddProduct";
import AdminProducts from "./Admin/AdminProducts";
import EditProduct from "./Admin/EditProduct";
import Wishlist from "./Pages/Wishlist";
import { CartProvider } from './contexts/CartContext';
import Cart from "./Pages/Cart";
import BuyNowComponent from "./components/BuyNowComponent";
import ShippingReturns from "./Pages/ShippingReturns";
import Warranty from "./Pages/Warranty";
import FAQ from "./Pages/FAQ";
import Contact from "./Pages/Contact";
import ScrollEffectsDemo from "./Pages/ScrollEffectsDemo";
import ScrollDebug from "./Pages/ScrollDebug";
import { ScrollProgress } from "./components/ScrollAnimations";

function App() {
  return (

    <>
      <CartProvider>
        <ScrollProgress />
        <TopOfferBar />
        <Navbar />

        <main className="pt-36 lg:pt-19">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/mens" element={<Mens />} />
              <Route path="/womens" element={<Womens />} />
              <Route path="/about" element={<About />} />
              <Route path="/product/:productId" element={<ProductDialog />} />
              <Route path="/category-shop" element={<CategoryShop />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/auth/success" element={<AuthSuccess />} />
              <Route path="/auth/error" element={<AuthError />} />
              <Route path="/blog1" element={<Blog1 />} />
              <Route path="/blog2" element={<Blog2 />} />
              <Route path="/blog3" element={<Blog3 />} />
              <Route path="/login" element={<UnauthRoute><Login /></UnauthRoute>} />
              <Route path="/register" element={<UnauthRoute><Register /></UnauthRoute>} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/edit-product/:id" element={<EditProduct />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/buy-now/:productId" element={<BuyNowComponent />} />
              <Route path="/shipping" element={<ShippingReturns />} />
              <Route path="/warranty" element={<Warranty />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/scroll-demo" element={<ScrollEffectsDemo />} />
              <Route path="/scroll-debug" element={<ScrollDebug />} />
            </Routes>
          </Router>
        </main>
        <Footer />
      </CartProvider>
    </>

  );
}

export default App;


