import { useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { trackPageView } from './utils/analytics';
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Help from "./pages/Help";
import Shipping from "./pages/Shipping";
import SizeGuide from "./pages/SizeGuide";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();

  // Global page view tracking
  useEffect(() => {
    const getPageName = (pathname: string) => {
      const routes: Record<string, string> = {
        '/': 'home',
        '/admin': 'admin',
        '/about': 'about',
        '/help': 'help',
        '/shipping': 'shipping',
        '/size-guide': 'size-guide',
        '/faq': 'faq', 
        '/terms': 'terms',
        '/privacy': 'privacy',
        '/contact': 'contact',
        '/cart': 'cart',
        '/checkout': 'checkout',
        '/signin': 'signin',
        '/signup': 'signup'
      };
      
      if (pathname.startsWith('/product/')) {
        return 'product-detail';
      }
      
      return routes[pathname] || 'unknown';
    };
    
    const pageName = getPageName(location.pathname);
    trackPageView(pageName, { path: location.pathname });
  }, [location.pathname]);

  return (
    <Routes>
      {/* Define all routes here */}
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/admin" element={<Admin />} />
      
      {/* Info Pages */}
      <Route path="/about" element={<About />} />
      <Route path="/help" element={<Help />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/size-guide" element={<SizeGuide />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* E-commerce Pages */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      
      {/* Authentication Pages */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* IMPORTANT: DO NOT place any routes below this. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;