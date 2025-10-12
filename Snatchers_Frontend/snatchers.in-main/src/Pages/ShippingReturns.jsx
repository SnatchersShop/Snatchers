import React from 'react';
import { motion } from 'framer-motion';

const ShippingReturns = () => {
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
          Shipping & Returns
        </motion.h1>

        {/* Decorative Line */}
        <div className="flex justify-center items-center mb-6 sm:mb-8">
          <img
            src="./title-line.png"
            alt="Decorative underline"
            className="h-4 sm:h-6 md:h-8 lg:h-10 max-w-full object-contain"
          />
        </div>
        
        {/* Shipping Information */}
        <section className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center"
            style={{ fontFamily: "'Italiana', serif" }}
          >
            Shipping Information
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Domestic Shipping</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Standard Shipping:</strong> 3-5 business days - ₹99</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Express Shipping:</strong> 1-2 business days - ₹199</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Free Shipping:</strong> On orders above ₹2,999</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Same Day Delivery:</strong> Available in select cities - ₹299</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>International Shipping</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Standard International:</strong> 7-14 business days - ₹799</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Express International:</strong> 3-7 business days - ₹1,299</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Customs & Duties:</strong> Additional charges may apply</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Tracking:</strong> Provided for all international orders</span>
                </li>
              </ul>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-gray-50 border-2 border-gray-300 p-6 mb-6 rounded-lg"
          >
            <h4 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: "'Italiana', serif" }}>Important Shipping Notes</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Processing time: 1-2 business days for all orders</li>
              <li>• Orders placed after 2 PM will be processed the next business day</li>
              <li>• We ship Monday through Friday, excluding public holidays</li>
              <li>• Delivery times may vary during peak seasons and holidays</li>
              <li>• Signature may be required for delivery of high-value items</li>
            </ul>
          </motion.div>
        </section>

        {/* Returns & Exchanges */}
        <section className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center"
            style={{ fontFamily: "'Italiana', serif" }}
          >
            Returns & Exchanges
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Return Policy</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Return Window:</strong> 30 days from delivery date</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Condition:</strong> Items must be unworn and in original packaging</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Return Shipping:</strong> Customer responsible for return shipping costs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Refund Processing:</strong> 5-7 business days after receipt</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Exchange Policy</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Exchange Window:</strong> 30 days from delivery date</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Size Exchanges:</strong> Free exchange for size issues</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Style Exchanges:</strong> Price difference applies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Processing Time:</strong> 3-5 business days</span>
                </li>
              </ul>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="bg-gray-50 border-2 border-gray-300 p-6 mb-6 rounded-lg"
          >
            <h4 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: "'Italiana', serif" }}>Non-Returnable Items</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Custom or personalized jewelry</li>
              <li>• Items damaged by customer</li>
              <li>• Items returned after 30 days</li>
              <li>• Items without original packaging or tags</li>
              <li>• Sale items marked as "Final Sale"</li>
            </ul>
          </motion.div>
        </section>

        {/* How to Return */}
        <section className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center"
            style={{ fontFamily: "'Italiana', serif" }}
          >
            How to Return or Exchange
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.0 }}
              className="text-center p-6 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2" style={{ fontFamily: "'Italiana', serif" }}>Contact Us</h3>
              <p className="text-sm text-gray-600">Email us at returns@snatchers.in or call our customer service team to initiate your return.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.1 }}
              className="text-center p-6 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2" style={{ fontFamily: "'Italiana', serif" }}>Package Items</h3>
              <p className="text-sm text-gray-600">Pack your items securely in the original packaging with all tags and certificates included.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.2 }}
              className="text-center p-6 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2" style={{ fontFamily: "'Italiana', serif" }}>Ship Back</h3>
              <p className="text-sm text-gray-600">Ship the package to our return address. We'll process your return within 5-7 business days.</p>
            </motion.div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.3 }}
            className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center"
            style={{ fontFamily: "'Italiana', serif" }}
          >
            Need Help?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1.4 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Customer Service</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <span className="text-red-600 mr-3">📧</span>
                  <span>Email: support@snatchers.in</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-600 mr-3">📞</span>
                  <span>Phone: +91 98765 43210</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-600 mr-3">⏰</span>
                  <span>Hours: Mon-Fri 9AM-6PM IST</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1.5 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Return Address</h3>
              <div className="text-sm text-gray-600">
                <p className="font-semibold mb-2">Snatchers.in Returns</p>
                <p>123 Jewelry Street</p>
                <p>Mumbai, Maharashtra 400001</p>
                <p>India</p>
                <p className="mt-2 text-xs text-gray-500">Please include your order number and reason for return.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.6 }}
            className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center"
            style={{ fontFamily: "'Italiana', serif" }}
          >
            Frequently Asked Questions
          </motion.h2>
          
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.7 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h4 className="font-semibold mb-2 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>How long does shipping take?</h4>
              <p className="text-sm text-gray-600">Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. International shipping takes 7-14 business days.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.8 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h4 className="font-semibold mb-2 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Can I track my order?</h4>
              <p className="text-sm text-gray-600">Yes! You'll receive a tracking number via email once your order ships. You can track your package on our website or the courier's website.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.9 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h4 className="font-semibold mb-2 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>What if my item arrives damaged?</h4>
              <p className="text-sm text-gray-600">If your item arrives damaged, please contact us immediately with photos. We'll arrange for a replacement or full refund at no cost to you.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 2.0 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h4 className="font-semibold mb-2 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Do you offer international shipping?</h4>
              <p className="text-sm text-gray-600">Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Customs duties may apply.</p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShippingReturns;
