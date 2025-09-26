import Layout from '../components/Layout';
import ProductGrid from '../components/ProductGrid';

function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-stone-50 py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">
            Curated Originals
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
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