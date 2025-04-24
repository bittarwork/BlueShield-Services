import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import NotMemberLayout from '../layout/NotMemberLayout';

const AboutUs = () => {
  const { isDarkMode } = useTheme();

  return (
    <NotMemberLayout>
      <div
        className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}
      >
        {/* Hero Section */}
        <div
          className={`relative h-96 flex items-center justify-center bg-gradient-to-r ${isDarkMode ? 'from-blue-900 to-purple-900' : 'from-blue-500 to-purple-500'}`}
        >
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl">
              Innovating Water Solutions for a Sustainable Future
            </p>
          </div>
          <div className="absolute bottom-0 w-full h-20 bg-white dark:bg-gray-900 transform skew-y-2"></div>
        </div>

        {/* Mission Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p
              className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              At BlueShield Services, we are dedicated to revolutionizing water
              management through cutting-edge technology and sustainable
              practices. Our mission is to ensure every community has access to
              reliable and efficient water solutions.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Reliability',
                description: 'We deliver dependable services you can trust.',
                icon: '🔒',
              },
              {
                title: 'Innovation',
                description: 'We embrace technology to drive efficiency.',
                icon: '🚀',
              },
              {
                title: 'Sustainability',
                description: 'We prioritize eco-friendly solutions.',
                icon: '🌱',
              },
              {
                title: 'Community',
                description: 'We serve with empathy and care.',
                icon: '❤️',
              },
            ].map((value, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p
                  className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Contributors Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Project Contributors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: 'Mohammed Essam Al-Mazloom',
                birthDate: 'July 14, 1998',
                birthPlace: 'Riyadh',
                image: 'https://via.placeholder.com/150', // ضع هنا رابط الصورة الشخصية
                description:
                  'I am Mohammed from Riyadh, a student at the Arab Open University. I work for a water pump distribution company. I’m passionate about digital technology and innovation. My love for progress and modern solutions inspired me to join this field, and today I proudly present my graduation project, crafted with creativity and dedication.',
              },
              {
                name: 'Thabit Abdullah Al-Jundi',
                birthDate: 'January 1, 1998',
                universityId: '9101711723',
                image: 'https://via.placeholder.com/150', // ضع هنا رابط الصورة الشخصية
                description:
                  'My name is Thabit Al-Jundi, studying Information Technology and Computing at the Arab Open University. I currently work at TRIO, a company specialized in water pumps and maintenance centers. My goal is to enhance my skills and contribute to improving the quality of services delivered to customers.',
              },
            ].map((student, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 flex flex-col items-center text-center ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <img
                  src={student.image}
                  alt={student.name}
                  className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-gray-300 dark:border-gray-700"
                />
                <h3 className="text-xl font-semibold mb-2">{student.name}</h3>
                <p
                  className={`mb-1 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <span className="font-medium">Date of Birth:</span>{' '}
                  {student.birthDate}
                </p>
                {student.birthPlace && (
                  <p
                    className={`mb-1 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    <span className="font-medium">Place of Birth:</span>{' '}
                    {student.birthPlace}
                  </p>
                )}
                {student.universityId && (
                  <p
                    className={`mb-1 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    <span className="font-medium">University ID:</span>{' '}
                    {student.universityId}
                  </p>
                )}
                <p
                  className={`mt-4 text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {student.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Join Us in Building a Better Future
            </h2>
            <p
              className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Together, we can create a world where clean and reliable water is
              accessible to all.
            </p>
            <button
              className={`px-8 py-3 rounded-full font-semibold text-lg ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
              }`}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </NotMemberLayout>
  );
};

export default AboutUs;
