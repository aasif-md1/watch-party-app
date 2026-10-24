import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, FileText, Mail, Info, Send } from "lucide-react";

export const InfoModal = ({ isOpen, onClose, initialTab = "about", isMobile }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [contactSent, setContactSent] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab.toLowerCase());
    }
    setContactSent(false);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) return;
    setContactSent(true);
    setTimeout(() => {
      setContactMessage("");
      setContactEmail("");
    }, 2000);
  };

  const tabs = [
    { id: "about", label: "About", icon: Info },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "terms", label: "Terms", icon: FileText },
    { id: "contact", label: "Contact", icon: Mail }
  ];

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "18px"
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          style={{
            background: "#121217",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "16px",
            maxWidth: "680px",
            width: "100%",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9)",
            position: "relative",
            overflow: "hidden"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar with Tabs and Close Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 24px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "#0E0E12"
            }}
          >
            {/* Tab Switches */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "20px",
                      background: isActive ? "rgba(229, 9, 20, 0.16)" : "transparent",
                      border: isActive ? "1px solid #E50914" : "1px solid transparent",
                      color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <Icon size={14} style={{ color: isActive ? "#E50914" : "inherit" }} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable Modal Content */}
          <div
            style={{
              padding: isMobile ? "20px 20px" : "28px 28px",
              overflowY: "auto",
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.92rem",
              lineHeight: 1.65
            }}
          >
            {activeTab === "about" && (
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#FFFFFF", marginBottom: "12px" }}>
                  About WatchParty
                </h3>
                <p style={{ marginBottom: "16px" }}>
                  <strong>WatchParty</strong> brings people together across any distance. Whether you're watching long-form YouTube tutorials, anime, movie trailers, or broadcasting your entire screen with crisp audio, WatchParty synchronizes playback in real-time with sub-second precision.
                </p>
                <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "#E50914", marginBottom: "8px" }}>
                  Key Highlights
                </h4>
                <ul style={{ paddingLeft: "20px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <li><strong>Zero Installs:</strong> Operates 100% natively in any modern desktop or mobile browser.</li>
                  <li><strong>High-Performance Sync:</strong> Ultra low-latency WebRTC streams paired with synchronized video controls.</li>
                  <li><strong>Private & Ephemeral:</strong> No tracking of video history; rooms expire automatically after watch parties conclude.</li>
                  <li><strong>Interactive Lounge:</strong> Face-to-face video chat, camera filters, reaction stickers, and live chat.</li>
                </ul>
              </div>
            )}

            {activeTab === "privacy" && (
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#FFFFFF", marginBottom: "12px" }}>
                  Privacy Policy
                </h3>
                <p style={{ marginBottom: "14px" }}>
                  Your privacy is central to how WatchParty is built. We believe shared entertainment should be private, secure, and free from intrusive tracking.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "12px 16px", borderRadius: "8px" }}>
                    <strong style={{ color: "#FFFFFF" }}>1. Authentication & Accounts:</strong>
                    <p style={{ margin: "4px 0 0", color: "rgba(255, 255, 255, 0.7)" }}>
                      We use Google Firebase Auth to authenticate users securely. We only access your basic public profile (display name, email, avatar). We never sell or share user data.
                    </p>
                  </div>
                  <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "12px 16px", borderRadius: "8px" }}>
                    <strong style={{ color: "#FFFFFF" }}>2. Peer-to-Peer WebRTC Media:</strong>
                    <p style={{ margin: "4px 0 0", color: "rgba(255, 255, 255, 0.7)" }}>
                      Screen share and webcam audio/video streams connect directly peer-to-peer between participants and are never stored or recorded on any server.
                    </p>
                  </div>
                  <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "12px 16px", borderRadius: "8px" }}>
                    <strong style={{ color: "#FFFFFF" }}>3. Ephemeral Chat Messages:</strong>
                    <p style={{ margin: "4px 0 0", color: "rgba(255, 255, 255, 0.7)" }}>
                      Messages sent in active rooms are cleared when all room members leave. No long-term logs are maintained.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "terms" && (
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#FFFFFF", marginBottom: "12px" }}>
                  Terms of Service
                </h3>
                <p style={{ marginBottom: "14px" }}>
                  By accessing or using WatchParty, you agree to comply with our community guidelines and terms of service:
                </p>
                <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  <li><strong>Lawful Use:</strong> You agree not to broadcast illegal, harmful, harassing, or defamatory materials.</li>
                  <li><strong>Third-Party Content:</strong> YouTube content embedded within rooms is governed by YouTube's respective Terms of Service.</li>
                  <li><strong>Fair Access:</strong> We provide WatchParty completely free of charge on an "as is" and "as available" basis.</li>
                  <li><strong>Community Respect:</strong> Harassment or spamming in public or shared rooms will result in immediate session termination.</li>
                </ul>
              </div>
            )}

            {activeTab === "contact" && (
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#FFFFFF", marginBottom: "8px" }}>
                  Contact Us
                </h3>
                <p style={{ marginBottom: "18px", color: "rgba(255, 255, 255, 0.7)" }}>
                  Have questions, feature suggestions, or feedback? Send us a quick note below or reach out directly at <strong style={{ color: "#E50914" }}>support@watchparty.website</strong>.
                </p>

                {contactSent ? (
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      background: "rgba(74, 222, 128, 0.15)",
                      border: "1px solid rgba(74, 222, 128, 0.4)",
                      color: "#4ADE80",
                      textAlign: "center",
                      fontWeight: "700"
                    }}
                  >
                    ✓ Thank you! Your message has been received. We'll get back to you soon.
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: "700", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.6)", marginBottom: "4px" }}>
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "6px",
                          background: "#0a0a0d",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#FFFFFF",
                          fontSize: "0.9rem",
                          outline: "none"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: "700", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.6)", marginBottom: "4px" }}>
                        Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us what's on your mind..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "6px",
                          background: "#0a0a0d",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#FFFFFF",
                          fontSize: "0.9rem",
                          outline: "none",
                          resize: "vertical"
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        alignSelf: "flex-start",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 22px",
                        borderRadius: "20px",
                        background: "#E50914",
                        border: "none",
                        color: "#FFFFFF",
                        fontSize: "0.9rem",
                        fontWeight: "700",
                        cursor: "pointer",
                        marginTop: "4px"
                      }}
                    >
                      <span>Send Message</span>
                      <Send size={14} />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
