import React from "react";
import { useTheme } from "../../contexts/ThemeContext"; // استيراد useTheme من ملف الثيم
import { FaTools, FaTint, FaClock } from "react-icons/fa"; // أيقونات من react-icons
import { motion } from "framer-motion"; // مكتبة framer-motion للانيميشن

const FeaturesSection = () => {
  const { isDarkMode } = useTheme(); // استخدام الثيم لتحديد الوضع الحالي

  // انيميشن للبطاقات
  const cardVariants = {
    offscreen: { opacity: 0, scale: 0.8 },
    onscreen: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", duration: 1 },
    },
  };

  return (
    <section
      className={`py-16 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <h2
          className={`text-4xl font-bold text-center mb-12 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Why Choose BlueShield Services?
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Card 1 */}
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            variants={cardVariants}
            className="w-full md:w-1/3"
          >
            <div
              className={`p-8 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-center mb-6">
                <div
                  className={`p-6 rounded-full ${
                    isDarkMode
                      ? "bg-gradient-to-br from-blue-800 to-blue-600"
                      : "bg-gradient-to-br from-blue-600 to-blue-400"
                  }`}
                >
                  <FaTools className="text-4xl text-white" />
                </div>
              </div>
              <h3
                className={`text-2xl font-bold mb-4 text-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                24/7 Emergency Maintenance
              </h3>
              <p
                className={`text-lg text-center ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Our specialized maintenance team is available around the clock
                to handle any water pump or tank failures.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            variants={cardVariants}
            className="w-full md:w-1/3"
          >
            <div
              className={`p-8 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-center mb-6">
                <div
                  className={`p-6 rounded-full ${
                    isDarkMode
                      ? "bg-gradient-to-br from-blue-800 to-blue-600"
                      : "bg-gradient-to-br from-blue-600 to-blue-400"
                  }`}
                >
                  <FaTint className="text-4xl text-white" />
                </div>
              </div>
              <h3
                className={`text-2xl font-bold mb-4 text-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Alternative Water Solutions
              </h3>
              <p
                className={`text-lg text-center ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                We provide temporary water supply options during maintenance
                periods to ensure no disruption in service.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            variants={cardVariants}
            className="w-full md:w-1/3"
          >
            <div
              className={`p-8 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-center mb-6">
                <div
                  className={`p-6 rounded-full ${
                    isDarkMode
                      ? "bg-gradient-to-br from-blue-800 to-blue-600"
                      : "bg-gradient-to-br from-blue-600 to-blue-400"
                  }`}
                >
                  <FaClock className="text-4xl text-white" />
                </div>
              </div>
              <h3
                className={`text-2xl font-bold mb-4 text-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Real-Time Request Tracking
              </h3>
              <p
                className={`text-lg text-center ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Track the status of your maintenance requests in real-time and
                receive updates on repair progress.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
