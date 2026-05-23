import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Plus, Trash2, Edit3, MessageSquare, Briefcase, 
  Upload, X, ArrowLeft, Globe, Github, Terminal, ChevronLeft, ChevronRight 
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web");
  const [technologies, setTechnologies] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [liveDemoLink, setLiveDemoLink] = useState("");
  const [existingImages, setExistingImages] = useState([]); // Images already stored
  const [selectedFiles, setSelectedFiles] = useState([]); // Local file selections for preview
  const [saving, setSaving] = useState(false);

  // Search, Filter, Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const projRes = await axios.get("/api/projects");
      setProjects(projRes.data);

      const msgRes = await axios.get("/api/contact", axiosConfig);
      setMessages(msgRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Session expired or unauthorized. Logging out.");
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  // Local file picker changes for previews
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const filePreviews = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...filePreviews]);
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveSelectedFile = (indexToRemove) => {
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(selectedFiles[indexToRemove].previewUrl);
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const openAddModal = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setCategory("Web");
    setTechnologies("");
    setGithubLink("");
    setLiveDemoLink("");
    setExistingImages([]);
    setSelectedFiles([]);
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setCategory(project.category);
    setTechnologies(project.technologies.join(", "));
    setGithubLink(project.githubLink || "");
    setLiveDemoLink(project.liveDemoLink || "");
    setExistingImages(project.images || []);
    setSelectedFiles([]);
    setModalOpen(true);
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!title || !description || !technologies) {
      toast.error("Title, Description, and Technologies are required.");
      return;
    }

    setSaving(true);
    const actionToast = toast.loading("Saving project configuration...");

    try {
      let finalImages = [...existingImages];

      // Upload local selected files first if there are any
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((fObj) => {
          formData.append("images", fObj.file);
        });

        const uploadRes = await axios.post("/api/upload", formData, {
          headers: {
            ...axiosConfig.headers,
            "Content-Type": "multipart/form-data",
          },
        });
        finalImages = [...finalImages, ...uploadRes.data.filePaths];
      }

      const projectData = {
        title,
        description,
        category,
        technologies: technologies.split(",").map((tech) => tech.trim()),
        githubLink,
        liveDemoLink,
        images: finalImages,
      };

      if (editingProject) {
        // Update endpoint
        const res = await axios.put(`/api/projects/${editingProject._id}`, projectData, axiosConfig);
        setProjects((prev) =>
          prev.map((p) => (p._id === editingProject._id ? res.data : p))
        );
        toast.success("Project updated successfully!", { id: actionToast });
      } else {
        // Create endpoint
        const res = await axios.post("/api/projects", projectData, axiosConfig);
        setProjects((prev) => [res.data, ...prev]);
        toast.success("Project created successfully!", { id: actionToast });
      }

      // Cleanup local object previews
      selectedFiles.forEach((fObj) => URL.revokeObjectURL(fObj.previewUrl));
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Error saving project configuration.", { id: actionToast });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await axios.delete(`/api/projects/${id}`, axiosConfig);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project removed from database successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`/api/contact/${id}`, axiosConfig);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      toast.success("Message removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
    }
  };

  // Search & filter computations
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination computations
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-display">
      {/* Header */}
      <header className="glass-strong border-b border-white/5 py-4 px-6 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg glass hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
            title="Go to main portfolio site"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="font-mono text-sm tracking-widest flex items-center gap-1.5">
            <Terminal size={16} className="text-[var(--neon)]" />
            console<span className="text-gradient">.dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-xs font-mono text-muted-foreground">// user: admin</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-mono glass border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all cursor-pointer"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Content wrapper */}
      <div className="flex-grow max-w-6xl w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/5">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-5 py-3 flex items-center gap-2 border-b-2 text-sm font-mono transition-all cursor-pointer ${
              activeTab === "projects"
                ? "border-[var(--neon)] text-[var(--neon)] bg-white/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase size={16} /> Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-5 py-3 flex items-center gap-2 border-b-2 text-sm font-mono transition-all cursor-pointer ${
              activeTab === "messages"
                ? "border-[var(--neon)] text-[var(--neon)] bg-white/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare size={16} /> Inbound Messages ({messages.length})
          </button>
        </div>

        {loading ? (
          <div className="flex-grow flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--neon)] border-t-transparent"></div>
          </div>
        ) : (
          <div className="flex-grow">
            {activeTab === "projects" ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Project Catalog</h2>
                    <p className="text-sm text-muted-foreground font-display">Manage dynamic work displayed on your portfolio</p>
                  </div>
                  <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] text-primary-foreground px-4 py-2.5 text-sm font-medium shadow-neon hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    <Plus size={16} /> Add Project
                  </button>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="relative w-full md:max-w-xs">
                    <input
                      type="text"
                      placeholder="Search title or tech stack..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--neon)] focus:ring-1 focus:ring-[var(--neon)]/30 transition-all font-display text-foreground placeholder:text-muted-foreground/40"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 w-full md:w-auto py-1">
                    {["All", "Web", "AI", "Dashboard", "Other"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategoryFilter(cat);
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all duration-300 border cursor-pointer hover:-translate-y-0.5 ${
                          categoryFilter === cat
                            ? "bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] text-primary-foreground font-black shadow-neon border-transparent scale-[1.03]"
                            : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Responsive Project Table */}
                <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
                  <table className="w-full border-collapse text-left text-sm text-muted-foreground font-display">
                    <thead className="bg-white/5 text-xs uppercase text-foreground font-mono tracking-wider">
                      <tr>
                        <th scope="col" className="px-6 py-4">Image</th>
                        <th scope="col" className="px-6 py-4">Title</th>
                        <th scope="col" className="px-6 py-4">Category</th>
                        <th scope="col" className="px-6 py-4">Created Date</th>
                        <th scope="col" className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <AnimatePresence mode="popLayout">
                        {paginatedProjects.map((p) => (
                          <motion.tr
                            key={p._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="hover:bg-white/5 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="size-12 rounded-lg bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center">
                                {p.images && p.images.length > 0 ? (
                                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="font-mono text-[9px] text-white/20">NO IMG</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-foreground font-semibold font-display text-sm">{p.title}</div>
                              <div className="text-xs line-clamp-1 max-w-[280px] text-muted-foreground mt-0.5">{p.description}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[var(--neon)]/10 to-[var(--neon-2)]/10 border border-[var(--neon)]/20 text-[10px] font-mono text-[var(--neon)]">
                                {p.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                              {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openEditModal(p)}
                                  className="p-2 rounded-lg glass hover:bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer"
                                  title="Edit Project"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(p._id)}
                                  className="p-2 rounded-lg glass hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                                  title="Delete Project"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                      
                      {paginatedProjects.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground font-mono">
                            // No matching projects found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-white/5 px-4 py-4 sm:px-6 mt-4">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground hover:bg-white/10 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground hover:bg-white/10 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground font-mono">
                          Showing <span className="font-medium text-foreground">{startIndex + 1}</span> to{" "}
                          <span className="font-medium text-foreground">
                            {Math.min(startIndex + itemsPerPage, filteredProjects.length)}
                          </span>{" "}
                          of <span className="font-medium text-foreground">{filteredProjects.length}</span> projects
                        </p>
                      </div>
                      
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-xl overflow-hidden border border-white/10" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-3 py-2 text-muted-foreground bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          
                          {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                              key={idx + 1}
                              onClick={() => setCurrentPage(idx + 1)}
                              className={`relative inline-flex items-center px-4 py-2 text-xs font-mono font-semibold transition-all cursor-pointer ${
                                currentPage === idx + 1
                                  ? "bg-[var(--neon)] text-primary-foreground shadow-neon"
                                  : "text-muted-foreground bg-white/5 hover:bg-white/10 border-l border-white/10"
                              }`}
                            >
                              {idx + 1}
                            </button>
                          ))}

                          <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-3 py-2 text-muted-foreground bg-white/5 hover:bg-white/10 transition-colors border-l border-white/10 disabled:opacity-50 cursor-pointer"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold">Contact Inbox</h2>
                  <p className="text-sm text-muted-foreground font-display">Messages sent through your contact form</p>
                </div>

                <div className="space-y-4">
                  {messages.map((m) => (
                    <div key={m._id} className="glass rounded-xl p-5 border-white/5 relative group">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <span className="text-xs font-mono text-[var(--neon)]">
                            From: {m.name} ({m.email})
                          </span>
                          <h3 className="font-semibold text-lg mt-1 font-display">{m.subject}</h3>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(m.createdAt).toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleDeleteMessage(m._id)}
                            className="p-1.5 rounded-lg glass hover:bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remove message log"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed border-t border-white/5 pt-3 font-display">
                        {m.message}
                      </p>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground font-mono">
                      // No messages received yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Modal Form */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl glass-strong rounded-2xl overflow-hidden neon-border my-8"
            >
              <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <h3 className="font-bold text-lg font-display">
                  {editingProject ? `Edit Project: ${editingProject.title}` : "Create New Project"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg glass hover:bg-white/10 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmitProject} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-display">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Project Title</label>
                    <input
                      required
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. AI Med Console"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--neon)] focus:ring-1 focus:ring-[var(--neon)]/30 transition-all text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-2">Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["Web", "AI", "Dashboard", "Other"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`p-3.5 rounded-xl border text-center font-bold text-xs transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                            category === cat
                              ? "bg-gradient-to-br from-[var(--neon)]/15 to-[var(--neon-2)]/15 border-[var(--neon)] text-foreground shadow-neon"
                              : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-white/20"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1.5">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your work..."
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--neon)] focus:ring-1 focus:ring-[var(--neon)]/30 transition-all resize-none text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1.5">Technologies (comma separated)</label>
                  <input
                    required
                    type="text"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    placeholder="e.g. React, Node, MongoDB, Socket.io"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--neon)] focus:ring-1 focus:ring-[var(--neon)]/30 transition-all text-foreground"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">GitHub Repository Link</label>
                    <input
                      type="url"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--neon)] focus:ring-1 focus:ring-[var(--neon)]/30 transition-all text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Live Demo Link</label>
                    <input
                      type="url"
                      value={liveDemoLink}
                      onChange={(e) => setLiveDemoLink(e.target.value)}
                      placeholder="https://yourdemo.com"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--neon)] focus:ring-1 focus:ring-[var(--neon)]/30 transition-all text-foreground"
                    />
                  </div>
                </div>

                {/* Multiple Image Selector with Previews before Upload */}
                <div className="border-t border-white/5 pt-4">
                  <label className="block text-xs font-mono text-muted-foreground mb-2">Project Screenshots & Images</label>
                  
                  <div className="flex flex-wrap gap-2.5 items-center mb-3">
                    {/* Render saved database images */}
                    {existingImages.map((img, idx) => (
                      <div key={`existing-${idx}`} className="relative size-16 rounded-lg overflow-hidden glass border border-white/10 group">
                        <img src={img} alt="Saved database screenshot" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(idx)}
                          className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity cursor-pointer"
                          title="Delete saved image"
                        >
                          <X size={14} />
                        </button>
                        <span className="absolute bottom-0 right-0 bg-cyan-500/80 text-[7px] text-white px-1 font-mono">SAVED</span>
                      </div>
                    ))}

                    {/* Render newly selected files (preview state before upload) */}
                    {selectedFiles.map((fileObj, idx) => (
                      <div key={`selected-${idx}`} className="relative size-16 rounded-lg overflow-hidden glass border border-[var(--neon)]/40 group">
                        <img src={fileObj.previewUrl} alt="Local preview selection" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedFile(idx)}
                          className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity cursor-pointer"
                          title="Remove selection"
                        >
                          <X size={14} />
                        </button>
                        <span className="absolute bottom-0 right-0 bg-amber-500/80 text-[7px] text-white px-1 font-mono">NEW PREV</span>
                      </div>
                    ))}
                    
                    <label className="size-16 rounded-lg border-2 border-dashed border-white/10 hover:border-[var(--neon)] cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                      <Upload size={16} />
                      <span className="text-[9px] font-mono mt-1">Add Image</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground block">// Select images to preview. They will upload securely upon clicking Save Changes.</span>
                </div>

                <div className="border-t border-white/5 pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-mono glass hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] text-primary-foreground shadow-neon hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
