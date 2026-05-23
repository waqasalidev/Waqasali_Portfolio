import { motion } from "framer-motion";
import { Section } from "./Section";

const groups = [
  {
    title: "Frontend",
    items: [
      { name: "React.js", level: 95 },
      { name: "JavaScript", level: 92 },
      { name: "Tailwind CSS", level: 94 },
      { name: "HTML5 / CSS3", level: 96 },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Node.js", level: 90 },
      { name: "Express.js", level: 88 },
      { name: "REST APIs", level: 92 },
    ],
  },
  {
    title: "Database",
    items: [
      { name: "MongoDB", level: 88 },
      { name: "Firebase", level: 80 },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Git / GitHub", level: 90 },
      { name: "VS Code", level: 95 },
      { name: "Postman", level: 88 },
    ],
  },
];

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="skills"
      title={<>Tools I use to <span className="text-gradient">ship</span></>}
      description="A focused toolkit, used deeply. I'd rather master a few technologies than dabble in many."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {groups.map((g, gi) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: gi * 0.08 }}
            whileHover={{ y: -6 }}
            className="glass rounded-2xl p-6 hover:shadow-neon transition-shadow"
          >
            <div className="font-mono text-xs text-[var(--neon)] uppercase tracking-widest">
              {g.title}
            </div>
            <div className="mt-4 space-y-4">
              {g.items.map((s, i) => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm">
                    <span>{s.name}</span>
                    <span className="text-muted-foreground font-mono">{s.level}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.15 + i * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
