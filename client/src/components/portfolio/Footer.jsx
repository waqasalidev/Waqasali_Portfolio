import { Github, Linkedin, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row gap-6 items-center justify-between">
        <a href="#home" className="flex items-center gap-2 font-mono text-sm">
          <span className="size-8 rounded-lg bg-gradient-to-br from-[var(--neon)] to-[var(--neon-2)] grid place-items-center font-bold text-primary-foreground">W</span>
          <span className="tracking-widest text-muted-foreground">waqas<span className="text-gradient font-semibold">.dev</span></span>
        </a>
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
          <a href="#projects" className="hover:text-foreground transition-colors">Projects</a>
          <a href="#services" className="hover:text-foreground transition-colors">Services</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
        </nav>
        <div className="flex gap-2">
          {[Github, Linkedin,].map((Icon, i) => (
            <a key={i} href="#" className="size-9 grid place-items-center rounded-lg glass hover:text-[var(--neon)] transition-colors">
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground pb-6">
        © {new Date().getFullYear()} Waqas Ali. All Right Reserved
      </div>
      <a 
        href="/admin-dashboard" 
        className="absolute bottom-6 right-6 opacity-20 hover:opacity-100 hover:scale-110 text-muted-foreground hover:text-[var(--neon)] transition-all duration-300 cursor-pointer"
        title="Terminal System Access"
      >
        <Terminal size={14} className="animate-pulse" />
      </a>
    </footer>
  );
}
