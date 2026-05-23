import { useRef, useState, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import profileImg from "@/assets/profile.jpeg";

const TECH = [
  { name: "React", color: "#61DAFB", icon: "⚛", angle: 0 },
  { name: "Node", color: "#68A063", icon: "⬢", angle: 90 },
  { name: "Mongo", color: "#4DB33D", icon: "🍃", angle: 180 },
  { name: "Express", color: "#ffffff", icon: "Ex", angle: 270 },
];

export function ProfileImage() {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 14 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  };

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        d: 4 + Math.random() * 8,
        delay: Math.random() * 4,
        dur: 6 + Math.random() * 6,
      })),
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[420px] aspect-square"
      style={{ perspective: 1200 }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -inset-10 rounded-full blur-3xl opacity-60 animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, oklch(0.78 0.18 200 / 0.6), transparent 60%), radial-gradient(circle at 70% 70%, oklch(0.7 0.25 320 / 0.55), transparent 60%)",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.d,
              height: p.d,
              background: "var(--neon)",
              boxShadow: "0 0 8px var(--neon)",
            }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Tilt card */}
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {/* Animated gradient border ring */}
        <div className="absolute inset-0 rounded-[2rem] p-[2px] overflow-hidden">
          <motion.div
            className="absolute inset-[-50%] rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, var(--neon), var(--neon-2), var(--neon-3), var(--neon))",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-[2px] rounded-[calc(2rem-2px)] bg-background/80 backdrop-blur-xl" />
        </div>

        {/* Glass frame + image */}
        <motion.div
          className="absolute inset-[6px] rounded-[1.85rem] overflow-hidden glass-strong shadow-neon"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(40px)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 20%, oklch(0.78 0.18 200 / 0.25), transparent 60%)",
            }}
          />
          <img
            src={profileImg}
            alt="Waqas Ali — MERN Stack Developer portrait"
            className="h-full w-full object-cover object-center"
            loading="eager"
          />
          {/* Top scanline shimmer */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 h-24 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.78 0.18 200 / 0.35), transparent)",
              mixBlendMode: "screen",
            }}
            animate={{ y: ["-30%", "130%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          {/* Vignette + tint */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, transparent 50%, oklch(0.14 0.03 270 / 0.7)), radial-gradient(circle at 70% 30%, oklch(0.7 0.25 320 / 0.15), transparent 60%)",
            }}
          />
          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 200 / 0.18), oklch(0.7 0.25 320 / 0.18))",
            }}
          />
        </motion.div>

        {/* Floating tech badges orbiting */}
        {TECH.map((t, i) => (
          <FloatingBadge key={t.name} {...t} index={i} />
        ))}
      </motion.div>
    </motion.div>
  );
}

function FloatingBadge({
  name,
  color,
  icon,
  angle,
  index,
}) {
  // Position around the circle
  const rad = (angle * Math.PI) / 180;
  const radius = 52; // % from center
  const x = 50 + Math.cos(rad) * radius;
  const y = 50 + Math.sin(rad) * radius;

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translateZ(80px) translate(-50%, -50%)" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.12, type: "spring", stiffness: 180, damping: 14 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3 + index * 0.3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
        whileHover={{ scale: 1.15 }}
        className="glass-strong neon-border rounded-2xl px-3 py-2 flex items-center gap-2 font-mono text-xs shadow-neon"
        style={{ boxShadow: `0 0 24px ${color}55` }}
      >
        <span
          className="grid place-items-center size-6 rounded-md font-bold"
          style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
        >
          {icon}
        </span>
        <span className="text-foreground/90">{name}</span>
      </motion.div>
    </motion.div>
  );
}
