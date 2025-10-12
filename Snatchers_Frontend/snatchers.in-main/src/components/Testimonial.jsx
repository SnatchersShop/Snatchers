import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const testimonials = [
  {
    message:
      "These guys have been absolutely outstanding. When I needed them they came through in a big way! I know that if you buy this theme, you'll get the one thing we all look for when we buy on Themeforest, and that's real support for the craziest of requests!",
    name: "Luis Manrata",
    email: "you@email.here",
  },
  {
    message:
      "These guys have been absolutely outstanding. When I needed them they came through in a big way! I know that if you buy this theme, you'll get the one thing we all look for when we buy on Themeforest, and that's real support for the craziest of requests!",
    name: "John Dibba",
    email: "you@email.here",
  },
  {
    message:
      "These guys have been absolutely outstanding. When I needed them they came through in a big way! I know that if you buy this theme, you'll get the one thing we all look for when we buy on Themeforest, and that's real support for the craziest of requests!",
    name: "Alex Tuntuni",
    email: "you@email.here",
  },
];

export default function Testimonial() {
  return (
    <section id="testimonial-area" className="w-full">
      <div
        className="bg-no-repeat bg-cover bg-center px-6 sm:px-4 py-20 sm:py-12"
        style={{ backgroundImage: 'url("/testi_bg.jpg")' }}
      >
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-10 px-2 sm:px-0">
            <h2
              className="text-white font-bold leading-tight mt-11"
              style={{
                fontFamily: "'Italiana', serif",
                fontSize: 'clamp(1.9rem, 6vw, 3.75rem)', // clamps 40px to 60px
              }}
            >
              What People Say
            </h2>
            <p
              className="text-white italic mt-3"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.125rem)', // 16px to 18px
              }}
            >
              Testimonials
            </p>
          </div>

          <div className="max-w-[700px] mx-auto text-center px-4 sm:px-0">
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 1500 }}
              loop
              className="w-full"
            >
              {testimonials.map((item, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="text-[#d2d2d2] italic font-serif px-4"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', // 14px to 16px
                      lineHeight: '1.875rem', // 30px fixed for readability
                    }}
                  >
                    <p>{item.message}</p>
                    <h3
                      className="text-white uppercase mt-8 font-normal not-italic"
                      style={{
                        fontSize: 'clamp(1.25rem, 3vw, 1.6rem)', // 20px to 25.6px
                      }}
                    >
                      {item.name}
                    </h3>
                    <span
                      className="text-[#d2d2d2]"
                      style={{
                        fontSize: 'clamp(0.75rem, 1vw, 0.875rem)', // 12px to 14px
                      }}
                    >
                      {item.email}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
