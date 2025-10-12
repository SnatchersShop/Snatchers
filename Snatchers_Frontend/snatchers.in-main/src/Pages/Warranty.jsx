import React from 'react';
import { motion } from 'framer-motion';

const Warranty = () => {
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
          Warranty Policy
        </motion.h1>

        {/* Decorative Line */}
        <div className="flex justify-center items-center mb-6 sm:mb-8">
          <img
            src="./title-line.png"
            alt="Decorative underline"
            className="h-4 sm:h-6 md:h-8 lg:h-10 max-w-full object-contain"
          />
        </div>
        
        {/* Warranty Overview */}
        <section className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center"
            style={{ fontFamily: "'Italiana', serif" }}
          >
            Warranty Coverage
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Manufacturing Defects</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Coverage Period:</strong> 2 years from purchase date</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Defective Materials:</strong> Free replacement or repair</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Workmanship Issues:</strong> Covered under warranty</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Structural Problems:</strong> Full coverage for design flaws</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Gemstone Warranty</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Loose Stones:</strong> 1 year from purchase date</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Setting Issues:</strong> Free repair or replacement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Natural Defects:</strong> Covered if present at purchase</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Certified Stones:</strong> Full authenticity guarantee</span>
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
            <h4 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: "'Italiana', serif" }}>What's Covered</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Manufacturing defects in materials or workmanship</li>
              <li>• Structural issues that affect the piece's integrity</li>
              <li>• Loose or missing stones due to setting problems</li>
              <li>• Tarnishing or discoloration under normal wear conditions</li>
              <li>• Clasp or closure mechanism failures</li>
            </ul>
          </motion.div>
        </section>

        {/* Warranty Exclusions */}
        <section className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center"
            style={{ fontFamily: "'Italiana', serif" }}
          >
            Warranty Exclusions
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Normal Wear & Tear</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Scratches:</strong> From daily wear and use</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Dents:</strong> From accidental impacts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Bending:</strong> From improper handling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Oxidation:</strong> Natural aging of metals</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Misuse & Damage</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Improper Care:</strong> Using harsh chemicals or cleaners</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Physical Damage:</strong> From sports or heavy activities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Modifications:</strong> Any alterations to original design</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Loss or Theft:</strong> Not covered under warranty</span>
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
            <h4 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: "'Italiana', serif" }}>Important Notes</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Warranty is non-transferable and valid only for original purchaser</li>
              <li>• Proof of purchase required for all warranty claims</li>
              <li>• Warranty does not cover damage from accidents or misuse</li>
              <li>• Regular maintenance and proper care are customer responsibilities</li>
              <li>• Warranty may be voided if piece is repaired by unauthorized personnel</li>
            </ul>
          </motion.div>
        </section>

        {/* Warranty Claim Process */}
        <section className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center"
            style={{ fontFamily: "'Italiana', serif" }}
          >
            How to Claim Warranty
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
              <p className="text-sm text-gray-600">Email us at warranty@snatchers.in with your order number and detailed description of the issue.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.1 }}
              className="text-center p-6 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2" style={{ fontFamily: "'Italiana', serif" }}>Assessment</h3>
              <p className="text-sm text-gray-600">Our experts will evaluate the issue and determine if it's covered under warranty terms.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.2 }}
              className="text-center p-6 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2" style={{ fontFamily: "'Italiana', serif" }}>Resolution</h3>
              <p className="text-sm text-gray-600">We'll repair, replace, or provide store credit based on the assessment and warranty terms.</p>
            </motion.div>
          </div>
        </section>

        {/* Care Instructions */}
        <section className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.3 }}
            className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center"
            style={{ fontFamily: "'Italiana', serif" }}
          >
            Care Instructions
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1.4 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Daily Care</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Storage:</strong> Keep in soft cloth or jewelry box</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Cleaning:</strong> Use mild soap and warm water</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Drying:</strong> Pat dry with soft, lint-free cloth</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Separation:</strong> Store pieces separately to prevent scratching</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1.5 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>What to Avoid</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Chemicals:</strong> Perfumes, lotions, and harsh cleaners</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Activities:</strong> Swimming, sports, or heavy lifting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Extreme Temperatures:</strong> Avoid sudden temperature changes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Ultrasonic Cleaners:</strong> Can damage certain stones</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.6 }}
            className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center"
            style={{ fontFamily: "'Italiana', serif" }}
          >
            Warranty Support
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1.7 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Warranty Claims</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <span className="text-red-600 mr-3">📧</span>
                  <span>Email: warranty@snatchers.in</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-600 mr-3">📞</span>
                  <span>Phone: +91 98765 43210</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-600 mr-3">⏰</span>
                  <span>Hours: Mon-Fri 9AM-6PM IST</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-600 mr-3">📋</span>
                  <span>Response Time: Within 24 hours</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1.8 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Service Center</h3>
              <div className="text-sm text-gray-600">
                <p className="font-semibold mb-2">Snatchers.in Service Center</p>
                <p>123 Jewelry Street</p>
                <p>Mumbai, Maharashtra 400001</p>
                <p>India</p>
                <p className="mt-2 text-xs text-gray-500">Please include your order number and warranty claim details.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.9 }}
            className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center"
            style={{ fontFamily: "'Italiana', serif" }}
          >
            Warranty FAQ
          </motion.h2>
          
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 2.0 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h4 className="font-semibold mb-2 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>How long is the warranty valid?</h4>
              <p className="text-sm text-gray-600">Our warranty covers manufacturing defects for 2 years from the purchase date. Gemstone warranties are valid for 1 year from purchase.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 2.1 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h4 className="font-semibold mb-2 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>What if I lose my receipt?</h4>
              <p className="text-sm text-gray-600">We can look up your purchase using your email address or phone number. However, having the original receipt speeds up the warranty process.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 2.2 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h4 className="font-semibold mb-2 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>Can I get my jewelry repaired elsewhere?</h4>
              <p className="text-sm text-gray-600">We recommend using our authorized service centers. Repairs by unauthorized personnel may void your warranty.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 2.3 }}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-300"
            >
              <h4 className="font-semibold mb-2 text-red-600" style={{ fontFamily: "'Italiana', serif" }}>How long does warranty repair take?</h4>
              <p className="text-sm text-gray-600">Most warranty repairs are completed within 2-3 weeks. Complex repairs may take up to 4-6 weeks. We'll keep you updated throughout the process.</p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Warranty;
