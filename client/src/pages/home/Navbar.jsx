import React, { useState, useEffect } from "react";
import { LogOut, User, Menu, X, Edit2, Check, Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { BrandLogo } from "../../components/BrandLogo";

export const Navbar = ({
  user,
  authLoading,
  signOut,
  signInWithGoogle,
  updateCustomName,
  openCreateModal,
  isMobile
}) => {
  const auth = useAuth();
  const currentUser = user || auth.user;
  const handleSignOut = signOut || auth.signOut;
  const handleSignIn = signInWithGoogle || auth.signInWithGoogle;
  const handleUpdateCustomName = updateCustomName || auth.updateCustomName;

  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Custom Display Name Modal State
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);

  // Reactive local name that updates instantly without waiting for re-renders or page refresh
  const [localCustomName, setLocalCustomName] = useState(() => {
    if (currentUser?.uid) {
      return localStorage.getItem(`wp_custom_name_${currentUser.uid}`) || currentUser.customName || "";
    }
    return "";
  });

  // Check if name has been configured or skipped for current user
  useEffect(() => {
    if (currentUser?.uid) {
      const saved = localStorage.getItem(`wp_custom_name_${currentUser.uid}`) || currentUser.customName || "";
      setLocalCustomName(saved);
      const conf = localStorage.getItem(`wp_name_configured_${currentUser.uid}`);
      setIsConfigured(Boolean(conf));
      if (!conf) {
        // User logged in and has not set or skipped a custom name yet
        setNameInput(saved || "");
        setIsNameModalOpen(true);
      }
    } else {
      setLocalCustomName("");
      setIsConfigured(false);
      setIsNameModalOpen(false);
    }
  }, [currentUser?.uid, currentUser?.customName]);

  // Synchronize with global auth updates from any component
  useEffect(() => {
    const handleGlobalAuthUpdate = () => {
      if (currentUser?.uid) {
        const saved = localStorage.getItem(`wp_custom_name_${currentUser.uid}`);
        if (saved !== undefined) {
          setLocalCustomName(saved || "");
        }
      }
    };
    window.addEventListener("wp_auth_updated", handleGlobalAuthUpdate);
    window.addEventListener("storage", handleGlobalAuthUpdate);
    return () => {
      window.removeEventListener("wp_auth_updated", handleGlobalAuthUpdate);
      window.removeEventListener("storage", handleGlobalAuthUpdate);
    };
  }, [currentUser?.uid]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple active link tracker
      const scrollPos = window.scrollY + 120;
      const featuresEl = document.getElementById("features");
      const howItWorksEl = document.getElementById("how-it-works");
      const faqEl = document.getElementById("faq");

      if (faqEl && scrollPos >= faqEl.offsetTop) {
        setActiveSection("faq");
      } else if (howItWorksEl && scrollPos >= howItWorksEl.offsetTop) {
        setActiveSection("how-it-works");
      } else if (featuresEl && scrollPos >= featuresEl.offsetTop) {
        setActiveSection("features");
      } else {
        setActiveSection("home");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (window.location.pathname !== "/") {
      window.location.href = id === "home" ? "/" : `/#${id}`;
      return;
    }
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSaveName = (e) => {
    if (e) e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError("Please enter a name or click Skip");
      return;
    }
    if (trimmed.length > 25) {
      setNameError("Name must be 25 characters or less");
      return;
    }
    // Update local display immediately on this render
    setLocalCustomName(trimmed);
    setIsConfigured(true);
    setIsNameModalOpen(false);
    setNameError("");

    if (currentUser?.uid) {
      localStorage.setItem(`wp_custom_name_${currentUser.uid}`, trimmed);
      localStorage.setItem("wp_username", trimmed);
      localStorage.setItem(`wp_name_configured_${currentUser.uid}`, "true");
    }

    if (handleUpdateCustomName) {
      handleUpdateCustomName(trimmed);
    }
    window.dispatchEvent(new Event("wp_auth_updated"));
  };

  const handleSkipName = () => {
    setIsConfigured(true);
    setIsNameModalOpen(false);
    setNameError("");

    if (currentUser?.uid) {
      localStorage.setItem(`wp_name_configured_${currentUser.uid}`, "skipped");
      localStorage.removeItem(`wp_custom_name_${currentUser.uid}`);
    }

    if (handleUpdateCustomName) {
      handleUpdateCustomName(""); // Leaves customName blank, marks configured as skipped
    }
    setLocalCustomName("");
    window.dispatchEvent(new Event("wp_auth_updated"));
  };

  const openEditNameModal = () => {
    setShowDropdown(false);
    setNameInput(localCustomName || currentUser?.customName || currentUser?.googleName || "");
    setNameError("");
    setIsNameModalOpen(true);
  };

  const handleLoginClick = async () => {
    try {
      if (handleSignIn) {
        await handleSignIn();
      } else if (openCreateModal) {
        openCreateModal();
      }
    } catch (err) {
      // Handled in auth hook
    }
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "features", label: "Features" },
    { id: "how-it-works", label: "How it Works" },
    { id: "faq", label: "FAQ" }
  ];

  // Determine what display name text to show in the navbar:
  // - If user just logged in and hasn't saved or skipped: show ONLY the image (no name text)
  // - If customName is saved: show customName
  // - If skipped: show default Google/account name
  const showNameText = isConfigured;
  const navbarDisplayName =
    localCustomName ||
    currentUser?.customName ||
    currentUser?.displayName?.split(" ")[0] ||
    currentUser?.email?.split("@")[0] ||
    "Account";

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "0 20px" : "0 56px",
          background: "#0A0B0E",
          borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
          transition: "all 0.25s ease"
        }}
      >
        {/* Left: Custom Unique Brand Logo */}
        <div
          onClick={() => scrollToSection("home")}
          style={{
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          <BrandLogo size={36} showText={true} />
        </div>

        {/* Center Nav Links (Desktop) */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px"
            }}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.65)",
                    fontSize: "0.92rem",
                    fontWeight: isActive ? "600" : "500",
                    cursor: "pointer",
                    position: "relative",
                    padding: "6px 2px",
                    transition: "color 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)";
                  }}
                >
                  {link.label}
                  {/* Short red bottom underline for active state matching mockup */}
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-2px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "24px",
                        height: "2.5px",
                        background: "#E50914",
                        borderRadius: "2px"
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Right Area: Login Button or User Profile Avatar Pill */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Auth status: Avatar if logged in, else solid red "Login" button */}
          {currentUser ? (
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: showNameText ? "8px" : "0px",
                  padding: showNameText ? "5px 12px 5px 6px" : "4px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  borderRadius: "30px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(226, 55, 68, 0.5)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                }}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={navbarDisplayName}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: "0 0 8px rgba(0,0,0,0.5)"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "#E50914",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <User size={15} color="#FFF" />
                  </div>
                )}
                {/* Show name only once configured or skipped */}
                {showNameText && (
                  <span style={{ fontSize: "0.86rem", fontWeight: "600", color: "#FFFFFF", paddingRight: "4px" }}>
                    {navbarDisplayName}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "44px",
                    background: "#14151B",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                    borderRadius: "10px",
                    padding: "10px",
                    minWidth: "190px",
                    boxShadow: "0 12px 36px rgba(0,0,0,0.85)",
                    zIndex: 100
                  }}
                >
                  <div
                    style={{
                      padding: "6px 8px 10px 8px",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      marginBottom: "6px"
                    }}
                  >
                    <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FFFFFF" }}>
                      {navbarDisplayName}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
                      {currentUser.email}
                    </div>
                  </div>

                  {/* Edit Display Name Button */}
                  <button
                    type="button"
                    onClick={openEditNameModal}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "8px 10px",
                      background: "none",
                      border: "none",
                      borderRadius: "6px",
                      color: "rgba(255, 255, 255, 0.85)",
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.15s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "none";
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
                    }}
                  >
                    <Edit2 size={14} color="#E50914" />
                    <span>Edit Display Name</span>
                  </button>

                  {/* Sign Out Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      handleSignOut();
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "8px 10px",
                      background: "none",
                      border: "none",
                      borderRadius: "6px",
                      color: "#FF5252",
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.15s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 82, 82, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLoginClick}
              style={{
                padding: isMobile ? "9px 20px" : "10px 24px",
                background: "linear-gradient(135deg, #E50914 0%, #B80710 100%)",
                border: "none",
                borderRadius: "30px",
                color: "#FFFFFF",
                fontSize: "0.92rem",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(229, 9, 20, 0.35)",
                transition: "background 0.2s ease, transform 0.15s ease",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F6121D";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #E50914 0%, #B80710 100%)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Login
            </button>
          )}

          {/* Mobile Hamburger Menu Button */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: "none",
                border: "none",
                color: "#FFFFFF",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {/* Mobile Drawer Menu */}
        {isMobile && mobileMenuOpen && (
          <div
            style={{
              position: "absolute",
              top: "72px",
              left: 0,
              right: 0,
              background: "#0E0E12",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "18px 24px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.9)"
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: activeSection === link.id ? "#E50914" : "#FFFFFF",
                  fontSize: "1.05rem",
                  fontWeight: "600",
                  textAlign: "left",
                  padding: "8px 0"
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Name Setup / Edit Modal */}
      {isNameModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.78)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            style={{
              background: "#121318",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "420px",
              padding: "28px 24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.9)",
              position: "relative",
              textAlign: "center"
            }}
          >
            {/* Header Avatar Preview */}
            <div style={{ display: "inline-block", position: "relative", marginBottom: "16px" }}>
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    border: "3px solid #E50914",
                    boxShadow: "0 0 16px rgba(229, 9, 20, 0.4)",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "#E50914",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    boxShadow: "0 0 16px rgba(229, 9, 20, 0.4)"
                  }}
                >
                  <User size={32} color="#FFF" />
                </div>
              )}
            </div>

            <h3
              style={{
                color: "#FFFFFF",
                fontSize: "1.3rem",
                fontWeight: "800",
                margin: "0 0 8px 0"
              }}
            >
              Set Your Display Name
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.65)",
                fontSize: "0.88rem",
                lineHeight: 1.45,
                margin: "0 0 22px 0"
              }}
            >
              Enter the name you want friends to see in watch rooms and live chat.
            </p>

            {/* Input Form */}
            <form onSubmit={handleSaveName}>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Aasif, Alex, CinemaKing"
                  value={nameInput}
                  maxLength={25}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: nameError ? "1px solid #FF5252" : "1px solid rgba(255, 255, 255, 0.18)",
                    color: "#FFFFFF",
                    fontSize: "0.96rem",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s ease"
                  }}
                  onFocus={(e) => {
                    if (!nameError) e.currentTarget.style.borderColor = "#E50914";
                  }}
                  onBlur={(e) => {
                    if (!nameError) e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                  }}
                />
                {nameError && (
                  <p style={{ color: "#FF5252", fontSize: "0.78rem", margin: "6px 0 0 2px" }}>
                    {nameError}
                  </p>
                )}
              </div>

              {/* Action Buttons: Save Name & Skip */}
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={handleSkipName}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.92rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.14)";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                  }}
                >
                  Skip
                </button>

                <button
                  type="submit"
                  style={{
                    flex: 1.4,
                    padding: "12px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #E50914 0%, #B80710 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "0.92rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(229, 9, 20, 0.4)",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#F6121D";
                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(229, 9, 20, 0.55)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #E50914 0%, #B80710 100%)";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(229, 9, 20, 0.4)";
                  }}
                >
                  <Check size={16} />
                  <span>Save Name</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

