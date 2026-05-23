import { motion } from "framer-motion";
import { Scene3D } from "./Scene3D";

export function Immersive3D() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative h-[520px] rounded-3xl overflow-hidden glass-strong neon-border"
        >
          <Scene3D interactive intense />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
            <div className="font-mono text-xs text-[var(--neon)]">// experiment</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold">
              An <span className="text-gradient">immersive</span> playground
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Move your cursor — the scene reacts. Built with React Three Fiber, Drei and a sprinkle of math.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
