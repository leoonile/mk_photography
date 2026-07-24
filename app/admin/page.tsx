"use client";

import { useState, useEffect, useRef } from "react";
import "./admin.css";

interface Gallery {
  id: string;
  client_name: string;
  slug: string;
  event_date?: string;
  event_type?: string;
  is_active: boolean;
  gallery_images?: { count: number }[];
}

interface Image {
  id: string;
  cloudinary_url: string;
  cloudinary_id: string;
  filename: string;
  in_portfolio: boolean;
  portfolio_category?: string;
  display_order: number;
}

interface UploadProgress {
  id: string;
  name: string;
  percent: number;
  status: string;
  isError?: boolean;
  isDone?: boolean;
}

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  // Active section
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  // Galleries and state
  const [allGalleries, setAllGalleries] = useState<Gallery[]>([]);
  const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
  const [galleryImages, setGalleryImages] = useState<Image[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<Image[]>([]);

  // Stats
  const [stats, setStats] = useState({
    galleries: 0,
    active: 0,
    photos: 0,
    portfolio: 0,
  });

  // Modal / Upload
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [pendingPortfolioImageId, setPendingPortfolioImageId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // Form states
  const [newClientName, setNewClientName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventType, setNewEventType] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [editClientName, setEditClientName] = useState("");
  const [editEventDate, setEditEventDate] = useState("");
  const [editEventType, setEditEventType] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: "success" | "error" }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // API base
  const API = "/api/admin";

  // Bootstrap auth
  useEffect(() => {
    const token = sessionStorage.getItem("mk_admin_token") || "";
    if (token) {
      setAdminToken(token);
      setIsLoggedIn(true);
    }
  }, []);

  // Whenever logged in or switching sections
  useEffect(() => {
    if (!isLoggedIn) return;
    if (activeSection === "dashboard") {
      loadDashboard();
    } else if (activeSection === "galleries") {
      loadGalleries();
    } else if (activeSection === "portfolio") {
      loadPortfolioView();
    }
  }, [isLoggedIn, activeSection]);

  const addToast = (msg: string, type: "success" | "error" = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const apiRequest = async (action: string, method = "GET", body: any = null, isMultipart = false) => {
    const opts: RequestInit = {
      method,
      headers: { Authorization: `Bearer ${adminToken}` },
    };
    if (body && !isMultipart) {
      (opts.headers as any)["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    } else if (body && isMultipart) {
      opts.body = body; // FormData
    }
    const res = await fetch(`${API}?action=${action}`, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "API error");
    return data;
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setLoginError("Enter your password");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch(`${API}?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Login failed");
        return;
      }
      setAdminToken(data.token);
      sessionStorage.setItem("mk_admin_token", data.token);
      setIsLoggedIn(true);
      setActiveSection("dashboard");
    } catch {
      setLoginError("Connection error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminToken("");
    sessionStorage.removeItem("mk_admin_token");
    setIsLoggedIn(false);
    setPassword("");
  };

  const loadDashboard = async () => {
    try {
      const data = await apiRequest("galleries");
      const galleries = data.galleries || [];
      setAllGalleries(galleries);

      const active = galleries.filter((g: Gallery) => g.is_active).length;
      const totalPhotos = galleries.reduce((sum: number, g: Gallery) => sum + (g.gallery_images?.[0]?.count || 0), 0);

      let portImagesCount = 0;
      try {
        const pd = await apiRequest("portfolio-images");
        portImagesCount = pd.images?.length || 0;
      } catch {}

      setStats({
        galleries: galleries.length,
        active,
        photos: totalPhotos,
        portfolio: portImagesCount,
      });
    } catch {
      addToast("Failed to load dashboard", "error");
    }
  };

  const loadGalleries = async () => {
    try {
      const data = await apiRequest("galleries");
      setAllGalleries(data.galleries || []);
    } catch {
      addToast("Failed to load galleries", "error");
    }
  };

  const loadPortfolioView = async () => {
    try {
      const data = await apiRequest("portfolio-images");
      setPortfolioImages(data.images || []);
    } catch {
      addToast("Failed to load portfolio", "error");
    }
  };

  const openGalleryDetail = async (gallery: Gallery) => {
    setCurrentGallery(gallery);
    setActiveSection("gallery-detail");
    loadGalleryPhotos(gallery.id);
  };

  const loadGalleryPhotos = async (galleryId: string) => {
    try {
      const data = await apiRequest(`gallery-images&gallery_id=${galleryId}`);
      setGalleryImages(data.images || []);
    } catch {
      addToast("Failed to load photos", "error");
    }
  };

  const handleCreateGallery = async () => {
    if (!newClientName.trim() || !newSlug.trim() || !newPassword) {
      addToast("Please fill in client name, slug and password", "error");
      return;
    }
    try {
      const data = await apiRequest("create-gallery", "POST", {
        client_name: newClientName.trim(),
        slug: newSlug.trim(),
        password: newPassword,
        event_date: newEventDate || null,
        event_type: newEventType || null,
      });
      addToast(`Gallery created for ${newClientName}!`, "success");
      setNewClientName("");
      setNewSlug("");
      setNewPassword("");
      setNewEventDate("");
      setNewEventType("");
      setAllGalleries((prev) => [data.gallery, ...prev]);
      openGalleryDetail(data.gallery);
    } catch (e: any) {
      addToast(e.message, "error");
    }
  };

  const autoSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setNewSlug(slug + "-" + new Date().getFullYear());
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length || !currentGallery) return;
    const filesArr = Array.from(files);
    setUploads([]);

    for (let i = 0; i < filesArr.length; i += 3) {
      const batch = filesArr.slice(i, i + 3);
      await Promise.all(batch.map((file) => uploadSingleFile(file)));
    }

    addToast(`Uploaded ${filesArr.length} photo${filesArr.length > 1 ? "s" : ""}!`, "success");
    setTimeout(() => {
      loadGalleryPhotos(currentGallery.id);
    }, 500);
  };

  const uploadSingleFile = (file: File) => {
    return new Promise<void>((resolve) => {
      const itemId = `prog-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setUploads((prev) => [
        ...prev,
        { id: itemId, name: file.name, percent: 0, status: "Uploading..." },
      ]);

      let pct = 0;
      const interval = setInterval(() => {
        pct = Math.min(pct + Math.random() * 15, 90);
        setUploads((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, percent: pct } : item))
        );
      }, 200);

      const fd = new FormData();
      fd.append("gallery_id", currentGallery!.id);
      fd.append("image", file, file.name);

      fetch(`${API}?action=upload-images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: fd,
      })
        .then((r) => r.json())
        .then((data) => {
          clearInterval(interval);
          if (data.errors?.length) {
            setUploads((prev) =>
              prev.map((item) =>
                item.id === itemId
                  ? { ...item, percent: 100, status: "Failed", isError: true }
                  : item
              )
            );
          } else {
            setUploads((prev) =>
              prev.map((item) =>
                item.id === itemId
                  ? { ...item, percent: 100, status: "✓ Done", isDone: true }
                  : item
              )
            );
          }
          resolve();
        })
        .catch(() => {
          clearInterval(interval);
          setUploads((prev) =>
            prev.map((item) =>
              item.id === itemId
                ? { ...item, percent: 100, status: "Error", isError: true }
                : item
            )
          );
          resolve();
        });
    });
  };

  const handleTogglePortfolio = (imageId: string, currentlyIn: boolean) => {
    if (currentlyIn) {
      apiRequest("toggle-portfolio", "PUT", { image_id: imageId, in_portfolio: false })
        .then(() => {
          addToast("Removed from portfolio", "success");
          if (currentGallery) loadGalleryPhotos(currentGallery.id);
        })
        .catch((e) => addToast(e.message, "error"));
    } else {
      setPendingPortfolioImageId(imageId);
      setSelectedCategory(null);
      setIsCategoryModalOpen(true);
    }
  };

  const handleConfirmPortfolio = async () => {
    if (!selectedCategory || !pendingPortfolioImageId) {
      addToast("Please select a category", "error");
      return;
    }
    try {
      await apiRequest("toggle-portfolio", "PUT", {
        image_id: pendingPortfolioImageId,
        in_portfolio: true,
        portfolio_category: selectedCategory,
      });
      addToast(`Added to ${selectedCategory} portfolio!`, "success");
      setIsCategoryModalOpen(false);
      setPendingPortfolioImageId(null);
      setSelectedCategory(null);
      if (currentGallery) loadGalleryPhotos(currentGallery.id);
    } catch (e: any) {
      addToast(e.message, "error");
    }
  };

  const handleDeletePhoto = async (imageId: string) => {
    if (!confirm("Delete this photo? This cannot be undone.")) return;
    try {
      await apiRequest("delete-image", "DELETE", { image_id: imageId });
      addToast("Photo deleted", "success");
      setGalleryImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (e: any) {
      addToast(e.message, "error");
    }
  };

  const handleToggleGalleryActive = async () => {
    if (!currentGallery) return;
    const newState = !currentGallery.is_active;
    try {
      await apiRequest("update-gallery", "PUT", {
        gallery_id: currentGallery.id,
        is_active: newState,
      });
      setCurrentGallery((prev) => (prev ? { ...prev, is_active: newState } : null));
      setAllGalleries((prev) =>
        prev.map((g) => (g.id === currentGallery.id ? { ...g, is_active: newState } : g))
      );
      addToast(`Gallery ${newState ? "activated" : "deactivated"}`, "success");
    } catch (e: any) {
      addToast(e.message, "error");
    }
  };

  const openEditModal = () => {
    if (!currentGallery) return;
    setEditClientName(currentGallery.client_name);
    setEditEventDate(currentGallery.event_date || "");
    setEditEventType(currentGallery.event_type || "");
    setEditPassword("");
    setIsEditModalOpen(true);
  };

  const handleSaveGalleryEdits = async () => {
    if (!currentGallery) return;
    const updates: any = {
      gallery_id: currentGallery.id,
      client_name: editClientName.trim(),
      event_date: editEventDate || null,
      event_type: editEventType || null,
    };
    if (editPassword) {
      updates.new_password = editPassword;
    }
    try {
      const data = await apiRequest("update-gallery", "PUT", updates);
      setCurrentGallery((prev) => (prev ? { ...prev, ...data.gallery } : null));
      setAllGalleries((prev) =>
        prev.map((g) => (g.id === currentGallery.id ? { ...g, ...data.gallery } : g))
      );
      setIsEditModalOpen(false);
      addToast("Gallery updated!", "success");
    } catch (e: any) {
      addToast(e.message, "error");
    }
  };

  const handleDeleteGallery = async () => {
    if (!currentGallery) return;
    if (
      !confirm(
        `Delete gallery for "${currentGallery.client_name}"?\n\nThis will permanently delete all photos. This cannot be undone.`
      )
    )
      return;
    try {
      await apiRequest("delete-gallery", "DELETE", { gallery_id: currentGallery.id });
      addToast("Gallery deleted", "success");
      setAllGalleries((prev) => prev.filter((g) => g.id !== currentGallery.id));
      setCurrentGallery(null);
      setActiveSection("galleries");
    } catch (e: any) {
      addToast(e.message, "error");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <div className="login-logo">MK Photography</div>
          <div className="login-sub">Admin Panel</div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="error-msg">{loginError}</div>
            <button className="btn btn-primary mt-2" type="submit" disabled={loginLoading}>
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app visible">
      <div className="topbar">
        <div className="topbar-brand">MK Admin</div>
        <div className="topbar-right">
          <span className="topbar-user">MK Photography</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="main">
        {/* Sidebar */}
        <nav className="sidebar">
          <div
            className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveSection("dashboard")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </div>
          <div
            className={`nav-item ${activeSection === "galleries" ? "active" : ""}`}
            onClick={() => setActiveSection("galleries")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            Client Galleries
          </div>
          <div
            className={`nav-item ${activeSection === "new-gallery" ? "active" : ""}`}
            onClick={() => setActiveSection("new-gallery")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            New Gallery
          </div>
          <div
            className={`nav-item ${activeSection === "portfolio" ? "active" : ""}`}
            onClick={() => setActiveSection("portfolio")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            Portfolio
          </div>
        </nav>

        {/* Content */}
        <main className="content">
          {/* DASHBOARD */}
          {activeSection === "dashboard" && (
            <section id="section-dashboard">
              <h1 style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", marginBottom: "1.5rem" }}>
                Dashboard
              </h1>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{stats.galleries}</div>
                  <div className="stat-label">Total Galleries</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.active}</div>
                  <div className="stat-label">Active</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.photos}</div>
                  <div className="stat-label">Total Photos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.portfolio}</div>
                  <div className="stat-label">In Portfolio</div>
                </div>
              </div>
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Recent Galleries</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveSection("galleries")}>
                    View All
                  </button>
                </div>
                <div className="panel-body">
                  {allGalleries.length > 0 ? (
                    <div className="galleries-list">
                      {allGalleries.slice(0, 5).map((g) => (
                        <div key={g.id} className="gallery-row">
                          <div className={`gallery-dot ${g.is_active ? "" : "inactive"}`}></div>
                          <div className="gallery-info">
                            <div className="gallery-name">{g.client_name}</div>
                            <div className="gallery-meta">
                              {g.event_type || ""}
                              {g.event_date ? " · " + new Date(g.event_date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : ""}
                              {` · ${g.gallery_images?.[0]?.count || 0} photo${(g.gallery_images?.[0]?.count || 0) !== 1 ? "s" : ""} · /${g.slug}`}
                            </div>
                          </div>
                          <div className="gallery-actions">
                            <button className="btn btn-ghost btn-sm" onClick={() => openGalleryDetail(g)}>
                              Manage
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-icon">📁</div>
                      <div>No galleries yet</div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* GALLERIES LIST */}
          {activeSection === "galleries" && (
            <section id="section-galleries">
              <div className="flex items-center justify-between" style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ fontFamily: "var(--serif)", fontSize: "1.8rem" }}>Client Galleries</h1>
                <button className="btn btn-primary" onClick={() => setActiveSection("new-gallery")}>
                  + New Gallery
                </button>
              </div>
              <div>
                {allGalleries.length > 0 ? (
                  <div className="galleries-list">
                    {allGalleries.map((g) => (
                      <div key={g.id} className="gallery-row">
                        <div className={`gallery-dot ${g.is_active ? "" : "inactive"}`}></div>
                        <div className="gallery-info">
                          <div className="gallery-name">{g.client_name}</div>
                          <div className="gallery-meta">
                            {g.event_type || ""}
                            {g.event_date ? " · " + new Date(g.event_date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : ""}
                            {` · ${g.gallery_images?.[0]?.count || 0} photo${(g.gallery_images?.[0]?.count || 0) !== 1 ? "s" : ""} · /${g.slug}`}
                          </div>
                        </div>
                        <div className="gallery-actions">
                          <button className="btn btn-ghost btn-sm" onClick={() => openGalleryDetail(g)}>
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">📁</div>
                    <div>No galleries yet. <span className="text-accent" style={{ cursor: "pointer" }} onClick={() => setActiveSection("new-gallery")}>Create one →</span></div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* NEW GALLERY FORM */}
          {activeSection === "new-gallery" && (
            <section id="section-new-gallery">
              <h1 style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", marginBottom: "1.5rem" }}>
                Create New Gallery
              </h1>
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Gallery Details</span>
                </div>
                <div className="panel-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Client Name *</label>
                      <input
                        className="form-input"
                        placeholder="e.g. Blessing & Emeka"
                        value={newClientName}
                        onChange={(e) => {
                          setNewClientName(e.target.value);
                          autoSlug(e.target.value);
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gallery Slug * <span className="text-muted">(URL-safe)</span></label>
                      <input
                        className="form-input"
                        placeholder="e.g. blessing-emeka-2025"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Event Date</label>
                      <input
                        className="form-input"
                        type="date"
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Event Type</label>
                      <select
                        className="form-input"
                        value={newEventType}
                        onChange={(e) => setNewEventType(e.target.value)}
                      >
                        <option value="">Select type</option>
                        <option value="Traditional Wedding">Traditional Wedding</option>
                        <option value="White Wedding">White Wedding</option>
                        <option value="Portrait Session">Portrait Session</option>
                        <option value="Corporate Event">Corporate Event</option>
                        <option value="Sports Event">Sports Event</option>
                        <option value="Commercial Shoot">Commercial Shoot</option>
                        <option value="Graduation">Graduation</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Client Password * <span className="text-muted">(what your client will use to log in)</span></label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Set a strong password for this client"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div style={{ background: "rgba(201,146,58,.08)", border: "1px solid rgba(201,146,58,.2)", borderRadius: "6px", padding: "1rem", marginBottom: "1.5rem", fontSize: ".82rem", color: "var(--muted)" }}>
                    💡 <strong style={{ color: "var(--fg)" }}>Share with client:</strong> Send them your gallery page URL + their slug + this password.
                  </div>
                  <button className="btn btn-primary" onClick={handleCreateGallery}>
                    Create Gallery
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* GALLERY DETAIL */}
          {activeSection === "gallery-detail" && currentGallery && (
            <section id="section-gallery-detail">
              <div className="flex items-center gap-2" style={{ marginBottom: "1.5rem" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setActiveSection("galleries")}>
                  ← Back
                </button>
                <h1 style={{ fontFamily: "var(--serif)", fontSize: "1.8rem" }}>
                  {currentGallery.client_name}
                </h1>
                <span id="detail-badge">
                  <span className={`badge ${currentGallery.is_active ? "badge-active" : "badge-inactive"}`}>
                    {currentGallery.is_active ? "Active" : "Inactive"}
                  </span>
                </span>
              </div>

              {/* Gallery info bar */}
              <div style={{ marginBottom: "1.5rem", color: "var(--muted)", fontSize: ".85rem" }}>
                <span>
                  {currentGallery.event_type || "Event"}
                  {currentGallery.event_date ? " · " + new Date(currentGallery.event_date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) : ""}
                </span>
                {" "}·{" "}
                <span>
                  Slug: <strong style={{ color: "var(--fg)" }}>{currentGallery.slug}</strong>
                </span>
              </div>

              {/* Actions bar */}
              <div className="flex gap-1" style={{ marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={() => setIsUploadOpen(true)}>
                  Upload Photos
                </button>
                <button className="btn btn-ghost" onClick={handleToggleGalleryActive}>
                  {currentGallery.is_active ? "Deactivate" : "Activate"}
                </button>
                <button className="btn btn-ghost" onClick={openEditModal}>
                  Edit Details
                </button>
                <button className="btn btn-danger" onClick={handleDeleteGallery}>
                  Delete Gallery
                </button>
              </div>

              {/* Upload zone */}
              {isUploadOpen && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div className="panel">
                    <div className="panel-header">
                      <span className="panel-title">Upload Photos</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => setIsUploadOpen(false)}>
                        Close
                      </button>
                    </div>
                    <div className="panel-body">
                      <div
                        className="upload-zone"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add("dragover");
                        }}
                        onDragLeave={(e) => e.currentTarget.classList.remove("dragover")}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove("dragover");
                          handleFiles(e.dataTransfer.files);
                        }}
                      >
                        <div className="upload-zone-icon">📸</div>
                        <div className="upload-zone-text">
                          <strong>Click to select photos</strong> or drag and drop here
                        </div>
                        <div className="upload-zone-text mt-1" style={{ fontSize: ".78rem" }}>
                          JPG, PNG, WEBP — multiple files supported
                        </div>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFiles(e.target.files)}
                      />
                      {uploads.length > 0 && (
                        <div className="upload-progress">
                          {uploads.map((up) => (
                            <div key={up.id} className="progress-item">
                              <span style={{ flex: "0 0 140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: ".78rem" }}>
                                {up.name}
                              </span>
                              <div className="progress-bar-wrap">
                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${up.percent}%`,
                                    background: up.isError ? "var(--danger)" : up.isDone ? "var(--success)" : "var(--accent)"
                                  }}
                                ></div>
                              </div>
                              <span
                                className="progress-status"
                                style={{ color: up.isError ? "var(--danger)" : up.isDone ? "var(--success)" : "var(--muted)" }}
                              >
                                {up.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Photo grid */}
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">
                    Photos <span className="text-muted">({galleryImages.length})</span>
                  </span>
                  <span style={{ fontSize: ".78rem", color: "var(--muted)" }}>★ = in portfolio</span>
                </div>
                <div className="panel-body">
                  {galleryImages.length > 0 ? (
                    <div className="photo-grid">
                      {galleryImages.map((img) => {
                        const thumb = img.cloudinary_url.replace("/upload/", "/upload/w_300,c_fill,q_auto/");
                        return (
                          <div key={img.id} className="photo-card">
                            {img.in_portfolio && (
                              <div className="in-portfolio-badge">★ {img.portfolio_category || ""}</div>
                            )}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={thumb} alt={img.filename || ""} loading="lazy" />
                            <div className="photo-card-footer">
                              <span className="photo-card-filename">{img.filename || "photo"}</span>
                              <span
                                className={`portfolio-toggle ${img.in_portfolio ? "active" : ""}`}
                                onClick={() => handleTogglePortfolio(img.id, img.in_portfolio)}
                              >
                                <svg viewBox="0 0 24 24" fill={img.in_portfolio ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                {img.in_portfolio ? "In Portfolio" : "Portfolio"}
                              </span>
                              <button className="delete-photo-btn" onClick={() => handleDeletePhoto(img.id)} title="Delete">
                                <svg viewBox="0 0 24 24">
                                  <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-icon">🖼️</div>
                      <div>No photos yet — upload some above</div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* PORTFOLIO VIEW */}
          {activeSection === "portfolio" && (
            <section id="section-portfolio">
              <h1 style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", marginBottom: ".5rem" }}>
                Portfolio Photos
              </h1>
              <p className="text-muted" style={{ marginBottom: "1.5rem", fontSize: ".875rem" }}>
                Photos marked ★ from any gallery appear here and on the live site automatically.
              </p>
              <div>
                {portfolioImages.length > 0 ? (
                  <div className="photo-grid">
                    {portfolioImages.map((img) => {
                      const thumb = img.cloudinary_url.replace("/upload/", "/upload/w_300,c_fill,q_auto/");
                      return (
                        <div key={img.id} className="photo-card">
                          <div className="in-portfolio-badge">{img.portfolio_category || "portfolio"}</div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={thumb} alt={img.filename || ""} loading="lazy" />
                          <div className="photo-card-footer">
                            <span className="photo-card-filename">{img.filename || "photo"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">🖼️</div>
                    <div>No portfolio photos yet</div>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* CATEGORY PICKER MODAL */}
      <div className={`modal-overlay ${isCategoryModalOpen ? "open" : ""}`}>
        <div className="modal category-modal">
          <div className="modal-header">
            <span className="modal-title">Add to Portfolio</span>
            <button className="modal-close" onClick={() => setIsCategoryModalOpen(false)}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <p className="text-muted" style={{ marginBottom: "1rem", fontSize: ".85rem" }}>
              Select which portfolio category this photo belongs to:
            </p>
            <div className="cat-options">
              {["studio", "outdoor", "weddings", "events", "sports", "commercial"].map((cat) => (
                <div
                  key={cat}
                  className={`cat-option ${selectedCategory === cat ? "selected" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setIsCategoryModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleConfirmPortfolio}>
              Add to Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* EDIT GALLERY MODAL */}
      <div className={`modal-overlay ${isEditModalOpen ? "open" : ""}`}>
        <div className="modal">
          <div className="modal-header">
            <span className="modal-title">Edit Gallery</span>
            <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Client Name</label>
              <input
                className="form-input"
                value={editClientName}
                onChange={(e) => setEditClientName(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Event Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={editEventDate}
                  onChange={(e) => setEditEventDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Event Type</label>
                <select
                  className="form-input"
                  value={editEventType}
                  onChange={(e) => setEditEventType(e.target.value)}
                >
                  <option value="">Select type</option>
                  <option value="Traditional Wedding">Traditional Wedding</option>
                  <option value="White Wedding">White Wedding</option>
                  <option value="Portrait Session">Portrait Session</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Sports Event">Sports Event</option>
                  <option value="Commercial Shoot">Commercial Shoot</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">New Password <span className="text-muted">(leave blank to keep current)</span></label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter new password to change it"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveGalleryEdits}>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* TOAST WRAP */}
      <div className="toast-wrap">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === "success" ? "✓ " : "✕ "}
            {toast.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
