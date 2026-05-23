import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <motion.div
      aria-hidden
      animate={{ x: pos.x - 200, y: pos.y - 200 }}
      transition={{ type: "spring", stiffness: 80, damping: 20, mass: 0.4 }}
      className="pointer-events-none fixed top-0 left-0 z-0 size-[400px] rounded-full opacity-40 hidden md:block"
      style={{
        background: "radial-gradient(circle, oklch(0.78 0.18 200 / 0.35), transparent 60%)",
        filter: "blur(20px)",
      }}
    />
  );
}
