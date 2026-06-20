import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Send, Twitter, ShieldCheck, Loader2, Instagram } from "lucide-react";
import { Section } from "./Section";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

// Custom Popup Component for Success/Error Notifications
function NotificationPopup({ popup, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [popup, onClose]);

  const isSuccess = popup.type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4.5 rounded-2xl glass-strong border shadow-neon font-display max-w-sm w-full mx-4 ${
        isSuccess
          ? "border-emerald-500/30 text-emerald-300"
          : "border-red-500/30 text-red-300"
      }`}
      style={{
        boxShadow: isSuccess
          ? "0 0 25px rgba(16, 185, 129, 0.25)"
          : "0 0 25px rgba(239, 68, 68, 0.25)",
      }}
    >
      <span className="text-xl shrink-0">{isSuccess ? "✅" : "❌"}</span>
      <div className="flex-grow text-sm font-medium tracking-wide">
        {popup.message}
      </div>
      <button
        onClick={onClose}
        className="text-xs font-mono text-muted-foreground hover:text-foreground shrink-0 ml-2"
      >
        Dismiss
      </button>
    </motion.div>
  );
}

// Particle Canvas for futuristic floating particle field
function ContactParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles = [];
    const count = 45;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(34, 211, 238, 0.4)"; // cyan glow

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      ctx.strokeStyle = "rgba(168, 85, 247, 0.08)"; // magenta connection lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

// Floating Label Input Component
function FloatingInput({ label, name, type = "text", value, onChange, required, placeholder }) {
  const [focused, setFocused] = useState(false);
  const isFilled = value && value.length > 0;

  return (
    <div className="relative w-full group">
      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ""}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4.5 text-sm outline-none transition-all focus:bg-white/10 text-foreground placeholder:text-muted-foreground/40 font-display"
      />
      
      <label
        className={`absolute left-4 pointer-events-none transition-all duration-300 font-mono text-xs ${
          focused || isFilled
            ? "-top-2.5 left-3 px-2 py-0.5 text-[10px] rounded-md bg-[var(--neon)] text-primary-foreground font-semibold shadow-neon"
            : "top-4.5 text-muted-foreground text-sm"
        }`}
      >
        {label}
      </label>

      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] transition-all duration-300 ${
          focused ? "w-full opacity-100 shadow-neon" : "w-0 opacity-0"
        }`}
      />
    </div>
  );
}

function FloatingTextarea({ label, name, value, onChange, required, rows = 4, placeholder }) {
  const [focused, setFocused] = useState(false);
  const isFilled = value && value.length > 0;

  return (
    <div className="relative w-full group">
      <textarea
        required={required}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={rows}
        placeholder={focused ? placeholder : ""}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-sm outline-none transition-all focus:bg-white/10 text-foreground resize-none placeholder:text-muted-foreground/40 font-display"
      />
      
      <label
        className={`absolute left-4 pointer-events-none transition-all duration-300 font-mono text-xs ${
          focused || isFilled
            ? "-top-2.5 left-3 px-2 py-0.5 text-[10px] rounded-md bg-[var(--neon)] text-primary-foreground font-semibold shadow-neon"
            : "top-4 text-muted-foreground text-sm"
        }`}
      >
        {label}
      </label>

      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] transition-all duration-300 ${
          focused ? "w-full opacity-100 shadow-neon" : "w-0 opacity-0"
        }`}
      />
    </div>
  );
}

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null); // { type: 'success' | 'error', message: string }
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const handleHighlight = () => {
      setHighlight(true);
      setTimeout(() => setHighlight(false), 2000);
    };
    window.addEventListener("highlight-contact", handleHighlight);
    return () => window.removeEventListener("highlight-contact", handleHighlight);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setPopup({ type: "error", message: "Please fill out all required fields." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setPopup({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setLoading(true);

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        console.error("[EmailJS] Missing environment variables in client/.env. Please restart your Vite dev server.");
        throw new Error("Email service configuration is missing. Make sure VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY are set in client/.env and restart your dev server.");
      }

      console.log("[DEBUG] EmailJS Config:", { serviceId, templateId, publicKey });

      // Initialize globally (helps resolve "The public key is required" issues)
      emailjs.init({
        publicKey: publicKey,
      });

      const templateParams = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        from_name: formData.name,
        from_email: formData.email,
      };

      // Correct signature for EmailJS SDK v4 (uses options object)
      await emailjs.send(serviceId, templateId, templateParams, {
        publicKey: publicKey,
      });

      // Save to local database
      await axios.post("/api/contact", formData);

      // Trigger beautiful success popup and toast notification
      setPopup({
        type: "success",
        message: "Your message has been submitted successfully!",
      });
      toast.success("Your message has been submitted successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("[EmailJS Submission Error Details]:", {
        status: error?.status,
        text: error?.text,
        message: error?.message,
        rawError: error
      });
      const errorMessage = error?.text || error?.message || "Failed to send message. Please try again.";
      setPopup({
        type: "error",
        message: `❌ ${errorMessage}`,
      });
      toast.error(`Submission failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      id="contact"
      eyebrow="connect now"
      title="Let's Work Together"
      description="Have a project idea, freelance work, or collaboration opportunity? Feel free to send me a message and I’ll get back to you as soon as possible."
    >
      {/* Animated Success / Error Popup notifications */}
      <AnimatePresence>
        {popup && (
          <NotificationPopup popup={popup} onClose={() => setPopup(null)} />
        )}
      </AnimatePresence>

      <div className="relative grid md:grid-cols-5 gap-8 overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-white/5 to-transparent mt-8">
        
        {/* Particle and lighting backing */}
        <ContactParticles />
        <div
          aria-hidden
          className="absolute -top-40 -right-40 size-96 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--neon), transparent 70%)" }}
        />

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:col-span-2 glass-strong rounded-2xl p-8 z-10 flex flex-col justify-between neon-border relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--neon)]/10 to-transparent pointer-events-none" />

          <div>
            <div className="flex items-center gap-3">
              <span className="size-12 rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] grid place-items-center text-primary-foreground shadow-neon animate-bounce">
                <Mail size={20} />
              </span>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Connect </h3>
                <p className="text-xs font-mono text-muted-foreground">// active connection</p>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
              Send a message directly. I am available for MERN stack contracts, full-time positions, and collaborations.
            </p>

            <a
              href="mailto:iwaqasaliii@gmail.com"
              className="mt-8 inline-flex items-center gap-3 text-sm text-foreground hover:text-[var(--neon)] font-mono transition-colors group/link"
            >
              <span className="size-9 grid place-items-center rounded-lg glass border border-white/10 group-hover/link:border-[var(--neon)]/40 transition-colors">
                @
              </span>
              iwaqasaliii@gmail.com
            </a>
          </div>

          <div className="mt-12 border-t border-white/5 pt-6">
            <span className="text-[10px] font-mono text-muted-foreground block mb-3">// Do Follow and Vist Profile :</span>
            <div className="flex gap-3">
              {[
                { Icon: Github, href: "https://github.com/waqasalidev" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/waqas-aliii/" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-11 grid place-items-center rounded-xl glass border border-white/10 hover:border-[var(--neon)]/30 hover:text-[var(--neon)] hover:scale-105 hover:shadow-neon transition-all"
                >
                  <social.Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Input Form Card */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onSubmit={handleSubmit}
          className={`md:col-span-3 glass rounded-2xl p-8 space-y-6 z-10 relative overflow-hidden transition-all duration-700 ${
            highlight ? "ring-2 ring-[var(--neon)] scale-[1.02] shadow-[0_0_50px_oklch(0.78_0.18_200_/_0.3)] bg-white/10" : "border border-white/5"
          }`}
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <FloatingInput
              required
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
            <FloatingInput
              required
              type="email"
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <FloatingInput
            required
            label="Subject"
            name="subject"
            placeholder="Enter subject"
            value={formData.subject}
            onChange={handleChange}
          />

          <FloatingTextarea
            required
            label="Your Message"
            name="message"
            rows={5}
            placeholder="Write your message here..."
            value={formData.message}
            onChange={handleChange}
          />

          <div className="flex items-center justify-between pt-2">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 20px oklch(0.78 0.18 200 / 0.4)" }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] px-6 py-3.5 font-semibold text-primary-foreground shadow-neon disabled:opacity-50 transition-all ml-auto group min-w-[160px] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send size={15} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </Section>
  );
}
