import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductGrid from '../components/ProductGrid';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);
  
  // Note: Page view tracking moved to App.tsx for global coverage
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-oatmeal-200/30 py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif-display font-bold text-charcoal-800 mb-4 text-distressed">
            Curated Originals
          </h1>
          <p className="text-lg font-sans-clean text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            Discover authentic, quality pieces with genuine heritage. 
            Each item tells a story of craftsmanship and timeless design.
          </p>
          <div className="mt-8 h-px bg-stone-300 max-w-xs mx-auto opacity-50"></div>
        </div>
      </section>

      {/* Product Grid */}
      <ProductGrid />
    </Layout>
  );
}

export default Home;