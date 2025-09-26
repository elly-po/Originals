import Layout from '../components/Layout';

function Privacy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          
          <div className="relative space-y-8">
            <div className="text-center">
              <h1 className="font-serif text-4xl text-charcoal-800 text-distressed mb-4">
                Privacy Policy
              </h1>
              <p className="font-sans-clean text-charcoal-600">
                Last updated: September 2025
              </p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  Information We Collect
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>
                    We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us for support.
                  </p>
                  <p>
                    This may include your name, email address, postal address, phone number, payment information, and any other information you choose to provide.
                  </p>
                </div>
              </div>

              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  How We Use Your Information
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Process transactions and send related information</li>
                    <li>Provide customer service and support</li>
                    <li>Send newsletters and marketing communications (with your consent)</li>
                    <li>Improve our website and services</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>

              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  Information Sharing
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                  </p>
                  <p>
                    We may share information with trusted service providers who assist us in operating our website, conducting our business, or serving you, provided they agree to keep this information confidential.
                  </p>
                </div>
              </div>

              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  Data Security
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <p>
                    Payment information is processed through secure, encrypted connections and we do not store complete credit card information on our servers.
                  </p>
                </div>
              </div>

              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  Cookies & Tracking
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>
                    We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from.
                  </p>
                  <p>
                    You can choose to disable cookies through your browser settings, though this may affect the functionality of our website.
                  </p>
                </div>
              </div>

              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  Your Rights
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Access, update, or delete your personal information</li>
                    <li>Opt out of marketing communications</li>
                    <li>Request a copy of the information we have about you</li>
                    <li>Request that we delete your personal information</li>
                  </ul>
                  <p>
                    To exercise these rights, please contact us through our customer service page.
                  </p>
                </div>
              </div>

              <div className="bg-oatmeal-50 border border-oatmeal-300 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                  Changes to This Policy
                </h2>
                <div className="font-sans-clean text-charcoal-700 space-y-3">
                  <p>
                    We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a 
                href="/contact"
                className="inline-block bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif font-semibold px-8 py-3 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
              >
                Contact Us About Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Privacy;