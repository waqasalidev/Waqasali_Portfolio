import { motion } from "framer-motion";
import { Section } from "./Section";

const stats = [
  { label: "Projects Completed", value: "10+" },
  { label: "Technologies Mastered", value: "8+" },
  { label: "Years of Practice", value: "3+" },
  { label: "Happy Clients", value: "10+" },
];

export function About() {
  return (
    <Section
      id="about"
      eyebrow="about me"
      title={<>Crafting <span className="text-gradient">full-stack</span> experiences with care</>}
      description="I'm a MERN Stack developer who treats every project like a product. From data modelling to pixel-perfect UI, I obsess over performance, accessibility, and delight."
    >
      <div className="grid md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:col-span-3 glass rounded-2xl p-8 neon-border"
        >
          <h3 className="text-xl font-semibold">My Journey</h3>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            I started with curiosity for how things work on the web. That curiosity grew into a
            craft. Today I build production-grade applications across the entire stack — React
            frontends, Node/Express APIs, and MongoDB-powered data layers — with a deep focus on
            UI/UX that feels effortless.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            I love shipping work that's polished, fast and accessible. When I'm not coding I'm
            sketching interfaces, exploring 3D web tech, or learning what's next.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="md:col-span-2 grid grid-cols-2 gap-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-5 text-center hover:shadow-neon transition-shadow"
            >
              <div className="text-3xl font-bold text-gradient">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
