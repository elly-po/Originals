import Layout from '../components/Layout';

function Terms() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          
          <div className="relative space-y-8">
            <div className="text-center">
              <h1 className="font-serif text-4xl text-charcoal-800 text-distressed mb-4">
                Terms of Service
              </h1>
              <p className="font-sans-clean text-charcoal-600">
                Last updated: September 2025
              </p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  1. Acceptance of Terms
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>
                    By accessing and using Originals Store, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>
              </div>

              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  2. Product Information & Authenticity
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>
                    We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                  </p>
                  <p>
                    All vintage and original items are authenticated by our team of experts. We guarantee the authenticity of items as described, subject to our authentication process and standards.
                  </p>
                </div>
              </div>

              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  3. Pricing & Payment
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>
                    All prices are subject to change without notice. We reserve the right to modify prices at any time. Payment is due at the time of purchase.
                  </p>
                  <p>
                    We accept major credit cards, digital wallets, and other secure payment methods as displayed during checkout.
                  </p>
                </div>
              </div>

              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  4. Shipping & Returns
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>
                    Shipping times and costs are as specified during checkout. We are not responsible for delays caused by shipping carriers or customs processing.
                  </p>
                  <p>
                    Returns must be initiated within 30 days of delivery. Items must be in original condition with tags attached. See our Shipping & Returns page for complete details.
                  </p>
                </div>
              </div>

              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  5. Intellectual Property
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>
                    The content on this website, including text, graphics, logos, images, and software, is the property of Originals Store and is protected by copyright and other intellectual property laws.
                  </p>
                </div>
              </div>

              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  6. Limitation of Liability
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>
                    Originals Store shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                  </p>
                </div>
              </div>

              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  7. Contact Information
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>
                    If you have any questions about these Terms of Service, please contact us at our customer service page.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a 
                href="/contact"
                className="inline-block bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif font-semibold px-8 py-3 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Terms;