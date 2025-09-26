import { Instagram, Twitter, Facebook } from 'lucide-react';

function Footer() {
  return (
    <footer className="relative bg-oatmeal-100 border-t border-oatmeal-300 mt-16">
      {/* Textural Background */}
      <div className="absolute inset-0 bg-texture-paper opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* The Store's Promise - Left Column */}
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-oatmeal-600 to-oatmeal-800 rounded-full flex items-center justify-center shadow-oatmeal">
                  <span className="text-oatmeal-100 font-serif font-bold text-sm">O</span>
                </div>
                <span className="font-serif-display text-xl text-charcoal-800 text-distressed">Originals</span>
              </div>
              
              {/* Slogan */}
              <p className="font-serif-classic text-charcoal-700 italic leading-relaxed">
                "Curated Originals. Verified Quality."
              </p>
              
              {/* Est. Date */}
              <p className="font-sans-clean text-sm text-charcoal-600 text-distressed">
                Est. 2023
              </p>
            </div>
            
            {/* About Us Link */}
            <div>
              <a 
                href="/about" 
                className="inline-block font-sans-clean text-charcoal-700 hover:text-oatmeal-800 transition-colors border-b border-charcoal-300 hover:border-oatmeal-600 pb-1"
              >
                About Our Story
              </a>
            </div>
          </div>
          
          {/* Customer Care & Information - Center Columns */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            {/* Customer Care */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-charcoal-800 text-distressed border-b border-oatmeal-400 pb-2">
                Customer Care
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="/help" className="font-sans-clean text-charcoal-700 hover:text-oatmeal-800 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/shipping" className="font-sans-clean text-charcoal-700 hover:text-oatmeal-800 transition-colors">
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a href="/size-guide" className="font-sans-clean text-charcoal-700 hover:text-oatmeal-800 transition-colors">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a href="/faq" className="font-sans-clean text-charcoal-700 hover:text-oatmeal-800 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Information */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-charcoal-800 text-distressed border-b border-oatmeal-400 pb-2">
                Information
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="/terms" className="font-sans-clean text-charcoal-700 hover:text-oatmeal-800 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="font-sans-clean text-charcoal-700 hover:text-oatmeal-800 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/authenticity" className="font-sans-clean text-charcoal-700 hover:text-oatmeal-800 transition-colors">
                    Authenticity Guarantee
                  </a>
                </li>
                <li>
                  <a href="/contact" className="font-sans-clean text-charcoal-700 hover:text-oatmeal-800 transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Stay Connected - Right Column */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg text-charcoal-800 text-distressed border-b border-oatmeal-400 pb-2">
              Stay Connected
            </h3>
            
            {/* Email Signup */}
            <div className="space-y-3">
              <p className="font-sans-clean text-sm text-charcoal-700">
                Get the Originals Edit
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-oatmeal-50 border border-oatmeal-400 focus:border-oatmeal-600 focus:ring-1 focus:ring-oatmeal-600 outline-none transition-colors font-sans-clean text-charcoal-800 placeholder-charcoal-500"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-charcoal-800 font-sans-clean font-semibold py-3 px-6 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
                >
                  Join the Community
                </button>
              </form>
            </div>
            
            {/* Social Media */}
            <div className="space-y-3">
              <p className="font-sans-clean text-sm text-charcoal-700">
                Follow Us
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-oatmeal-200 hover:bg-charcoal-700 text-charcoal-700 hover:text-oatmeal-100 rounded-full flex items-center justify-center transition-all duration-300 shadow-oatmeal"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-oatmeal-200 hover:bg-charcoal-700 text-charcoal-700 hover:text-oatmeal-100 rounded-full flex items-center justify-center transition-all duration-300 shadow-oatmeal"
                >
                  <Twitter size={18} />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-oatmeal-200 hover:bg-charcoal-700 text-charcoal-700 hover:text-oatmeal-100 rounded-full flex items-center justify-center transition-all duration-300 shadow-oatmeal"
                >
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment & Security - Bottom Section */}
        <div className="mt-12 pt-8 border-t border-oatmeal-300">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            
            {/* Copyright */}
            <p className="font-sans-clean text-sm text-charcoal-600 text-distressed">
              © 2023 Originals Store. All rights reserved.
            </p>
            
            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="font-sans-clean text-xs text-charcoal-500">
                Secure payments with:
              </span>
              <div className="flex items-center space-x-3">
                {/* Payment Icons */}
                <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div className="w-10 h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MC</span>
                </div>
                <div className="w-10 h-6 bg-gradient-to-r from-blue-800 to-blue-900 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PP</span>
                </div>
                <div className="w-10 h-6 bg-gradient-to-r from-green-600 to-green-800 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;