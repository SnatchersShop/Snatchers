import React from "react";
import { Link } from "react-router-dom";

const Blog3 = () => {
  return (
    <article className="max-w-screen-md mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <img
        src="/ring.jpg" // Replace with a more fitting image if needed
        alt="Handmade Jewellery at Snatchers"
        className="rounded-lg shadow-md mb-6 w-full object-cover max-h-[400px]"
      />

      {/* Date or optional meta */}
      <p className="text-red-600 font-semibold mb-6">10/September/2025</p>
      
      {/* Note from Artisans */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">A Note from Our Artisans</h2>
        <blockquote className="italic text-gray-600 mb-2">
          “When someone wears a piece we’ve handcrafted, they’re not just wearing metal or stone. They’re wearing our time, our emotion, and our story. And that means everything to us.”
        </blockquote>
        <p className="text-gray-600 mb-4">– The Snatchers Artisan Team</p>
      </section>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        You Can Buy With Joy—And You Should
      </h1>

      {/* First Section */}
      <section className="prose prose-lg max-w-none mb-8">
        <p>
          At <strong>Snatchers</strong>, we want you to feel proud of what you wear—and how it’s made.
        </p>
        <p>
          When you shop our handmade collection, you’re doing more than buying jewellery:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>You’re supporting skilled hands, not machines</li>
          <li>You’re choosing sustainability over speed</li>
          <li>You’re wearing authentic beauty, made just for you</li>
        </ul>
        <p>
          Whether you’re gifting someone special or treating yourself (because why not?), our handmade pieces are filled with meaning, intention, and soul.
        </p>
        <p>
          You can buy with joy—because Snatchers handmade jewellery isn’t just made to be worn. It’s made to be felt.
        </p>
        <p>
          Explore our latest handmade arrivals on Snatchers.com, and experience jewellery that goes beyond trends—into timeless artistry.
        </p>
      </section>

      {/* Behind the Scenes */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          3. Behind the Scenes: How We Craft Our Handmade Jewellery at Snatchers
        </h2>
        <p>
          Where every piece begins with heart and ends with a story.
        </p>
        <p>
          At Snatchers, we don’t believe in fast fashion or soulless production. We believe in jewellery with meaning—pieces that carry the warmth of human hands, the depth of craftsmanship, and the charm of imperfection. Our handmade jewellery collection is a celebration of slow beauty, intimate detail, and thoughtful design.
        </p>
      </section>

      {/* What Handmade Means */}
      <section className="mb-8">
        <p>
          When you wear a handmade piece from Snatchers, you’re not just adding style to your outfit—you’re wearing hours of dedication, love, and intention.
        </p>
        <h3 className="text-xl font-semibold mb-2">What Handmade Means to Us</h3>
        <p>
          Every piece in our handmade collection begins with a sketch—an idea born from emotion, inspired by stories, and crafted for real people. From there, our skilled artisans carefully bring that vision to life using traditional techniques and modern creativity.
        </p>
        <p>Here’s what makes Snatchers handmade jewellery so special:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Hand-sketched designs, not mass templates</li>
          <li>Individually crafted by skilled artisans</li>
          <li>Stone-setting done by hand, not machines</li>
          <li>Sustainably sourced materials and minimal waste</li>
          <li>Polished and finished one by one to ensure uniqueness and quality</li>
        </ul>
        <p>
          Each earring, ring, bracelet, or necklace carries subtle signs that it was made by human hands—tiny differences that make every piece truly one of a kind.
        </p>
      </section>

      {/* Why Handmade Jewellery Matters */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Why Handmade Jewellery Matters</h3>
        <p>
          In a world where almost everything is made in bulk, handmade jewellery stands apart.
        </p>
        <p>
          It tells a different story.
        </p>
        <blockquote className="italic text-gray-600 mb-2">
          <span>It says: “<span className="font-bold">Someone made this with care.</span>”<br /></span>
          <span>It whispers: “<span className="font-bold">This was crafted just for you.</span>”</span>
        </blockquote>
        <p>
          These small imperfections aren’t flaws. They’re fingerprints of love—proof that your jewellery didn’t just come off an assembly line. It came from a place of passion.
        </p>
        <p>
          That’s what makes wearing Snatchers handmade jewellery so deeply personal. It’s not just an accessory. It’s a memory. A message. A moment.
        </p>
      </section>

      <Link
        to="/"
        className="inline-block mt-8 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        ← Back to Blog
      </Link>
    </article>
  );
};

export default Blog3;
