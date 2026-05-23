import { motion } from "framer-motion";




export function Section({ id, eyebrow, title, description, children }) {
  return (
    <section id={id} className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--neon)]">
            <span className="h-px w-8 bg-[var(--neon)]" />
            {eyebrow}
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">{title}</h2>
          {description && <p className="mt-4 text-muted-foreground">{description}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
