import { motion } from "framer-motion";
import { Section } from "./Section";

const items = [
  { year: "Pakistan | 2022", title: "Web Development Intern — Corvit College", desc: "Completed a web development internship focused on frontend development, responsive websites, and modern web technologies. Worked on HTML, CSS, JavaScript, and basic React.js projects." },
  { year: "Remote Internship | 2023", title: "Web Development Intern — Hex Software India", desc: "Worked on real-world web development tasks and gained experience in frontend design, UI/UX concepts, and dynamic web applications using modern JavaScript technologies." },
  { year: "Remote | 2024", title: "Freelance Web Developer — Fiverr", desc: "Started freelancing on Fiverr as a web developer, providing services related to frontend development, responsive website design, portfolio websites, dashboards, and UI/UX projects." },
  { year: "Remote | 2025 – Present", title: "Freelance MERN Stack Developer — Sikaty Platform", desc: "Currently working as a freelance MERN Stack developer, building full-stack web applications, animated portfolio websites, dashboards, and modern responsive user interfaces for clients." },
];

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="experience"
      title={<>The <span className="text-gradient">journey</span> so far</>}
    >
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--neon)]/40 to-transparent" />
        <div className="space-y-10">
          {items.map((it, i) => (
            <motion.div
              key={it.year}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative flex md:items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="md:w-1/2 pl-12 md:pl-0 md:px-8">
                <div className="glass rounded-2xl p-6 hover:shadow-neon transition-shadow">
                  <div className="font-mono text-xs text-[var(--neon)]">{it.year}</div>
                  <h3 className="mt-1 text-lg font-semibold">{it.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 size-3 rounded-full bg-gradient-to-br from-[var(--neon)] to-[var(--neon-2)] shadow-neon" />
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
