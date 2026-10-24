import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Play, MonitorPlay } from "lucide-react";

export const JoinRoomModal = ({
  isOpen,
  onClose,
  roomMode,
  setRoomMode,
  username,
  setUsername,
  joinRoomId,
  setJoinRoomId,
  videoUrl,
  handleVideoUrlChange,
  linkError,
  setLinkError,
  handleJoinRoom,
  isMobile
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleJoinRoom();
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.78)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          padding: "18px"
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          style={{
            background: "#141418",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "14px",
            padding: isMobile ? "24px 20px" : "32px 28px",
            maxWidth: "460px",
            width: "100%",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9)",
            position: "relative"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              color: "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div style={{ marginBottom: "22px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "3px 8px",
                borderRadius: "4px",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#FFFFFF",
                fontSize: "0.72rem",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "8px"
              }}
            >
              JOIN PARTY
            </div>
            <h2
              style={{
                fontSize: "1.45rem",
                fontWeight: "800",
                color: "#FFFFFF",
                margin: "0 0 6px 0",
                fontFamily: "Inter, sans-serif"
              }}
            >
              Join with Room ID
            </h2>
            <p
              style={{
                fontSize: "0.85rem",
                color: "rgba(255, 255, 255, 0.65)",
                margin: 0,
                lineHeight: 1.45
              }}
            >
              Enter the Room ID shared by your friend to join the synchronized watch session.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Mode Switcher */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
              {[
                { key: "youtube", label: "YouTube Party", icon: Play },
                { key: "screenshare", label: "Screen Share", icon: MonitorPlay }
              ].map((m) => {
                const isActive = roomMode === m.key;
                const Icon = m.icon;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => {
                      setRoomMode(m.key);
                      setLinkError("");
                    }}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "10px",
                      borderRadius: "6px",
                      background: isActive ? "#E50914" : "rgba(255, 255, 255, 0.06)",
                      border: isActive ? "1px solid #E50914" : "1px solid rgba(255, 255, 255, 0.12)",
                      color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <Icon size={14} fill={isActive && m.key === "youtube" ? "#FFFFFF" : "none"} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Nickname Input */}
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.74rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "rgba(255, 255, 255, 0.65)",
                  marginBottom: "5px"
                }}
              >
                Your Nickname
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  background: "#0a0a0d",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "6px",
                  color: "#FFFFFF",
                  fontSize: "0.92rem",
                  outline: "none"
                }}
                placeholder="e.g. CinemaFan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#E50914")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.2)")}
              />
            </div>

            {/* Room ID Input */}
            <div style={{ marginBottom: roomMode === "youtube" ? "14px" : "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.74rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "rgba(255, 255, 255, 0.65)",
                  marginBottom: "5px"
                }}
              >
                Room ID
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  background: "#0a0a0d",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "6px",
                  color: "#FFFFFF",
                  fontSize: "0.92rem",
                  outline: "none"
                }}
                placeholder="Paste Room ID here..."
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#E50914")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.2)")}
              />
            </div>

            {/* YouTube Link Input (if youtube mode) */}
            {roomMode === "youtube" && (
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.74rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "rgba(255, 255, 255, 0.65)",
                    marginBottom: "5px"
                  }}
                >
                  YouTube Video Link
                </label>
                <input
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    background: "#0a0a0d",
                    border: linkError ? "1px solid #E50914" : "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "6px",
                    color: "#FFFFFF",
                    fontSize: "0.92rem",
                    outline: "none"
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={handleVideoUrlChange}
                  onFocus={(e) => {
                    if (!linkError) e.target.style.borderColor = "#E50914";
                  }}
                  onBlur={(e) => {
                    if (!linkError) e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  }}
                />
                {linkError && (
                  <p style={{ color: "#E50914", fontSize: "0.75rem", margin: "4px 0 0 2px" }}>
                    ⚠ {linkError}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "13px 20px",
                background: "#E50914",
                border: "none",
                borderRadius: "30px",
                color: "#FFFFFF",
                fontSize: "0.98rem",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 18px rgba(229, 9, 20, 0.4)",
                transition: "background 0.2s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F6121D")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#E50914")}
            >
              <span>Join Room</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
