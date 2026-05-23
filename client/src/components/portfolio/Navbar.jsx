import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        if (href === "#contact") {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("highlight-contact"));
          }, 600);
        }
      }
    }
  };

  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] bg-gradient-to-r from-[var(--neon)] via-[var(--neon-2)] to-[var(--neon-3)]"
      />
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[min(1200px,94%)] rounded-2xl transition-all ${
          scrolled ? "glass-strong shadow-neon" : "glass"
        }`}
      >
        <nav className="flex items-center justify-between px-5 py-3">
          <a href="#home" onClick={(e) => handleLinkClick(e, "#home")} className="flex items-center gap-2 font-mono">
            <span className="size-8 rounded-lg bg-gradient-to-br from-[var(--neon)] to-[var(--neon-2)] grid place-items-center font-bold text-primary-foreground">
              W
            </span>
            <span className="hidden sm:inline text-sm tracking-widest text-muted-foreground">
              waqas<span className="text-gradient font-semibold">.dev</span>
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleLinkClick(e, l.href)}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, "#contact")}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] text-primary-foreground hover:shadow-neon transition-shadow"
          >
            Hire Me
          </a>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-3 pb-3 flex flex-col gap-1"
          >
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleLinkClick(e, l.href)}
                  className="block px-3 py-2 rounded-lg hover:bg-white/5 text-sm"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </motion.header>
    </>
  );
}
