import Layout from '../components/Layout';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqs = [
    {
      question: "How do you verify the authenticity of vintage items?",
      answer: "Every piece goes through our rigorous authentication process. Our experts examine construction details, materials, hardware, labels, and aging patterns. We also research the item's history and provenance when possible. Each authenticated item comes with our authenticity guarantee."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return window from delivery date. Items must be in original condition with tags attached. We provide prepaid return labels for easy returns. Final sale items and customized pieces cannot be returned. Please see our full shipping and returns page for complete details."
    },
    {
      question: "How should I care for vintage items?",
      answer: "Vintage pieces require special care. We recommend dry cleaning for most vintage garments, storing items on padded hangers or flat in breathable garment bags, avoiding direct sunlight, and following any specific care instructions included with your purchase. We provide detailed care guides with each order."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship internationally to most countries. International shipping costs are calculated at checkout based on destination and package weight. Delivery typically takes 7-14 business days. Please note that international orders may be subject to customs duties and taxes determined by your country's regulations."
    },
    {
      question: "How does vintage sizing compare to modern sizing?",
      answer: "Vintage sizing often runs smaller than contemporary sizing due to different fit standards and manufacturing practices. We recommend consulting our size guide and individual item measurements. When available, we provide detailed measurements for each piece. Don't hesitate to contact us with specific sizing questions."
    },
    {
      question: "Can I request specific items or styles?",
      answer: "While we can't guarantee specific items due to the nature of vintage collecting, we're happy to keep an eye out for pieces that match your preferences. Contact us with details about what you're seeking - style, era, size, etc. - and we'll notify you when similar items become available."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and other secure digital wallet services. All transactions are processed through our secure, encrypted payment system to protect your financial information."
    },
    {
      question: "How do you source your vintage items?",
      answer: "We work with a network of trusted sources including estate sales, vintage dealers, private collectors, and specialized auctions. Each piece is carefully curated for quality, authenticity, and uniqueness. We prioritize items with interesting histories and exceptional craftsmanship."
    },
    {
      question: "Do you offer gift cards?",
      answer: "Yes, we offer digital gift cards in various denominations. Gift cards are delivered via email and can be used for any purchase on our site. They don't expire and can be combined with other payment methods if the gift card amount doesn't cover the full purchase."
    },
    {
      question: "What if an item doesn't fit as expected?",
      answer: "We understand that vintage sizing can be tricky. If an item doesn't fit as expected, you can return it within 30 days for a full refund or exchange. We're also happy to help you find a better fit from our current collection. Our customer service team is always available to assist with sizing concerns."
    }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          
          <div className="relative space-y-8">
            <div className="text-center">
              <h1 className="font-serif text-4xl text-charcoal-800 text-distressed mb-4">
                Frequently Asked Questions
              </h1>
              <p className="font-sans-clean text-charcoal-600 max-w-2xl mx-auto">
                Find answers to common questions about our vintage pieces, authenticity process, and shopping experience.
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-oatmeal-50 border border-oatmeal-300">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-oatmeal-100 transition-colors"
                  >
                    <h3 className="font-serif text-lg text-charcoal-800 pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown 
                      size={20}
                      className={`text-charcoal-600 transition-transform flex-shrink-0 ${
                        openItems.has(index) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {openItems.has(index) && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-oatmeal-300 pt-4">
                        <p className="font-sans-clean text-charcoal-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="text-center bg-oatmeal-100 border border-oatmeal-300 p-8">
              <h2 className="font-serif text-2xl text-charcoal-800 text-distressed mb-4">
                Still Have Questions?
              </h2>
              <p className="font-sans-clean text-charcoal-700 mb-6">
                Can't find the answer you're looking for? Our customer service team is here to help.
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

export default FAQ;