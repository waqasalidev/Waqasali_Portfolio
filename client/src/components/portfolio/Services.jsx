import { motion } from "framer-motion";
import { Code2, Database, Layout, LayoutDashboard, Server, Smartphone } from "lucide-react";
import { Section } from "./Section";

const services = [
  { icon: Code2, title: "MERN Stack Development", desc: "End-to-end web apps using MongoDB, Express, React and Node." },
  { icon: Layout, title: "Frontend Development", desc: "Pixel-perfect, responsive React UIs that feel cinematic." },
  { icon: Server, title: "Backend & APIs", desc: "Secure, scalable REST APIs and server architectures." },
  { icon: Smartphone, title: "Responsive Design", desc: "Fluid layouts that look stunning on every device." },
  { icon: Database, title: "Database Design", desc: "Clean MongoDB schemas, indexes, and aggregations." },
  { icon: LayoutDashboard, title: "Dashboards & UI/UX", desc: "Data-rich dashboards with clarity and craft." },
];

export function Services() {
  return (
    <Section
      id="services"
      eyebrow="services"
      title={<>What I <span className="text-gradient">do</span></>}
      description="From idea to production — design, build, deploy."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            className="group glass rounded-2xl p-6 hover:shadow-neon transition-all relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br from-[var(--neon)]/20 to-[var(--neon-2)]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="size-12 rounded-xl glass grid place-items-center text-[var(--neon)] group-hover:text-[var(--neon-2)] transition-colors">
              <s.icon size={22} />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
