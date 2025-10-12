import React from "react";
import { Link } from "react-router-dom";

const Blog2 = () => {
  return (
    <article className="max-w-screen-md mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <img
        src="/earing.jpg"
        alt="5 Affordable Earrings That Look Premium"
        className="rounded-lg shadow-md mb-6 w-full object-cover max-h-[400px]"
      />
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        5 Affordable Earrings That Look Premium
      </h1>
      <p className="text-red-600 font-semibold mb-6">21/June/2018</p>

      <div className="prose prose-lg prose-red max-w-none">
        <p>Because elegance shouldn’t come with an elite price tag.</p>

        <h2>Smart Luxury</h2>
        <p>Elegance doesn’t always mean expensive.</p>

        <h3>Top Picks</h3>
        <ul>
          <li>Minimalist hoops</li>
          <li>Studs with crystal shine</li>
          <li>Pearl-inspired designs</li>
          <li>Modern geometric styles</li>
          <li>Classic gold-toned finish</li>
        </ul>

        <p>
          Each is budget-friendly yet premium looking — perfect for elevating
          your daily style.
        </p>
      </div>

      {/* ------------ ADDITIONAL IMAGE & DATA FROM THE SCREENSHOT ------------- */}
      <section className="mt-10 bg-white text-black p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          5 Affordable Earrings That Look Premium
        </h2>
        <p>
          Because elegance shouldn’t come with an elite price tag.
        </p>
        <p className="mt-4">
          Let’s talk about smart luxury. Not every chic piece needs to break the bank. In fact, some of the most striking, versatile, and high-quality designs are sitting right under your nose—on Snatchers.
        </p>
        <p className="mt-4">
          This blog is a celebration of everyday glamour—earrings that work just as hard as you do, from morning meetings to moonlit dinners. Affordable, yes. But never average.
        </p>

        <h3 className="mt-6 font-bold">Why This Blog Hit Home:</h3>
        <ul className="list-disc list-inside">
          <li>It proves that you don’t need to compromise on quality just to stay within budget.</li>
          <li>It champions design details that elevate your look: gold tones, polished edges, flawless pearls, and smart silhouettes.</li>
          <li>It empowers you to shop intentionally—not impulsively.</li>
        </ul>

        <h3 className="mt-6 font-bold">Top Picks Featured in the Blog:</h3>
        <ol className="list-decimal list-inside">
          <li>
            <strong>Aurora Pearl Hoops</strong> – Timeless elegance meets modern design. Understated, but unforgettable.
          </li>
          <li>
            <strong>Celeste Drop Earrings</strong> – A favorite for special occasions—shimmer without the sparkle overload.
          </li>
          <li>
            <strong>Twist of Gold Mini Hoops</strong> – Perfect for stacking or solo wear. Lightweight, luxe, and completely effortless.
          </li>
          <li>
            <strong>Cleo Crystal Studs</strong> – Sleek, structured, and edgy—made for the bold minimalists.
          </li>
          <li>
            <strong>Everyday Luxe Chain Earrings</strong> – Swingy, stylish, and surprisingly versatile.
          </li>
        </ol>
        {/* Replace the src below with your uploaded image link or local file path */}
        {/* <img
          src="YOUR_MODEL_IMAGE_URL_HERE"
          alt="Model wearing pearl hoop earrings"
          className="rounded-lg shadow-md mt-6 mb-6 w-[250px]"
        /> */}
        <h3 className="font-bold mt-4">Style Wisdom from the Article:</h3>
        <blockquote className="italic border-l-4 border-red-600 pl-4 mt-2 mb-4">
          “Good jewellery doesn’t scream. It whispers, shines, and stays with you quietly through all your chapters.”
        </blockquote>
        <p>
          This blog became a go-to for college students building their style, working professionals revamping their wardrobe, and thoughtful gifters looking for beauty on a budget. It’s a reminder that elegance is never about the price—it’s about how you wear it, and how it makes you feel.
        </p>
      </section>

      {/* ------------ END ADDED CONTENT ------------- */}

      <Link
        to="/"
        className="inline-block mt-8 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        ← Back to Blog
      </Link>
    </article>
  );
};

export default Blog2;
