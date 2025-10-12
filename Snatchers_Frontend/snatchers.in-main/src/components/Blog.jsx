import React from 'react';
import { Link } from 'react-router-dom';

const blogs = [
  {
    id: 1,
    title: 'How to Pick the Perfect Gift for Her',
    date: '20/March/2025',
    description: 'A journey of thoughtfulness, intention, and emotional connection.',
    image: '/nackless.jpg'
  },
  {
    id: 2,
    title: '5 Affordable Earrings That Look Premium',
    date: '21/March/2025',
    description: 'Because elegance shouldn’t come with an elite price tag.',
    image: '/earing.jpg'
  },
  {
    id: 3,
    title: 'How We Craft Our Handmade Jewellery at Snatchers',
    date: '22/March/2025',
    description: 'Where every piece begins with heart and ends with a story.',
    image: '/ring.jpg'
  }
];

const Blog = () => {
  return (
    <section className="py-[0px] px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-screen-xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 px-2 sm:px-0">
          <h2 className="font-bold text-4xl">From Our Blog</h2>
          <p className="text-gray-600 mt-3">
            Share your latest posts or best articles here.
          </p>
        </div>

        {/* Blog List */}
        <div className="flex flex-wrap -mt-[33px]">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 px-4 mt-[33px]"
            >
              <div className="text-center">
                <div className="relative overflow-hidden max-h-[300px] group rounded-md">
                  {/* 🔴 Changed Link */}
                  <Link to={`/blog${blog.id}`}>
                    <img
                      src={blog.image}
                      alt="blog"
                      className="w-full h-auto object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                    />
                  </Link>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-lg">
                    {/* 🔴 Changed Link */}
                    <Link
                      to={`/blog${blog.id}`}
                      className="text-black hover:text-red-600 transition"
                    >
                      {blog.title}
                    </Link>
                  </h3>
                  <span className="text-sm italic font-bold block mt-2 mb-4 text-red-600">
                    {blog.date}
                  </span>
                  <p className="italic text-gray-700">{blog.description}</p>
                  {/* 🔴 Changed Link */}
                  <Link
                    to={`/blog${blog.id}`}
                    className="inline-block mt-4 text-red-600 hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
