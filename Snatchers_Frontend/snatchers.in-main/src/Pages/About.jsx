import React from 'react';
import { 
  ScrollReveal, 
  StaggeredReveal, 
  RevealOnScroll,
  MagneticScroll,
  ParallaxImage 
} from "../components/ScrollAnimations";

const founders = [
  {
    name: "Abhijit Sahu",
    title: "Founder",
    description:
      "Abhijit Sahu, the Founder of Snatchers, brings with him valuable startup experience and a passion for innovation. With a strong focus on delivering quality products, he is committed to creating jewellery that blends craftsmanship, trust, and timeless elegance for every customer.",
    imgSrc: "/abhijeet.jpg",
  },
  {
    name: "Ayush Gupta",
    title: "Co-Founder",
    description:
      "Ayush Gupta, Co-Founder of Snatchers, brings a wealth of expertise with a strong background in startups and sustainability. With a clear focus on delivering excellent customer service, he is dedicated to making jewellery both meaningful and accessible.",
    imgSrc: "/Ayush.jpg",
  },
];

export default function About() {
  return (
    <div className="bg-white text-gray-800 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <MagneticScroll strength={0.1}>
          <ScrollReveal direction="up" distance={50}>
            <h1 className="text-4xl font-bold mb-6">About Snatchers.in</h1>
          </ScrollReveal>
        </MagneticScroll>
        
        <StaggeredReveal staggerDelay={0.2} direction="up" distance={30}>
          <div className="space-y-4 mb-8">
            <RevealOnScroll direction="left" distance={40}>
              <p className="mb-4">
                At <strong>Snatchers.in</strong>, we believe that jewelry transcends gender boundaries. Our mission is to craft pieces that empower individuals to express their unique identities, free from traditional norms.
              </p>
            </RevealOnScroll>
            
            <RevealOnScroll direction="right" distance={40}>
              <p className="mb-4">
                Founded in 2025, Snatchers.in emerged from a vision to redefine jewelry as a medium of self-expression. Our collections blend timeless elegance with contemporary flair, ensuring that every piece resonates with authenticity and style.
              </p>
            </RevealOnScroll>
          </div>
        </StaggeredReveal>

        {/* <ScrollReveal direction="up" distance={60}>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Philosophy</h2>
        </ScrollReveal> */}
        
        {/* <StaggeredReveal staggerDelay={0.15} direction="up" distance={25}>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Inclusivity</strong>: Designs that cater to all, celebrating diversity and individuality.</li>
            <li><strong>Craftsmanship</strong>: Meticulous attention to detail, ensuring each piece is a masterpiece.</li>
            <li><strong>Sustainability</strong>: Ethically sourced materials and eco-friendly practices at the core of our operations.</li>
          </ul>
        </StaggeredReveal>

        <StaggeredReveal staggerDelay={0.2} direction="up" distance={40}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MagneticScroll strength={0.15}>
              <div>
                <ParallaxImage speed={0.2} direction="up">
                  <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" alt="Unisex Jewelry Collection" className="rounded-lg shadow-md" />
                </ParallaxImage>
                <p className="mt-2 text-center text-sm">Elegant pieces that redefine modern jewelry.</p>
              </div>
            </MagneticScroll>
            
            <MagneticScroll strength={0.15}>
              <div>
                <ParallaxImage speed={0.3} direction="down">
                  <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" alt="Craftsmanship in Action" className="rounded-lg shadow-md" />
                </ParallaxImage>
                <p className="mt-2 text-center text-sm">Artisans at work, bringing designs to life.</p>
              </div>
            </MagneticScroll>
            
            <MagneticScroll strength={0.15}>
              <div>
                <ParallaxImage speed={0.25} direction="left">
                  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" alt="Empowering Self-Expression" className="rounded-lg shadow-md" />
                </ParallaxImage>
                <p className="mt-2 text-center text-sm">Jewelry that tells your story.</p>
              </div>
            </MagneticScroll>
          </div>
        </StaggeredReveal> */}

        {/* Founders Section */}
        <ScrollReveal direction="up" distance={60}>
          <h2 className="text-2xl font-semibold mt-12 mb-6 text-center" style={{ fontFamily: "'Italiana', serif" }}>Meet Our Founders</h2>
        </ScrollReveal>

        <StaggeredReveal staggerDelay={0.3} direction="up" distance={40}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {founders.map((founder, index) => (
              <MagneticScroll key={index} strength={0.1}>
                <div className="bg-gray-50 border-2 border-gray-200 hover:border-black transition-colors duration-300 rounded-lg p-6 text-center">
                  <ParallaxImage speed={0.2} direction="up">
                    <div className="mb-4 flex justify-center">
                      <img 
                        src={founder.imgSrc} 
                        alt={founder.name} 
                        className="w-40 h-40 object-cover rounded-full border-4 border-gray-300 shadow-lg"
                      />
                    </div>
                  </ParallaxImage>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1" style={{ fontFamily: "'Italiana', serif" }}>
                    {founder.name}
                  </h3>
                  <p className="text-red-600 font-medium mb-4">{founder.title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {founder.description}
                  </p>
                </div>
              </MagneticScroll>
            ))}
          </div>
        </StaggeredReveal>
      </div>
    </div>
  );
}
