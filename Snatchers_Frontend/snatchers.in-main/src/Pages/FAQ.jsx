import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqData = [
    {
      id: 1,
      category: "General",
      questions: [
        {
          question: "What is Snatchers.in?",
          answer: "Snatchers.in is a premium jewelry brand that creates exquisite handcrafted pieces for both men and women. We specialize in timeless designs that blend traditional craftsmanship with modern aesthetics, offering everything from rings and necklaces to bracelets and earrings."
        },
        {
          question: "Do you offer jewelry for both men and women?",
          answer: "Yes! We believe jewelry transcends gender boundaries. Our collections include pieces designed specifically for men, women, and unisex options that anyone can wear with confidence. Each piece is crafted to celebrate individual style and self-expression."
        },
        {
          question: "Are your jewelry pieces authentic?",
          answer: "Absolutely. All our jewelry is made with genuine materials including real gold, silver, and authentic gemstones. We provide certificates of authenticity for all precious stones and metals. Our commitment to quality ensures every piece meets the highest standards."
        },
        {
          question: "Where are your products made?",
          answer: "Our jewelry is handcrafted by skilled artisans using traditional techniques combined with modern precision. We work with certified workshops that maintain the highest standards of craftsmanship and ethical practices."
        }
      ]
    },
    {
      id: 2,
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. International shipping takes 7-14 business days. Processing time is 1-2 business days for all orders. You'll receive a tracking number once your order ships."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to most countries worldwide. International shipping rates start at ₹799 for standard delivery and ₹1,299 for express delivery. Please note that customs duties and taxes may apply depending on your country's regulations."
        },
        {
          question: "Can I track my order?",
          answer: "Yes! You'll receive a tracking number via email once your order ships. You can track your package on our website or the courier's website. We'll also send you updates about your order status throughout the shipping process."
        },
        {
          question: "What if my order is delayed?",
          answer: "If your order is delayed, we'll notify you immediately and provide an updated delivery estimate. In case of significant delays, we may offer expedited shipping at no additional cost or provide store credit as compensation."
        }
      ]
    },
    {
      id: 3,
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy from the delivery date. Items must be unworn and in original packaging with all tags and certificates. Custom or personalized jewelry cannot be returned. Return shipping costs are the customer's responsibility."
        },
        {
          question: "How do I return an item?",
          answer: "Contact us at returns@snatchers.in with your order number and reason for return. We'll provide you with return instructions and a return authorization number. Pack the item securely in original packaging and ship to our return address."
        },
        {
          question: "Can I exchange my jewelry?",
          answer: "Yes! We offer exchanges within 30 days of delivery. Size exchanges are free, while style exchanges may require paying the price difference. Contact us to initiate an exchange, and we'll guide you through the process."
        },
        {
          question: "How long does it take to process returns?",
          answer: "Returns are typically processed within 5-7 business days after we receive the item. Refunds will be issued to your original payment method. You'll receive an email confirmation once your return is processed."
        }
      ]
    },
    {
      id: 4,
      category: "Warranty & Care",
      questions: [
        {
          question: "What warranty do you offer?",
          answer: "We offer a 2-year warranty on manufacturing defects and a 1-year warranty on gemstones. This covers defects in materials and workmanship but excludes normal wear and tear, damage from misuse, or modifications made by unauthorized personnel."
        },
        {
          question: "How should I care for my jewelry?",
          answer: "Store jewelry in a soft cloth or jewelry box, clean with mild soap and warm water, and dry with a soft cloth. Avoid harsh chemicals, extreme temperatures, and physical activities while wearing jewelry. Regular professional cleaning is recommended."
        },
        {
          question: "What if my jewelry gets damaged?",
          answer: "If your jewelry is damaged due to a manufacturing defect, it's covered under our warranty. For damage from normal wear or accidents, we offer repair services at reasonable rates. Contact our customer service for assessment and repair options."
        },
        {
          question: "Do you offer jewelry cleaning services?",
          answer: "Yes, we offer professional jewelry cleaning and maintenance services. You can bring your jewelry to our service center or ship it to us for cleaning. We also provide care instructions to help you maintain your jewelry at home."
        }
      ]
    },
    {
      id: 5,
      category: "Payment & Security",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI payments, net banking, and digital wallets. We also offer EMI options for purchases above ₹5,000. All payments are processed securely through encrypted gateways."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard SSL encryption to protect your payment information. We never store your complete payment details on our servers. All transactions are processed through secure, PCI-compliant payment gateways."
        },
        {
          question: "Do you offer EMI options?",
          answer: "Yes, we offer EMI options for purchases above ₹5,000 through various banks and financial institutions. You can choose EMI options during checkout. Interest rates and terms vary by bank and are displayed at the time of purchase."
        },
        {
          question: "Can I cancel my order after payment?",
          answer: "You can cancel your order within 24 hours of placing it, provided it hasn't been shipped yet. Once shipped, you'll need to follow our return policy. Contact our customer service immediately if you need to cancel an order."
        }
      ]
    },
    {
      id: 6,
      category: "Customization",
      questions: [
        {
          question: "Do you offer custom jewelry?",
          answer: "Yes, we offer custom jewelry design services. You can work with our design team to create a unique piece tailored to your specifications. Custom orders typically take 4-6 weeks to complete and require a 50% deposit upfront."
        },
        {
          question: "Can I personalize my jewelry?",
          answer: "We offer various personalization options including engraving, custom sizing, and stone selection. Personalization services are available for most of our pieces. Please note that personalized items cannot be returned unless there's a manufacturing defect."
        },
        {
          question: "How long does custom jewelry take?",
          answer: "Custom jewelry typically takes 4-6 weeks from design approval to completion. This includes design consultation, material sourcing, crafting, and quality control. We'll provide regular updates throughout the process."
        },
        {
          question: "What information do I need for custom orders?",
          answer: "For custom orders, we'll need your design preferences, size requirements, material choices, and budget range. We'll schedule a consultation to discuss your vision and provide design options. A detailed quote will be provided before work begins."
        }
      ]
    }
  ];

  const toggleFAQ = (categoryId, questionIndex) => {
    const faqKey = `${categoryId}-${questionIndex}`;
    setOpenFAQ(openFAQ === faqKey ? null : faqKey);
  };

  return (
    <div className="bg-white text-gray-800 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Main Heading with Italiana Font */}
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl sm:text-4xl lg:text-5xl mb-2 text-center text-gray-800 font-medium"
          style={{ fontFamily: "'Italiana', serif" }}
        >
          Frequently Asked Questions
        </motion.h1>

        {/* Decorative Line */}
        <div className="flex justify-center items-center mb-6 sm:mb-8">
          <img
            src="./title-line.png"
            alt="Decorative underline"
            className="h-4 sm:h-6 md:h-8 lg:h-10 max-w-full object-contain"
          />
        </div>

        {/* Introduction */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center mb-12"
        >
          <p className="text-lg text-gray-600 italic mb-4">
            Find answers to common questions about our jewelry, services, and policies
          </p>
          <p className="text-sm text-gray-500">
            Can't find what you're looking for? Contact our customer service team for personalized assistance.
          </p>
        </motion.div>

        {/* FAQ Categories */}
        {faqData.map((category, categoryIndex) => (
          <motion.section 
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + (categoryIndex * 0.1) }}
            className="mb-12"
          >
            <h2 
              className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center"
              style={{ fontFamily: "'Italiana', serif" }}
            >
              {category.category}
            </h2>
            
            <div className="space-y-4">
              {category.questions.map((faq, questionIndex) => (
                <motion.div
                  key={questionIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + (categoryIndex * 0.1) + (questionIndex * 0.05) }}
                  className="bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(category.id, questionIndex)}
                    className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                  >
                    <h3 className="font-semibold text-gray-800 pr-4" style={{ fontFamily: "'Italiana', serif" }}>
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openFAQ === `${category.id}-${questionIndex}` ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openFAQ === `${category.id}-${questionIndex}` && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}

        {/* Contact Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="mt-16"
        >
          <div className="bg-gray-50 border-2 border-gray-300 p-8 rounded-lg text-center">
            <h2 
              className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800"
              style={{ fontFamily: "'Italiana', serif" }}
            >
              Still Have Questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Our customer service team is here to help you with any questions or concerns.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-red-600 text-xl">📧</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Email Support</p>
                  <p className="text-sm text-gray-600">support@snatchers.in</p>
                </div>
              </div>
              
              
              <div className="flex items-center justify-center space-x-3">
                <span className="text-red-600 text-xl">⏰</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Business Hours</p>
                  <p className="text-sm text-gray-600">Mon-Fri 9AM-6PM IST</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <a
                href="/about"
                className="inline-block px-6 py-3 border-2 border-red-600 text-red-600 font-medium rounded hover:bg-red-600 hover:text-white transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default FAQ;
