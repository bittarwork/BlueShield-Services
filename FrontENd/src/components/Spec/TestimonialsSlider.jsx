import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useTheme } from "../../contexts/ThemeContext"; // استيراد useTheme من ملف الثيم
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa"; // أيقونات من react-icons
import { motion } from "framer-motion"; // مكتبة framer-motion للانيميشن

const TestimonialsSlider = () => {
  const { isDarkMode } = useTheme(); // استخدام الثيم لتحديد الوضع الحالي

  const testimonials = [
    {
      id: 1,
      quote:
        "BlueShield Services saved us during a critical water pump failure. Their team was quick, professional, and provided a temporary water solution until the issue was resolved.",
      author: "Ahmed S.",
    },
    {
      id: 2,
      quote:
        "The real-time tracking feature is amazing! I always know the status of my maintenance requests. Highly recommend BlueShield Services.",
      author: "Sara M.",
    },
    {
      id: 3,
      quote:
        "Their 24/7 support is a lifesaver. We had a water tank issue late at night, and their team arrived within an hour. Excellent service!",
      author: "Khalid R.",
    },
    {
      id: 4,
      quote:
        "BlueShield Services is the best in the business. Their alternative water solutions kept our business running during maintenance. Highly professional!",
      author: "Mohammed A.",
    },
  ];

  // انيميشن للبطاقات
  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: { y: 0, opacity: 1, transition: { type: "spring", duration: 1 } },
  };

  return (
    <div
      className={`py-16 ${
        isDarkMode ? "bg-gray-800" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-6">
        <h2
          className={`text-3xl font-bold text-center mb-8 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          What Our Customers Say
        </h2>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <motion.div
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.5 }}
                variants={cardVariants}
              >
                <div
                  className={`p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 text-center h-full ${
                    isDarkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <div className="flex justify-center mb-4">
                    <FaQuoteLeft
                      className={`text-3xl ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <p
                    className={`italic mb-4 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {testimonial.quote}
                  </p>
                  <div className="flex justify-center mb-4">
                    <FaQuoteRight
                      className={`text-3xl ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <p
                    className={`font-bold ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    - {testimonial.author}
                  </p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TestimonialsSlider;
