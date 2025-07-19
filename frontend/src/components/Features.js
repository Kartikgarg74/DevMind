import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code, Brain, GitBranch, Shield, Zap, Users } from "lucide-react";

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const features = [
    {
      icon: Brain,
      title: "Context-Aware Intelligence",
      description: "Understands your entire codebase architecture and development patterns for intelligent suggestions.",
      image: "https://images.unsplash.com/photo-1655393001768-d946c97d6fd1"
    },
    {
      icon: Code,
      title: "Semantic Code Analysis",
      description: "Goes beyond syntax to understand the semantic meaning and intent behind your code.",
      image: "https://images.unsplash.com/photo-1576272531110-2a342fe22342"
    },
    {
      icon: GitBranch,
      title: "Development History Tracking",
      description: "Tracks your development journey and provides insights based on your coding patterns.",
      image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3"
    },
    {
      icon: Shield,
      title: "Code Risk Analysis",
      description: "Identifies potential issues and security vulnerabilities before they become problems.",
      image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2"
    },
    {
      icon: Zap,
      title: "Smart Pull Requests",
      description: "Generates intelligent PR descriptions and provides context-aware code reviews.",
      image: "https://images.unsplash.com/photo-1716703742196-9986679eb03f"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Facilitates better team communication with shared context and development insights.",
      image: "https://images.unsplash.com/photo-1716703742196-9986679eb03f"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="features" className="py-24 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="text-white">Beyond Code</span>{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Completion
            </span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            DevMind brings true AI intelligence to your development workflow with features 
            designed to understand, assist, and enhance your coding experience.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
            >
              {/* Background Image */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <img 
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6"
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>

                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;