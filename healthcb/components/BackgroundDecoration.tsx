"use client";

import { motion } from "framer-motion";

const BackgroundDecoration = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Side Gradients */}
      <motion.div
        className="absolute left-0 top-0 h-full w-[25%] opacity-10"
        style={{
          background: 'linear-gradient(to right, #79CEED, transparent)',
        }}
        animate={{
          opacity: [0.10, 0.15, 0.10],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute right-0 top-0 h-full w-[25%] opacity-10"
        style={{
          background: 'linear-gradient(to left, #06AFEC, transparent)',
        }}
        animate={{
          opacity: [0.10, 0.15, 0.10],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Wave Lines - Left Side */}
      <svg
        className="absolute left-0 top-0 h-full w-[400px] opacity-20"
        viewBox="0 0 400 800"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M-100,0 C150,100 150,300 -100,400 C150,500 150,700 -100,800"
          fill="none"
          stroke="#79CEED"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.path
          d="M-50,0 C200,100 200,300 -50,400 C200,500 200,700 -50,800"
          fill="none"
          stroke="#06AFEC"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5
          }}
        />
      </svg>

      {/* Wave Lines - Right Side */}
      <svg
        className="absolute right-0 top-0 h-full w-[400px] opacity-20"
        viewBox="0 0 400 800"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M500,0 C250,100 250,300 500,400 C250,500 250,700 500,800"
          fill="none"
          stroke="#79CEED"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.path
          d="M450,0 C200,100 200,300 450,400 C200,500 200,700 450,800"
          fill="none"
          stroke="#06AFEC"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5
          }}
        />
      </svg>

      {/* Decorative Circles */}
      <div className="absolute left-10 top-20">
        <motion.div
          className="w-32 h-32 rounded-full border border-[#79CEED] opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.10, 0.15, 0.10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="absolute right-10 bottom-20">
        <motion.div
          className="w-40 h-40 rounded-full border border-[#06AFEC] opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.10, 0.15, 0.10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Subtle Dots Pattern */}
      <div className="absolute inset-0 opacity-[0.05]" 
        style={{
          backgroundImage: `radial-gradient(#06AFEC 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export default BackgroundDecoration;
