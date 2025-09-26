import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Define all routes here */}
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/admin" element={<Admin />} />

      {/* IMPORTANT: DO NOT place any routes below this. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;