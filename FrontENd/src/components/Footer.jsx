import React from "react";
import { useTheme } from "../contexts/ThemeContext"; // تأكد من المسار الصحيح
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer
      className={`${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معلومات الموقع */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              BlueShield Services
            </h3>
            <p className="text-sm">
              نقدم لكم أفضل الخدمات لحماية أعمالكم وبياناتكم. نحن هنا لمساعدتكم
              على النجاح.
            </p>
          </div>

          {/* روابط سريعة */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/services"
                  className="hover:text-blue-500 transition-colors"
                >
                  الخدمات
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-blue-500 transition-colors"
                >
                  من نحن
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-blue-500 transition-colors"
                >
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>

          {/* التواصل الاجتماعي */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">تابعنا</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors"
              >
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} BlueShield Services. جميع الحقوق
            محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
