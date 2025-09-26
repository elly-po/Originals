import Layout from '../components/Layout';

function Help() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          
          <div className="relative space-y-8">
            <div className="text-center">
              <h1 className="font-serif text-4xl text-charcoal-800 text-distressed mb-4">
                Help Center
              </h1>
              <p className="font-sans-clean text-charcoal-600 max-w-2xl mx-auto">
                We're here to help you find the perfect original piece and ensure your shopping experience is seamless.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Help */}
              <div className="bg-oatmeal-50 border border-oatmeal-300 p-6 space-y-4">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed">
                  Order Assistance
                </h2>
                <div className="space-y-3 font-sans-clean text-charcoal-700">
                  <div>
                    <h3 className="font-semibold mb-1">Placing an Order</h3>
                    <p className="text-sm">Find detailed steps on how to place your order, select sizes, and complete checkout.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Order Status</h3>
                    <p className="text-sm">Track your order and understand our fulfillment process from warehouse to your door.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Payment Methods</h3>
                    <p className="text-sm">We accept all major credit cards, digital wallets, and secure payment methods.</p>
                  </div>
                </div>
              </div>

              {/* Product Help */}
              <div className="bg-oatmeal-50 border border-oatmeal-300 p-6 space-y-4">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed">
                  Product Information
                </h2>
                <div className="space-y-3 font-sans-clean text-charcoal-700">
                  <div>
                    <h3 className="font-semibold mb-1">Authenticity Guarantee</h3>
                    <p className="text-sm">Learn about our verification process and authenticity guarantee for all items.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Sizing Information</h3>
                    <p className="text-sm">Find detailed sizing guides and measurements for accurate fit selection.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Care Instructions</h3>
                    <p className="text-sm">Proper care tips to maintain your original pieces for years to come.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="text-center bg-oatmeal-100 border border-oatmeal-300 p-8">
              <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                Still Need Help?
              </h2>
              <p className="font-sans-clean text-charcoal-700 mb-6">
                Our customer care team is ready to assist you with any questions or concerns.
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="/contact"
                  className="bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif font-semibold px-6 py-3 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
                >
                  Contact Us
                </a>
                <a 
                  href="/faq"
                  className="border border-oatmeal-600 text-oatmeal-700 hover:bg-oatmeal-50 font-serif font-semibold px-6 py-3 transition-all duration-300"
                >
                  View FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Help;