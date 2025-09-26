import Layout from '../components/Layout';

function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Background Texture */}
        <div className="relative">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          
          <div className="relative space-y-12">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <h1 className="font-serif text-4xl md:text-5xl text-charcoal-800 text-distressed">
                Our Story
              </h1>
              <p className="font-serif-classic text-xl text-charcoal-700 italic max-w-2xl mx-auto">
                "Every original piece tells a story. We're here to preserve those stories and connect them with new chapters."
              </p>
            </div>

            {/* Story Content */}
            <div className="space-y-8">
              <div className="prose prose-lg max-w-none">
                <div className="font-sans-clean text-charcoal-700 leading-relaxed space-y-6">
                  <p>
                    <strong className="font-serif text-charcoal-800">Originals Store</strong> was born from a simple belief: that authentic, well-crafted items carry more than just style—they carry history, character, and stories worth preserving.
                  </p>
                  
                  <p>
                    Founded in 2023, we started as passionate collectors who noticed something troubling in the fashion world. Mass production had begun to overshadow the artistry and individuality that makes clothing truly special. We decided to change that.
                  </p>
                  
                  <p>
                    Our mission is to curate and verify authentic vintage and original pieces that speak to the soul of craftsmanship. Every item in our collection is carefully selected for its quality, authenticity, and the unique story it tells.
                  </p>
                  
                  <p>
                    From heritage leather goods that have aged beautifully over decades to contemporary pieces made by artisans who still value traditional techniques, we're dedicated to connecting discerning customers with items that will stand the test of time.
                  </p>
                </div>
              </div>

              {/* Values Section */}
              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8 space-y-6">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed text-center">
                  Our Values
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg text-charcoal-800">Authenticity</h3>
                    <p className="font-sans-clean text-sm text-charcoal-600">
                      Every piece is verified for authenticity and quality before joining our collection.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg text-charcoal-800">Sustainability</h3>
                    <p className="font-sans-clean text-sm text-charcoal-600">
                      By celebrating existing craftsmanship, we promote sustainable fashion choices.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg text-charcoal-800">Heritage</h3>
                    <p className="font-sans-clean text-sm text-charcoal-600">
                      We preserve the stories and techniques of master craftspeople for future generations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="text-center space-y-4 pt-8">
                <p className="font-sans-clean text-charcoal-700">
                  Have questions about our story or a particular piece?
                </p>
                <a 
                  href="/contact"
                  className="inline-block bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif font-semibold px-8 py-3 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default About;