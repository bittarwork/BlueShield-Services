import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";

const CallToActionSection = () => {
  const { isDarkMode } = useTheme(); // استخدام الثيم لتحديد الوضع الحالي

  // انيميشن للنص والأزرار
  const textVariants = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: { opacity: 1, y: 0, transition: { type: "spring", duration: 1 } },
  };

  return (
    <section
      className={`py-16 ${
        isDarkMode
          ? "bg-gradient-to-br from-blue-900 to-blue-800"
          : "bg-gradient-to-br from-blue-600 to-blue-500"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.5 }}
          variants={textVariants}
        >
          {/* العنوان الرئيسي */}
          <h2 className="text-4xl font-bold mb-4 text-white">
            Join BlueShield Services Today!
          </h2>

          {/* الوصف */}
          <p className="text-xl mb-8 text-white">
            Experience the most efficient and reliable water management system
            in the region. Sign up now to get started.
          </p>

          {/* حقل إدخال البريد الإلكتروني */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email..."
              className={`w-full md:w-96 px-6 py-3 rounded-lg border-2 text-white ${
                isDarkMode ? "border-blue-700" : "border-blue-500"
              } focus:outline-none focus:ring-2 ${
                isDarkMode ? "focus:ring-blue-500" : "focus:ring-blue-400"
              } transition-all duration-300`}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 bg-white ${
                isDarkMode ? "text-blue-900" : "text-blue-600"
              } font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              Sign Up Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
