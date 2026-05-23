import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// 1. Cinematic stagger reveal of words
export function CinematicText({ text, className = "" }) {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 45,
    },
  };

  return (
    <motion.div
      style={{ transformStyle: "preserve-3d" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={`flex flex-wrap ${className}`}
    >
      {words.map((word, idx) => (
        <motion.span
          variants={child}
          key={idx}
          className="mr-[0.25em] inline-block origin-bottom"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// 2. Scroll-based parallax text component
export function ParallaxText({ children, speed = 40, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yVal = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const y = useSpring(yVal, { stiffness: 100, damping: 20 });

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// 3. Floating animation for text elements
export function FloatingText({ children, duration = 5, yOffset = 10, className = "" }) {
  return (
    <motion.div
      animate={{
        y: [0, -yOffset, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 4. Mouse interaction: hover distortion/warp on character level
export function InteractiveText({ text, className = "" }) {
  return (
    <span className={`inline-block ${className}`}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          className="inline-block cursor-default"
          whileHover={{
            scale: 1.3,
            color: "var(--neon)",
            filter: "drop-shadow(0 0 8px var(--neon))",
            y: -5,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 8 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
