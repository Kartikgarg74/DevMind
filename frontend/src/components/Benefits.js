import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";

const Benefits = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const benefits = [
    {
      title: "Reduce Cognitive Load",
      description: "Let DevMind handle context tracking while you focus on creative problem-solving and architecture decisions.",
      metric: "70% faster"
    },
    {
      title: "Ship with Confidence",
      description: "Advanced code analysis and risk detection help you identify issues before they reach production.",
      metric: "90% fewer bugs"
    },
    {
      title: "Accelerate Onboarding",
      description: "New team members understand codebases faster with AI-powered explanations and context mapping.",
      metric: "50% faster ramp-up"
    },
    {
      title: "Enhance Code Quality",
      description: "Consistent coding standards and best practices are automatically suggested and enforced.",
      metric: "85% improvement"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="benefits" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              <span className="text-white">Why Developers</span>{" "}
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Love DevMind
              </span>
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-300 mb-12 leading-relaxed"
            >
              DevMind doesn't just complete your code—it understands your development 
              journey and becomes a true thinking partner that scales with your projects.
            </motion.p>

            <motion.div 
              variants={containerVariants}
              className="space-y-8"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors">
                        {benefit.title}
                      </h3>
                      <span className="text-sm font-bold text-green-400 bg-green-400/20 px-3 py-1 rounded-full">
                        {benefit.metric}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-12 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2 transition-all duration-300"
            >
              <span>Experience the Difference</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Right Side - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5"
                alt="AI Development Innovation"
                className="w-full h-96 object-cover"
              />
              
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-600/30 to-blue-600/30"></div>
              
              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute top-6 right-6 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
              >
                <div className="text-2xl font-bold text-white">2.5M+</div>
                <div className="text-sm text-gray-300">Code Reviews</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
              >
                <div className="text-2xl font-bold text-green-400">99.9%</div>
                <div className="text-sm text-gray-300">Developer Satisfaction</div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;