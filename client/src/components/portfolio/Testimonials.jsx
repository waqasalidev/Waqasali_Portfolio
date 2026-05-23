import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Section } from "./Section";

const testimonials = [
  {
    quote: "Waqas delivered a polished MERN app on time. Communication, code quality and design — all top tier.",
    name: "Sara K.",
    role: "Product Manager, HealthTech",
  },
  {
    quote: "Our dashboard went from rough idea to award-worthy interface. He genuinely cares about UX.",
    name: "Daniel R.",
    role: "Founder, SaaS Startup",
  },
  {
    quote: "Clean APIs, scalable Mongo schemas and a frontend that just feels right. Highly recommended.",
    name: "Ayesha M.",
    role: "Engineering Lead",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <Section
      id="testimonials"
      eyebrow="testimonials"
      title={<>Kind <span className="text-gradient">words</span></>}
    >
      <div className="relative max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="glass-strong neon-border rounded-2xl p-8 md:p-10 text-center"
          >
            <Quote className="mx-auto text-[var(--neon)]" />
            <p className="mt-5 text-lg md:text-xl leading-relaxed text-foreground/90">
              "{testimonials[i].quote}"
            </p>
            <div className="mt-6 font-semibold">{testimonials[i].name}</div>
            <div className="text-sm text-muted-foreground">{testimonials[i].role}</div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Show testimonial ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)]" : "w-2 bg-white/20"}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
