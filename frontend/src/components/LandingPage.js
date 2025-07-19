import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Code, 
  Brain, 
  GitBranch, 
  Shield, 
  Zap, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Github,
  Twitter,
  Linkedin,
  Mail,
  ChevronDown
} from "lucide-react";
import Hero from "./Hero";
import Features from "./Features";
import Benefits from "./Benefits";
import Testimonials from "./Testimonials";
import CTA from "./CTA";
import FAQ from "./FAQ";
import Footer from "./Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Brain className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">DevMind</span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">Features</a>
              <a href="#benefits" className="text-gray-300 hover:text-blue-400 transition-colors">Benefits</a>
              <a href="#testimonials" className="text-gray-300 hover:text-blue-400 transition-colors">Reviews</a>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Try Demo
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Page Sections */}
      <Hero />
      <Features />
      <Benefits />
      <Testimonials />
      <CTA />
      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage;