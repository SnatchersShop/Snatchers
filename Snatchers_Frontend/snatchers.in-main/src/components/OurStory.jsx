import React from 'react';

const OurStory = () => {
  return (
    <section id="our-story" className="py-[90px] px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Left Side Image */}
          <div className="w-full lg:w-1/2">
            <div className="overflow-hidden rounded-md shadow-lg">
              <img
                src="/ourstory.jpg"
                alt="Our Story"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Side Text */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2
              style={{
                fontFamily: "'Italiana', serif",
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 'bold',
                lineHeight: 1.1,
              }}
              className="mb-4"
            >
              Our Story
            </h2>

            <p
              className="text-gray-700 italic mb-6 font-serif"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              }}
            >
              At Snatchers, we believe jewelry should be a reflection of individuality, strength, and elegance.
              Our designs are thoughtfully created for both men and women who seek timeless pieces with a modern soul.
              From signature rose gold hues to ethically sourced gemstones, every detail is crafted with purpose.
              We blend heritage with innovation to create jewelry that tells your story with grace and power.
              Each piece is a celebration of style  handcrafted with care and meant to last.
              True luxury goes beyond appearance; it lies in how something is made and why it matters.
              Our collections inspire confidence, express personality, and complement every occasion.
              Whether bold or minimal, each design is made to elevate your everyday and your special days.
              Discover jewelry that aligns with your vision because at Snatchers, meaning meets style.
            </p>

            <p
              className="text-gray-700 mb-6 italic mb-6 font-serif"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              }}
            >
              Whether it’s the shimmer of a diamond or the charm of handcrafted silver, our collections are crafted to celebrate your moments — big or small. Join us on this sparkling journey of grace, craftsmanship, and tradition.
            </p>

            <a
              href="/about"
              className="inline-block px-6 py-3 border border-red-600 text-red-600 font-medium rounded hover:bg-red-600 hover:text-white transition-colors duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
