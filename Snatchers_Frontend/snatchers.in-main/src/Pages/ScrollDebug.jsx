import React from 'react';
import { 
  ScrollReveal, 
  RevealOnScroll, 
  DebugScrollReveal,
  SimpleScrollReveal,
  ScrollProgress 
} from "../components/ScrollAnimations";

const ScrollDebug = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <ScrollProgress />
      
      {/* Debug Info */}
      <div className="fixed top-4 left-4 bg-black text-white p-4 rounded-lg z-50">
        <h3 className="font-bold">Scroll Debug</h3>
        <p>Check console for scroll events</p>
      </div>

      {/* Test Section 1 - Basic ScrollReveal */}
      <div className="h-screen flex items-center justify-center bg-blue-100">
        <h1 className="text-4xl font-bold text-blue-800">Scroll Down to See Effects</h1>
      </div>

      {/* Test Section 2 - ScrollReveal */}
      <div className="h-screen bg-red-100 flex items-center justify-center">
        <ScrollReveal direction="up" distance={100}>
          <div className="bg-red-500 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold">ScrollReveal Test</h2>
            <p>This should animate from bottom</p>
          </div>
        </ScrollReveal>
      </div>

      {/* Test Section 3 - RevealOnScroll */}
      <div className="h-screen bg-green-100 flex items-center justify-center">
        <RevealOnScroll direction="left" distance={100}>
          <div className="bg-green-500 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold">RevealOnScroll Test</h2>
            <p>This should animate from left</p>
          </div>
        </RevealOnScroll>
      </div>

      {/* Test Section 4 - Debug Version */}
      <DebugScrollReveal direction="right" distance={100}>
        <h2 className="text-2xl font-bold text-white">Debug ScrollReveal</h2>
        <p className="text-white">This shows debug info and console logs</p>
      </DebugScrollReveal>

      {/* Test Section 5 - Multiple Elements */}
      <div className="h-screen bg-purple-100 flex flex-col items-center justify-center space-y-8">
        <ScrollReveal direction="up" distance={50} delay={0}>
          <div className="bg-purple-500 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold">Element 1</h3>
          </div>
        </ScrollReveal>
        
        <ScrollReveal direction="up" distance={50} delay={0.2}>
          <div className="bg-purple-600 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold">Element 2</h3>
          </div>
        </ScrollReveal>
        
        <ScrollReveal direction="up" distance={50} delay={0.4}>
          <div className="bg-purple-700 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold">Element 3</h3>
          </div>
        </ScrollReveal>
      </div>

      {/* Test Section 6 - Scale Effect */}
      <div className="h-screen bg-yellow-100 flex items-center justify-center">
        <ScrollReveal direction="scale" distance={0}>
          <div className="bg-yellow-500 text-black p-8 rounded-lg">
            <h2 className="text-2xl font-bold">Scale Effect</h2>
            <p>This should scale from 0.8 to 1.0</p>
          </div>
        </ScrollReveal>
      </div>

      {/* Final Section */}
      <div className="h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">End of Test</h1>
          <p className="text-xl">Check if all animations worked correctly</p>
        </div>
      </div>
    </div>
  );
};

export default ScrollDebug;
