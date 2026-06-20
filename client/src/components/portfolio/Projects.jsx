import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Section } from "./Section";
import axios from "axios";
import { toast } from "sonner";

const staticProjects = [
  {
    _id: "static-1",
    title: "CKD Knowledge-Based System",
    description: "A knowledge-based clinical decision support tool built with React + Node, applying medical inference rules over patient labs to suggest CKD stages with explanations.",
    images: ["/uploads/static-ckd-1.png"],
    technologies: ["React", "Node", "Expert System"],
    category: "AI",
    githubLink: "https://github.com",
    liveDemoLink: "https://example.com",
    gradient: "from-cyan-500/30 to-blue-600/30",
  },
  {
    _id: "static-2",
    title: "AI Medical Dashboard",
    description: "Interactive dashboard surfacing patient cohorts, vitals and risk scores. Built with React, Recharts and an Express API backed by MongoDB.",
    images: ["/uploads/static-dash-1.png"],
    technologies: ["React", "MongoDB", "Recharts"],
    category: "Dashboard",
    githubLink: "https://github.com",
    liveDemoLink: "https://example.com",
    gradient: "from-fuchsia-500/30 to-pink-600/30",
  },
  {
    _id: "static-3",
    title: "E-Commerce MERN App",
    description: "Production-ready MERN e-commerce: JWT auth, Mongo product catalog, Stripe checkout, order workflows, and an admin dashboard for inventory.",
    images: ["/uploads/static-shop-1.png"],
    technologies: ["MongoDB", "Express", "React", "Node"],
    category: "Web",
    githubLink: "https://github.com",
    liveDemoLink: "https://example.com",
    gradient: "from-emerald-500/30 to-teal-600/30",
  },
  {
    _id: "static-4",
    title: "Portfolio Website",
    description: "An award-style portfolio (this one!) featuring 3D scenes, scroll-driven animations, glassmorphism UI and a thoughtful design system.",
    images: [],
    technologies: ["React", "R3F", "Framer Motion"],
    category: "Web",
    githubLink: "https://github.com",
    liveDemoLink: "https://example.com",
    gradient: "from-indigo-500/30 to-violet-600/30",
  },
];

const filters = ["All", "Web", "AI", "Dashboard"];

export function Projects() {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery slider state inside detail modal
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (active || lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [active, lightboxOpen]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects");
        if (res.data && res.data.length > 0) {
          setProjects(res.data);
        } else {
          setProjects(staticProjects);
        }
      } catch (err) {
        console.error("Error fetching projects, loading static placeholders.", err);
        setProjects(staticProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const list = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  const handleOpenProject = (project) => {
    setActive(project);
    setCurrentImgIndex(0);
  };

  const nextImage = (images) => {
    if (!images || images.length === 0) return;
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (images) => {
    if (!images || images.length === 0) return;
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Section
      id="projects"
      eyebrow="projects"
      title={<>Selected <span className="text-gradient">work</span></>}
      description="A few projects I've designed, engineered and shipped."
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-mono transition-all ${
              filter === f
                ? "bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] text-primary-foreground shadow-neon"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--neon)] border-t-transparent"></div>
        </div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => {
              // Build dynamic or fallback gradient
              const grad = p.gradient || (
                p.category === "AI" ? "from-cyan-500/30 to-blue-600/30" :
                p.category === "Dashboard" ? "from-fuchsia-500/30 to-pink-600/30" :
                "from-emerald-500/30 to-teal-600/30"
              );
              
              const coverImage = p.images && p.images.length > 0 ? p.images[0] : null;

              return (
                <motion.button
                  key={p._id || p.title}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  onClick={() => handleOpenProject(p)}
                  className="text-left glass rounded-2xl overflow-hidden hover:shadow-neon transition-shadow group flex flex-col h-full"
                >
                  <div className={`relative h-48 bg-gradient-to-br ${grad} overflow-hidden w-full`}>
                    <div className="absolute inset-0 grid-bg opacity-50" />
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={p.title}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center">
                        <span className="font-mono text-5xl text-white/20 group-hover:scale-110 transition-transform">
                          {p.title.split(" ").map((w) => w[0]).slice(0, 3).join("")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg">{p.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 flex-grow">{p.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.technologies.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-mono glass">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Project Details Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[80] bg-background/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl glass-strong rounded-2xl overflow-hidden neon-border flex flex-col max-h-[90vh] md:max-h-[85vh]"
            >
              {/* Image Slider Gallery */}
              <div className="relative h-64 sm:h-80 bg-black/60 overflow-hidden flex items-center justify-center group/slider flex-shrink-0">
                {active.images && active.images.length > 0 ? (
                  <>
                    <img
                      src={active.images[currentImgIndex]}
                      alt={`${active.title} - screen ${currentImgIndex + 1}`}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                    />
                    
                    {/* Hover Zoom & Lightbox trigger */}
                    <button 
                      onClick={() => setLightboxOpen(true)}
                      className="absolute bottom-3 right-3 p-2 rounded-lg glass bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover/slider:opacity-100 transition-opacity"
                      title="Open full screen preview"
                    >
                      <Maximize2 size={16} />
                    </button>

                    {active.images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(active.images)}
                          className="absolute left-3 p-2 rounded-full glass bg-black/40 hover:bg-black/60 text-white transition-colors"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => nextImage(active.images)}
                          className="absolute right-3 p-2 rounded-full glass bg-black/40 hover:bg-black/60 text-white transition-colors"
                        >
                          <ChevronRight size={20} />
                        </button>
                        
                        {/* Dots indicator */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {active.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImgIndex(idx)}
                              className={`h-1.5 rounded-full transition-all ${
                                idx === currentImgIndex ? "w-6 bg-[var(--neon)]" : "w-1.5 bg-white/40"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${active.gradient || "from-cyan-500/30 to-blue-600/30"} flex items-center justify-center`}>
                    <span className="font-mono text-6xl text-white/10">
                      {active.title.split(" ").map((w) => w[0]).slice(0, 3).join("")}
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => setActive(null)}
                  className="absolute top-3 right-3 size-9 grid place-items-center rounded-full glass bg-black/30 hover:bg-black/50 text-white"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Project details content */}
              <div className="p-6 overflow-y-auto flex-grow scrollbar-thin">
                <h3 className="text-2xl font-bold">{active.title}</h3>
                <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-mono bg-gradient-to-r from-[var(--neon)]/20 to-[var(--neon-2)]/20 text-[var(--neon)]">
                  {active.category}
                </span>
                <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{active.description}</p>
                
                <div className="mt-5">
                  <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">// technologies used</h4>
                  <div className="flex flex-wrap gap-2">
                    {active.technologies.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full text-xs font-mono glass">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 border-t border-white/5 pt-5">
                  {active.githubLink && (
                    <a
                      href={active.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl glass neon-border px-5 py-2.5 text-sm hover:bg-white/5 transition-colors font-medium"
                    >
                      <Github size={16} /> GitHub Repository
                    </a>
                  )}
                  {active.liveDemoLink && (
                    <a
                      href={active.liveDemoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] text-primary-foreground px-5 py-2.5 text-sm shadow-neon hover:scale-[1.02] transition-transform font-medium"
                    >
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && active && active.images && active.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full glass bg-white/5 hover:bg-white/10 text-white"
              aria-label="Close Fullscreen"
            >
              <X size={24} />
            </button>
            
            <img
              src={active.images[currentImgIndex]}
              alt={`${active.title} - screen ${currentImgIndex + 1} - fullscreen`}
              className="max-h-full max-w-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
