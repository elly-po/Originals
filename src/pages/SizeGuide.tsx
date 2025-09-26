import Layout from '../components/Layout';

function SizeGuide() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          
          <div className="relative space-y-8">
            <div className="text-center">
              <h1 className="font-serif text-4xl text-charcoal-800 text-distressed mb-4">
                Size Guide
              </h1>
              <p className="font-sans-clean text-charcoal-600 max-w-2xl mx-auto">
                Find your perfect fit with our comprehensive sizing information for vintage and contemporary pieces.
              </p>
            </div>

            {/* Apparel Sizing */}
            <div className="space-y-6">
              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-6">
                  Women's Apparel
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-oatmeal-300">
                    <thead>
                      <tr className="bg-oatmeal-200">
                        <th className="border border-oatmeal-300 p-3 font-serif text-charcoal-800">Size</th>
                        <th className="border border-oatmeal-300 p-3 font-serif text-charcoal-800">Bust</th>
                        <th className="border border-oatmeal-300 p-3 font-serif text-charcoal-800">Waist</th>
                        <th className="border border-oatmeal-300 p-3 font-serif text-charcoal-800">Hips</th>
                      </tr>
                    </thead>
                    <tbody className="font-sans-clean text-charcoal-700">
                      <tr>
                        <td className="border border-oatmeal-300 p-3 font-medium">XS</td>
                        <td className="border border-oatmeal-300 p-3">32-33"</td>
                        <td className="border border-oatmeal-300 p-3">24-25"</td>
                        <td className="border border-oatmeal-300 p-3">34-35"</td>
                      </tr>
                      <tr className="bg-oatmeal-25">
                        <td className="border border-oatmeal-300 p-3 font-medium">S</td>
                        <td className="border border-oatmeal-300 p-3">34-35"</td>
                        <td className="border border-oatmeal-300 p-3">26-27"</td>
                        <td className="border border-oatmeal-300 p-3">36-37"</td>
                      </tr>
                      <tr>
                        <td className="border border-oatmeal-300 p-3 font-medium">M</td>
                        <td className="border border-oatmeal-300 p-3">36-37"</td>
                        <td className="border border-oatmeal-300 p-3">28-29"</td>
                        <td className="border border-oatmeal-300 p-3">38-39"</td>
                      </tr>
                      <tr className="bg-oatmeal-25">
                        <td className="border border-oatmeal-300 p-3 font-medium">L</td>
                        <td className="border border-oatmeal-300 p-3">38-40"</td>
                        <td className="border border-oatmeal-300 p-3">30-32"</td>
                        <td className="border border-oatmeal-300 p-3">40-42"</td>
                      </tr>
                      <tr>
                        <td className="border border-oatmeal-300 p-3 font-medium">XL</td>
                        <td className="border border-oatmeal-300 p-3">41-43"</td>
                        <td className="border border-oatmeal-300 p-3">33-35"</td>
                        <td className="border border-oatmeal-300 p-3">43-45"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-6">
                  Men's Apparel
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-oatmeal-300">
                    <thead>
                      <tr className="bg-oatmeal-200">
                        <th className="border border-oatmeal-300 p-3 font-serif text-charcoal-800">Size</th>
                        <th className="border border-oatmeal-300 p-3 font-serif text-charcoal-800">Chest</th>
                        <th className="border border-oatmeal-300 p-3 font-serif text-charcoal-800">Waist</th>
                        <th className="border border-oatmeal-300 p-3 font-serif text-charcoal-800">Neck</th>
                      </tr>
                    </thead>
                    <tbody className="font-sans-clean text-charcoal-700">
                      <tr>
                        <td className="border border-oatmeal-300 p-3 font-medium">XS</td>
                        <td className="border border-oatmeal-300 p-3">34-36"</td>
                        <td className="border border-oatmeal-300 p-3">28-30"</td>
                        <td className="border border-oatmeal-300 p-3">14-14.5"</td>
                      </tr>
                      <tr className="bg-oatmeal-25">
                        <td className="border border-oatmeal-300 p-3 font-medium">S</td>
                        <td className="border border-oatmeal-300 p-3">36-38"</td>
                        <td className="border border-oatmeal-300 p-3">30-32"</td>
                        <td className="border border-oatmeal-300 p-3">15-15.5"</td>
                      </tr>
                      <tr>
                        <td className="border border-oatmeal-300 p-3 font-medium">M</td>
                        <td className="border border-oatmeal-300 p-3">38-40"</td>
                        <td className="border border-oatmeal-300 p-3">32-34"</td>
                        <td className="border border-oatmeal-300 p-3">15.5-16"</td>
                      </tr>
                      <tr className="bg-oatmeal-25">
                        <td className="border border-oatmeal-300 p-3 font-medium">L</td>
                        <td className="border border-oatmeal-300 p-3">40-42"</td>
                        <td className="border border-oatmeal-300 p-3">34-36"</td>
                        <td className="border border-oatmeal-300 p-3">16-16.5"</td>
                      </tr>
                      <tr>
                        <td className="border border-oatmeal-300 p-3 font-medium">XL</td>
                        <td className="border border-oatmeal-300 p-3">42-45"</td>
                        <td className="border border-oatmeal-300 p-3">36-39"</td>
                        <td className="border border-oatmeal-300 p-3">16.5-17"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footwear Sizing */}
              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-6">
                  Footwear
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-serif text-lg text-charcoal-800 mb-4">Women's Shoes</h3>
                    <div className="space-y-2 font-sans-clean text-charcoal-700">
                      <div className="flex justify-between">
                        <span>US 6</span>
                        <span>23.5 cm / 9.25"</span>
                      </div>
                      <div className="flex justify-between">
                        <span>US 7</span>
                        <span>24.1 cm / 9.5"</span>
                      </div>
                      <div className="flex justify-between">
                        <span>US 8</span>
                        <span>24.8 cm / 9.75"</span>
                      </div>
                      <div className="flex justify-between">
                        <span>US 9</span>
                        <span>25.4 cm / 10"</span>
                      </div>
                      <div className="flex justify-between">
                        <span>US 10</span>
                        <span>26 cm / 10.25"</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-serif text-lg text-charcoal-800 mb-4">Men's Shoes</h3>
                    <div className="space-y-2 font-sans-clean text-charcoal-700">
                      <div className="flex justify-between">
                        <span>US 8</span>
                        <span>26 cm / 10.25"</span>
                      </div>
                      <div className="flex justify-between">
                        <span>US 9</span>
                        <span>27 cm / 10.6"</span>
                      </div>
                      <div className="flex justify-between">
                        <span>US 10</span>
                        <span>28 cm / 11"</span>
                      </div>
                      <div className="flex justify-between">
                        <span>US 11</span>
                        <span>29 cm / 11.4"</span>
                      </div>
                      <div className="flex justify-between">
                        <span>US 12</span>
                        <span>30 cm / 11.8"</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Measuring Tips */}
              <div className="bg-oatmeal-100 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-6">
                  How to Measure
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8 font-sans-clean text-charcoal-700">
                  <div>
                    <h3 className="font-serif text-lg text-charcoal-800 mb-3">Body Measurements</h3>
                    <ul className="space-y-2">
                      <li><strong>Chest/Bust:</strong> Measure around the fullest part</li>
                      <li><strong>Waist:</strong> Measure at the narrowest point</li>
                      <li><strong>Hips:</strong> Measure around the fullest part</li>
                      <li><strong>Inseam:</strong> Measure from crotch to ankle</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-serif text-lg text-charcoal-800 mb-3">Vintage Considerations</h3>
                    <ul className="space-y-2">
                      <li>Vintage sizing may run smaller than modern sizes</li>
                      <li>Check individual item measurements when available</li>
                      <li>Consider the fabric and cut of vintage pieces</li>
                      <li>Contact us for specific measurement questions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SizeGuide;