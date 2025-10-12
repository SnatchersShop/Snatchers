import React from "react";
import { Link } from "react-router-dom";



const Blog1 = () => (
  <article className="max-w-screen-md mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-lg">
    {/* Main Blog Image */}
    <img
      src="/nackless.jpg"
      alt="How to Pick the Perfect Gift for Her"
      className="rounded-lg shadow-md mb-6 w-full object-cover max-h-[350px]"
    />

    {/* Pendant Image & Quote Section */}
    <div className="flex flex-col sm:flex-row gap-6 items-center bg-gray-50 p-6 rounded-lg mb-8">
      {/* <img
        src={pendantImage}
        alt="Pendant jewellery gift"
        className="w-40 h-40 rounded-lg object-cover border border-gray-200"
      /> */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-2">Most-Loved Snatchers Quote:</h3>
        <blockquote className="italic text-gray-700 border-l-4 border-red-500 pl-4">
          "Gifts are not about price tags—they’re about presence. A small pendant that matches her soul is worth more than any grand gesture."
        </blockquote>
        <p className="mt-3 text-gray-700">
          This blog post isn’t just a guide—it’s a mood. A mindset. A reminder that thoughtful gifting can transform even the simplest accessory into a keepsake of love and meaning.
        </p>
      </div>
    </div>

    {/* Blog Heading & Date */}
    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
      How to Pick the Perfect Gift for Her
    </h1>
    <p className="text-red-600 font-semibold mb-6">20/June/2018</p>

    {/* Blog Content */}
    <section className="prose prose-lg prose-red max-w-none mb-6">
      <p>
        A journey of thoughtfulness, intention, and emotional connection.
      </p>
      <p>
        Choosing the right gift can be exciting—and overwhelming. Whether she’s your partner, best friend, mom, or a colleague you admire, the stakes feel high. A gift isn’t just material—it’s a reflection of your attention, memories, and shared moments.
      </p>
      <p>
        This heartfelt guide dives into the emotional intelligence behind good gifting. At <strong>Snatchers</strong>, we believe jewellery should speak louder than words.
      </p>
      <h2 className="text-2xl font-semibold mt-8">What Makes a Gift ‘Perfect’?</h2>
      <p>
        It feels personal. Not just pretty. Personalized touches like initials, birthstones, or designs that align with her story show you’ve truly seen her.
      </p>
      <p>
        It carries emotion—whether it symbolizes strength, love, growth, or an inside joke. Gifts become memories cast in metal.
      </p>
      <p>
        Great gifts become heirlooms. Every time she wears it, she remembers you.
      </p>
      <h3 className="mt-6 font-bold text-xl mb-2">Pro Tips from the Article:</h3>
      <ul className="pl-5 list-disc text-base text-gray-800">
        <li>
          Sneak a peek at her current jewellery style. Is she silver or gold? Dainty or bold?
        </li>
        <li>
          Consider moments, not just objects. A bracelet for her new job. A necklace to celebrate a milestone. Earrings for the night you first met.
        </li>
        <li>
          Don’t wait for the perfect moment. Sometimes the “just because” gifts leave the deepest imprint.
        </li>
      </ul>
    </section>

    {/* Back Link */}
    <Link
      to="/"
      className="inline-block mt-8 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
    >
      ← Back to Blog
    </Link>
  </article>
);

export default Blog1;
