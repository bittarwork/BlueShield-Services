import React from "react";
import { useTheme } from "../../contexts/ThemeContext"; // استيراد useTheme من ملف الثيم
import { FaPenAlt, FaChartLine, FaCheckDouble } from "react-icons/fa"; // أيقونات من react-icons
import { motion } from "framer-motion"; // مكتبة framer-motion للانيميشن

const HowItWorks = () => {
  const { isDarkMode } = useTheme(); // استخدام الثيم لتحديد الوضع الحالي

  // انيميشن للخطوات
  const stepVariants = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: { opacity: 1, y: 0, transition: { type: "spring", duration: 1 } },
  };

  return (
    <div
      className={`py-16 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-6">
        <h2
          className={`text-4xl font-bold text-center mb-16 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          How It Works
        </h2>
        <div className="flex flex-col items-center space-y-16">
          {/* Step 1: Submit a Request */}
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            variants={stepVariants}
            className="flex items-center w-full max-w-2xl"
          >
            <div
              className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center ${
                isDarkMode
                  ? "bg-gradient-to-br from-blue-800 to-blue-600"
                  : "bg-gradient-to-br from-blue-600 to-blue-400"
              } shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <FaPenAlt className="text-3xl text-white" />
            </div>
            <div
              className={`ml-8 p-8 rounded-lg shadow-lg ${
                isDarkMode ? "bg-gray-800" : "bg-gray-50"
              } hover:shadow-xl transition-shadow duration-300`}
            >
              <h3
                className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Submit a Request
              </h3>
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Quickly submit a maintenance request through our platform.
              </p>
            </div>
          </motion.div>

          {/* الخط الفاصل بين الخطوات */}
          <div
            className={`w-1 h-24 ${
              isDarkMode
                ? "bg-gradient-to-b from-gray-700 to-gray-800"
                : "bg-gradient-to-b from-gray-300 to-gray-50"
            }`}
          ></div>

          {/* Step 2: Track Progress */}
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            variants={stepVariants}
            className="flex items-center w-full max-w-2xl"
          >
            <div
              className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center ${
                isDarkMode
                  ? "bg-gradient-to-br from-blue-800 to-blue-600"
                  : "bg-gradient-to-br from-blue-600 to-blue-400"
              } shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <FaChartLine className="text-3xl text-white" />
            </div>
            <div
              className={`ml-8 p-8 rounded-lg shadow-lg ${
                isDarkMode ? "bg-gray-800" : "bg-gray-50"
              } hover:shadow-xl transition-shadow duration-300`}
            >
              <h3
                className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Track Progress
              </h3>
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Monitor the status of your request in real-time.
              </p>
            </div>
          </motion.div>

          {/* الخط الفاصل بين الخطوات */}
          <div
            className={`w-1 h-24 ${
              isDarkMode
                ? "bg-gradient-to-b from-gray-700 to-gray-800"
                : "bg-gradient-to-b from-gray-300 to-gray-50"
            }`}
          ></div>

          {/* Step 3: Get Resolved */}
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            variants={stepVariants}
            className="flex items-center w-full max-w-2xl"
          >
            <div
              className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center ${
                isDarkMode
                  ? "bg-gradient-to-br from-blue-800 to-blue-600"
                  : "bg-gradient-to-br from-blue-600 to-blue-400"
              } shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <FaCheckDouble className="text-3xl text-white" />
            </div>
            <div
              className={`ml-8 p-8 rounded-lg shadow-lg ${
                isDarkMode ? "bg-gray-800" : "bg-gray-50"
              } hover:shadow-xl transition-shadow duration-300`}
            >
              <h3
                className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Get Resolved
              </h3>
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Receive updates and solutions from our expert team.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
