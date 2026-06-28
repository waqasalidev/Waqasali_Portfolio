import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { Scene3D } from "./Scene3D";
import { ProfileImage } from "./ProfileImage";
import { CinematicText, InteractiveText, FloatingText } from "@/animations/TextAnimations";

const ROLES = [
  "MERN Stack Developer",
  "React.js Engineer",
  "Full Stack Builder",
  "UI / UX Enthusiast",
  "Web Developer "
];

function useTypewriter(words, speed = 80, pause = 1400) {
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    if (!deleting && sub === word.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && sub === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }
    const t = setTimeout(() => setSub((s) => s + (deleting ? -1 : 1)), deleting ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [sub, deleting, index, words, speed, pause]);

  return words[index].slice(0, sub);
}

const TECHS = ["React", "Node", "Express", "MongoDB", "Tailwind", "JavaScript"];

export function Hero() {
  const typed = useTypewriter(ROLES);
  const ref = useRef(null);

  // Scroll Parallax setups
  const { scrollY } = useScroll();
  const yTextVal = useTransform(scrollY, [0, 600], [0, 180]);
  const opacityVal = useTransform(scrollY, [0, 450], [1, 0]);
  
  const yText = useSpring(yTextVal, { stiffness: 120, damping: 20 });
  const opacityText = useSpring(opacityVal, { stiffness: 120, damping: 20 });

  const handleScrollToContact = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("highlight-contact"));
      }, 600);
    }
  };

  return (
    <section ref={ref} id="home" className="relative min-h-screen w-full overflow-hidden flex items-center">
      {/* 3D background */}
      <div className="absolute inset-0 -z-10">
        <Scene3D showStars intense />
      </div>
      <div className="absolute inset-0 -z-10 grid-bg opacity-60" />
      
      {/* Cinematic radial neon overlay */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none opacity-45"
        style={{
          background: "radial-gradient(circle at 40% 40%, oklch(0.78 0.18 200 / 0.15) 0%, transparent 60%), radial-gradient(circle at 60% 60%, oklch(0.7 0.25 320 / 0.15) 0%, transparent 60%)"
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-background/10 to-background pointer-events-none" />

      <div className="relative mx-auto max-w-6xl w-full px-6 pt-32 pb-24 md:pt-40 md:pb-28 grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
        
        {/* Parallax animated content column */}
        <motion.div style={{ y: yText, opacity: opacityText }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-mono text-muted-foreground shadow-neon"
            style={{ boxShadow: "0 0 15px oklch(0.78 0.18 200 / 0.15)" }}
          >
            <Sparkles size={14} className="text-[var(--neon)] animate-pulse" />
            Available for freelance & full-time roles
          </motion.div>

          <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight filter drop-shadow-[0_0_15px_oklch(0.78_0.18_200_/_0.1)]">
            <CinematicText text="Hi, I'm" className="inline mr-3" />
            <InteractiveText text="Waqas Ali" />
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-2xl md:text-4xl font-mono text-muted-foreground"
          >
            <span className="cursor-blink text-foreground">{typed}</span>
          </motion.div>

          <FloatingText duration={6} yOffset={8}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              I design and build cinematic, high-performance full-stack web experiences using the
              MERN stack. Clean code, immersive interfaces, real-world impact.
            </motion.p>
          </FloatingText>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] px-6 py-3.5 font-medium text-primary-foreground shadow-neon hover:scale-[1.03] transition-transform"
            >
              View Projects
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              onClick={handleScrollToContact}
              className="inline-flex items-center gap-2 rounded-xl glass neon-border px-6 py-3.5 font-medium hover:bg-white/5 transition-colors"
            >
              Hire Me
            </a>
            <a
              href="/assets/resume/Waqas_Ali_CV.pdf"
              download="Waqas Ali CV.pdf"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download size={18} /> Resume
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground"
          >
            <span className="opacity-70">// stack</span>
            {TECHS.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.08 }}
                className="px-3 py-1.5 rounded-full glass hover:border-[var(--neon)] transition-colors"
              >
                {t}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Right column - profile image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <ProfileImage />
        </motion.div>
      </div>
    </section>
  );
}
