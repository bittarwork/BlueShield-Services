import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";

const HeroSection = () => {
  const { isDarkMode } = useTheme();

  const textVariants = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: { opacity: 1, y: 0, transition: { type: "spring", duration: 1 } },
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/023/812/650/non_2x/abstract-blue-wave-background-in-flat-design-style-abstract-water-wave-design-vector.jpg')",
      }}
    >
      {/* Overlay مع تدرج لوني */}
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-gradient-to-b from-black/70 to-black/50"
            : "bg-gradient-to-b from-black/50 to-black/30"
        }`}
      ></div>

      {/* المحتوى */}
      <div className="relative container mx-auto px-6 flex flex-col md:flex-row items-center">
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.5 }}
          variants={textVariants}
          className="text-white text-center md:text-left md:w-1/2"
        >
          {/* العنوان الرئيسي */}
          <h1 className="text-6xl font-bold mb-6">
            BlueShield <span className="text-blue-500">Services</span>
          </h1>

          {/* الوصف */}
          <p className="text-xl mb-8">
            Your trusted partner in water management and emergency maintenance.
            We provide fast, reliable solutions to ensure uninterrupted water
            supply for homes, businesses, and communities.
          </p>

          {/* الأزرار */}
          <div className="flex gap-6 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 ${
                isDarkMode
                  ? "bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              } text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              Request Emergency Maintenance
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
