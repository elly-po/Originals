import Layout from '../components/Layout';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          
          <div className="relative space-y-8">
            <div className="text-center">
              <h1 className="font-serif text-4xl text-charcoal-800 text-distressed mb-4">
                Contact Us
              </h1>
              <p className="font-sans-clean text-charcoal-600 max-w-2xl mx-auto">
                We're here to help you find the perfect original piece or answer any questions about our collection.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                    Send Us a Message
                  </h2>
                  <p className="font-sans-clean text-charcoal-600 text-sm">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
                    >
                      <option value="">Select a subject</option>
                      <option value="product_inquiry">Product Inquiry</option>
                      <option value="order_status">Order Status</option>
                      <option value="return_exchange">Return/Exchange</option>
                      <option value="authenticity">Authenticity Question</option>
                      <option value="general">General Question</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean resize-vertical"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif font-semibold py-3 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-6">
                    Get in Touch
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-oatmeal-600 rounded-full flex items-center justify-center">
                        <Mail size={20} className="text-oatmeal-100" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-charcoal-800 mb-1">Email</h3>
                        <p className="font-sans-clean text-charcoal-700">hello@originalsstore.com</p>
                        <p className="font-sans-clean text-charcoal-600 text-sm">We typically respond within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-oatmeal-600 rounded-full flex items-center justify-center">
                        <Phone size={20} className="text-oatmeal-100" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-charcoal-800 mb-1">Phone</h3>
                        <p className="font-sans-clean text-charcoal-700">(555) 123-4567</p>
                        <p className="font-sans-clean text-charcoal-600 text-sm">Mon-Fri, 9 AM - 6 PM EST</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-oatmeal-600 rounded-full flex items-center justify-center">
                        <MapPin size={20} className="text-oatmeal-100" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-charcoal-800 mb-1">Address</h3>
                        <div className="font-sans-clean text-charcoal-700">
                          <p>123 Vintage Lane</p>
                          <p>Brooklyn, NY 11201</p>
                          <p>United States</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Quick Link */}
                <div className="bg-oatmeal-50 border border-oatmeal-300 p-6">
                  <h3 className="font-serif text-lg text-charcoal-800 text-distressed mb-3">
                    Frequently Asked Questions
                  </h3>
                  <p className="font-sans-clean text-charcoal-700 text-sm mb-4">
                    Check our FAQ section for quick answers to common questions about authenticity, sizing, returns, and more.
                  </p>
                  <a 
                    href="/faq"
                    className="inline-block border border-oatmeal-600 text-oatmeal-700 hover:bg-oatmeal-100 font-serif font-semibold px-4 py-2 transition-all duration-300 text-sm"
                  >
                    View FAQ
                  </a>
                </div>

                {/* Business Hours */}
                <div className="bg-oatmeal-50 border border-oatmeal-300 p-6">
                  <h3 className="font-serif text-lg text-charcoal-800 text-distressed mb-3">
                    Business Hours
                  </h3>
                  <div className="font-sans-clean text-charcoal-700 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span>10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span>Closed</span>
                    </div>
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

export default Contact;