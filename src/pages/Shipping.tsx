import Layout from '../components/Layout';

function Shipping() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          
          <div className="relative space-y-8">
            <div className="text-center">
              <h1 className="font-serif text-4xl text-charcoal-800 text-distressed mb-4">
                Shipping & Returns
              </h1>
              <p className="font-sans-clean text-charcoal-600 max-w-2xl mx-auto">
                We take great care in packaging and shipping your original pieces to ensure they arrive in perfect condition.
              </p>
            </div>

            {/* Shipping Information */}
            <div className="space-y-6">
              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-6">
                  Shipping Options
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif text-lg text-charcoal-800 mb-2">Standard Shipping</h3>
                      <div className="font-sans-clean text-charcoal-700 space-y-1">
                        <p><strong>Delivery:</strong> 5-7 business days</p>
                        <p><strong>Cost:</strong> $8.95</p>
                        <p><strong>Free shipping:</strong> Orders over $150</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-serif text-lg text-charcoal-800 mb-2">Express Shipping</h3>
                      <div className="font-sans-clean text-charcoal-700 space-y-1">
                        <p><strong>Delivery:</strong> 2-3 business days</p>
                        <p><strong>Cost:</strong> $18.95</p>
                        <p><strong>Cutoff:</strong> Order by 2PM EST</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif text-lg text-charcoal-800 mb-2">Next Day Delivery</h3>
                      <div className="font-sans-clean text-charcoal-700 space-y-1">
                        <p><strong>Delivery:</strong> Next business day</p>
                        <p><strong>Cost:</strong> $29.95</p>
                        <p><strong>Cutoff:</strong> Order by 12PM EST</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-serif text-lg text-charcoal-800 mb-2">International</h3>
                      <div className="font-sans-clean text-charcoal-700 space-y-1">
                        <p><strong>Delivery:</strong> 7-14 business days</p>
                        <p><strong>Cost:</strong> Calculated at checkout</p>
                        <p><strong>Note:</strong> Duties and taxes may apply</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Returns Policy */}
              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-6">
                  Returns & Exchanges
                </h2>
                
                <div className="space-y-6 font-sans-clean text-charcoal-700">
                  <div>
                    <h3 className="font-serif text-lg text-charcoal-800 mb-3">30-Day Return Window</h3>
                    <p>
                      We offer a 30-day return period from the date of delivery. Items must be in original condition 
                      with all tags attached and in original packaging.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-serif text-lg text-charcoal-800 mb-3">Return Process</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Contact our customer service to initiate a return</li>
                      <li>Receive your prepaid return shipping label</li>
                      <li>Package item securely with original packaging</li>
                      <li>Drop off at any authorized shipping location</li>
                      <li>Receive refund within 3-5 business days after processing</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="font-serif text-lg text-charcoal-800 mb-3">Exceptions</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Final sale items cannot be returned</li>
                      <li>Customized or personalized items are not eligible</li>
                      <li>Items showing signs of wear or damage cannot be accepted</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="text-center">
              <p className="font-sans-clean text-charcoal-700 mb-4">
                Questions about shipping or returns?
              </p>
              <a 
                href="/contact"
                className="inline-block bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif font-semibold px-8 py-3 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
              >
                Contact Customer Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Shipping;