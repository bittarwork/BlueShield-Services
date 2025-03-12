import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import TestimonialsSlider from "../components/Spec/TestimonialsSlider";
import FeaturesSection from "../components/Spec/FeaturesSection";
import HowItWorks from "../components/Spec/HowItWorks";
import HeroSection from "../components/Spec/HeroSection";
import CallToActionSection from "../components/Spec/CallToActionSection";
import { useTheme } from "../contexts/ThemeContext";

const LandingPage = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark" : ""
      } transition-colors duration-300`}
    >
      <NavBar />
      <main>
        {/* Hero Section */}
        <HeroSection></HeroSection>

        {/* Features Section */}
        <FeaturesSection></FeaturesSection>
        {/* How it works section */}
        <HowItWorks></HowItWorks>
        {/* Testimonials Slider Section */}
        <TestimonialsSlider />
        {/* Call to Action Section */}
        <CallToActionSection></CallToActionSection>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
