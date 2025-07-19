import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const faqs = [
    {
      question: "How does DevMind differ from other AI coding assistants?",
      answer: "DevMind goes beyond simple code completion by understanding your entire codebase context, tracking development history, and providing semantic analysis. It acts as a true thinking partner that learns your coding patterns and project architecture."
    },
    {
      question: "Is DevMind suitable for team environments?",
      answer: "Absolutely! DevMind excels in team environments by providing shared context, intelligent PR reviews, and facilitating better code collaboration. It helps standardize coding practices across your team and accelerates onboarding of new developers."
    },
    {
      question: "What programming languages does DevMind support?",
      answer: "DevMind supports all major programming languages including JavaScript, TypeScript, Python, Java, C++, Go, Rust, and many more. It understands language-specific patterns and best practices for each supported language."
    },
    {
      question: "How secure is my code with DevMind?",
      answer: "Your code security is our top priority. DevMind processes code locally when possible, uses encrypted connections, and never stores your proprietary code on our servers. We're SOC 2 compliant and follow enterprise-grade security standards."
    },
    {
      question: "Can I try DevMind before purchasing?",
      answer: "Yes! We offer a free 14-day trial with full access to all features. No credit card required to start, and you can cancel anytime during the trial period."
    },
    {
      question: "How does the pricing work for teams?",
      answer: "We offer flexible pricing plans for individuals, teams, and enterprises. Team plans include additional collaboration features, shared context, and administrative controls. Contact us for custom enterprise pricing."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="text-white">Frequently Asked</span>{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Everything you need to know about DevMind and how it can transform your development workflow
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-750 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
              >
                <span className="text-lg font-semibold text-white pr-8">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {openIndex === index ? (
                    <Minus className="w-6 h-6 text-blue-400" />
                  ) : (
                    <Plus className="w-6 h-6 text-blue-400" />
                  )}
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-300 mb-6">
            Still have questions? We're here to help!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;