import React from 'react';
import { 
  ScrollReveal, 
  StaggeredReveal, 
  ParallaxSection, 
  MagneticScroll, 
  ScrollTrigger, 
  ParallaxImage, 
  RevealOnScroll,
  ScrollBasedRotation,
  MorphingBackground,
  StickyScroll,
  TextReveal,
  SmoothScroll,
  MomentumScroll,
  ElasticScroll
} from "../components/ScrollAnimations";

const ScrollEffectsDemo = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-600 relative overflow-hidden">
        <ParallaxImage speed={0.3} direction="up">
          <div className="text-center text-white z-10">
            <TextReveal 
              text="Advanced Scroll Effects" 
              animationType="word" 
              className="text-6xl font-bold mb-4"
            />
            <TextReveal 
              text="Experience the future of web interactions" 
              animationType="letter" 
              className="text-xl opacity-90"
              delay={0.05}
            />
          </div>
        </ParallaxImage>
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </section>

      {/* Magnetic Scroll Demo */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <RevealOnScroll direction="up" distance={50}>
            <h2 className="text-4xl font-bold text-center mb-16">Magnetic Scroll Effects</h2>
          </RevealOnScroll>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MagneticScroll strength={0.3} range={30}>
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-semibold mb-4">Hover Me!</h3>
                <p className="text-gray-600">Move your mouse over this card to see the magnetic effect.</p>
              </div>
            </MagneticScroll>
            
            <MagneticScroll strength={0.5} range={50}>
              <div className="bg-red-500 text-white p-8 rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-semibold mb-4">Strong Magnet</h3>
                <p>This one has a stronger magnetic pull!</p>
              </div>
            </MagneticScroll>
            
            <MagneticScroll strength={0.2} range={20}>
              <div className="bg-blue-500 text-white p-8 rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-semibold mb-4">Subtle Effect</h3>
                <p>A gentle magnetic attraction.</p>
              </div>
            </MagneticScroll>
          </div>
        </div>
      </section>

      {/* Morphing Background */}
      <MorphingBackground color1="#ffffff" color2="#f8f9fa" color3="#e9ecef">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="left" distance={100}>
              <h2 className="text-4xl font-bold text-center mb-16">Morphing Background</h2>
            </ScrollReveal>
            
            <StaggeredReveal staggerDelay={0.2} direction="up" distance={40}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-3">Card {item}</h3>
                    <p className="text-gray-600">Watch how the background morphs as you scroll!</p>
                  </div>
                ))}
              </div>
            </StaggeredReveal>
          </div>
        </section>
      </MorphingBackground>

      {/* Scroll Trigger Effects */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <ScrollTrigger trigger={0.3} animationType="scale" animationValue={1.1}>
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-8">Scroll Trigger</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                This section scales up when it reaches 30% of the viewport. 
                Keep scrolling to see it in action!
              </p>
            </div>
          </ScrollTrigger>
        </div>
      </section>

      {/* Rotation Effects */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollBasedRotation rotationRange={[0, 10]} speed={0.3}>
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-8">Rotation on Scroll</h2>
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
                <span className="text-white font-bold text-xl">Rotate</span>
              </div>
            </div>
          </ScrollBasedRotation>
        </div>
      </section>

      {/* Sticky Scroll Demo */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <StickyScroll>
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-8">Sticky Scroll</h2>
              <p className="text-xl">
                This content stays in place while you scroll through the section.
              </p>
            </div>
          </StickyScroll>
        </div>
      </section>

      {/* Parallax Layers */}
      <section className="h-screen relative overflow-hidden">
        <ParallaxImage speed={0.5} direction="up">
          <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-blue-500"></div>
        </ParallaxImage>
        
        <ParallaxImage speed={0.3} direction="down">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
        </ParallaxImage>
        
        <div className="relative z-10 h-full flex items-center justify-center text-white">
          <RevealOnScroll direction="scale" distance={0}>
            <div className="text-center">
              <h2 className="text-6xl font-bold mb-4">Layered Parallax</h2>
              <p className="text-xl">Multiple layers moving at different speeds</p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Text Reveal Demo */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <TextReveal 
              text="Word by Word Animation" 
              animationType="word" 
              className="text-5xl font-bold mb-8"
            />
            <TextReveal 
              text="Letter by Letter Animation" 
              animationType="letter" 
              className="text-3xl text-gray-600 mb-8"
              delay={0.1}
            />
            <TextReveal 
              text="This is a longer paragraph that demonstrates how the text reveal effect works with multiple sentences and words. Each word appears with a smooth animation as you scroll down the page." 
              animationType="word" 
              className="text-lg text-gray-700 leading-relaxed"
              delay={0.05}
            />
          </div>
        </div>
      </section>

      {/* Smooth Scroll Demo */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up" distance={50}>
            <h2 className="text-4xl font-bold text-center mb-16">Smooth & Elastic Scroll</h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MomentumScroll className="h-64 bg-white bg-opacity-20 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Momentum Scroll</h3>
              <p className="text-sm opacity-90">
                Drag this container to experience momentum-based scrolling with physics!
              </p>
              <div className="mt-4 text-xs opacity-75">
                Try dragging and releasing to see the momentum effect.
              </div>
            </MomentumScroll>
            
            <ElasticScroll className="h-64 bg-white bg-opacity-20 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Elastic Scroll</h3>
              <p className="text-sm opacity-90">
                Experience elastic boundaries that bounce back naturally!
              </p>
              <div className="mt-4 text-xs opacity-75">
                Scroll beyond the boundaries to see elastic resistance.
              </div>
            </ElasticScroll>
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal direction="up" distance={100} duration={1}>
            <h2 className="text-5xl font-bold mb-8">Ultra-Smooth Animations!</h2>
            <p className="text-xl mb-8">
              Now with advanced spring physics, momentum, and elastic scrolling!
            </p>
            <MagneticScroll strength={0.4}>
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 elastic-bounce">
                Experience the Magic
              </button>
            </MagneticScroll>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default ScrollEffectsDemo;
