import React, { useState } from "react";
import { Zap, MessageSquare, Monitor, ArrowRight, Play, Users, Radio, Disc } from "lucide-react";

export const RoomShowcase = ({
  openCreateModal,
  openJoinModal,
  isHinglish = false,
  isMobile = false
}) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      id: "sync",
      tag: "01",
      icon: <Zap size={16} />,
      title: isHinglish ? "Frame-Lock Video Sync" : "Frame-Locked Video Sync",
      detail: isHinglish
        ? "Sub-second millisecond sync: Host pause ya seek kare, har viewer ka player perfectly aligned rehta hai."
        : "Sub-second sync engine: When anyone pauses, seeks or plays, every viewer is locked to the exact same frame."
    },
    {
      id: "chat",
      tag: "02",
      icon: <MessageSquare size={16} />,
      title: isHinglish ? "Real-Time Sidecar Chat" : "Live Sidecar Chat & Banter",
      detail: isHinglish
        ? "Video screen ko block kiye bina friends ke sath real-time chat, memes aur hype reactions share karo."
        : "Real-time room reactions, timestamps, and friend chat right alongside the screen without blocking the movie."
    },
    {
      id: "stream",
      tag: "03",
      icon: <Monitor size={16} />,
      title: isHinglish ? "Any Video ya Screen Share" : "Stream Any Movie, OTT or Tab",
      detail: isHinglish
        ? "Direct YouTube links paste karo ya desktop se Netflix, anime ya koi bhi tab 60fps HD me screen share karo."
        : "Paste YouTube links or share your browser tab, OTT streaming services, and local files in crisp 60fps."
    }
  ];

  return (
    <section
      id="room-showcase"
      style={{
        position: "relative",
        padding: isMobile ? "32px 14px 44px" : "48px 24px 68px",
        maxWidth: "1520px",
        boxSizing: "border-box",
        margin: "0 auto",
        width: "100%",
        overflow: "hidden"
      }}
    >
      {/* Dynamic Theatrical Ambient Floor Glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? "320px" : "800px",
          height: isMobile ? "220px" : "400px",
          borderRadius: "50%",
          background: isHovered
            ? "radial-gradient(ellipse at center, rgba(255, 16, 40, 0.22) 0%, rgba(14, 165, 233, 0.15) 50%, transparent 75%)"
            : "radial-gradient(ellipse at center, rgba(255, 16, 40, 0.15) 0%, rgba(14, 165, 233, 0.08) 50%, transparent 75%)",
          filter: "blur(90px)",
          transition: "all 0.6s ease",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Section Header */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: "840px",
          margin: "0 auto 28px"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px"
          }}
        >
          <span
            style={{
              color: "#FF1028",
              fontSize: "0.78rem",
              fontWeight: "800",
              letterSpacing: "0.14em",
              textTransform: "uppercase"
            }}
          >
            {isHinglish ? "CINEMATIC SCREENING" : "LIVE SCREENING ROOM"}
          </span>
          <span style={{ width: "24px", height: "2px", background: "#FF1028", borderRadius: "1px" }} />
        </div>

        <h2
          className="font-heading"
          style={{
            fontSize: isMobile ? "1.8rem" : "2.5rem",
            fontWeight: "900",
            color: "#FFFFFF",
            margin: "0 0 10px 0",
            letterSpacing: "-0.025em",
            lineHeight: 1.2
          }}
        >
          {isHinglish ? "Real-Time Watch Party Experience" : "Watch Movies Together, In True Sync"}
        </h2>

        <p
          style={{
            fontSize: isMobile ? "0.88rem" : "0.96rem",
            lineHeight: 1.55,
            color: "rgba(255, 255, 255, 0.65)",
            margin: 0
          }}
        >
          {isHinglish
            ? "Sub-second synchronized player, instant live chat, aur private video calling — sab kuch ek sleek theater stage me."
            : "Synchronized video player, low-latency live chat, and instant video calling — all unified in one cinema theater stage."}
        </p>
      </div>

      {/* The Master Cinema Display Stage */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1340px",
          margin: "0 auto",
          background: "#08090C",
          borderRadius: isMobile ? "12px" : "18px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: isHovered
            ? "0 30px 90px -15px rgba(0, 0, 0, 0.95), 0 0 45px -5px rgba(255, 16, 40, 0.25)"
            : "0 20px 60px -15px rgba(0, 0, 0, 0.85)",
          overflow: "hidden",
          transition: "box-shadow 0.4s ease, border-color 0.4s ease"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Cinema Stage Top Telemetry Bar */}
        <div
          style={{
            height: isMobile ? "36px" : "42px",
            background: "linear-gradient(180deg, #14161C 0%, #0D0E12 100%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "0 10px" : "0 18px",
            fontSize: isMobile ? "0.68rem" : "0.76rem",
            fontFamily: "monospace",
            boxSizing: "border-box"
          }}
        >
          {/* Status Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#FF1028",
                boxShadow: "0 0 8px #FF1028",
                display: "inline-block"
              }}
            />
            <span style={{ color: "#FFFFFF", fontWeight: "700", letterSpacing: "0.08em" }}>
              THEATER 01
            </span>
            <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>|</span>
            <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              {isMobile ? "1080P" : "FULL HD 1080P"}
            </span>
          </div>

          {/* Center Title Pill */}
          <div
            style={{
              display: isMobile ? "none" : "flex",
              alignItems: "center",
              gap: "6px",
              color: "rgba(255, 255, 255, 0.75)",
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              padding: "2px 14px",
              borderRadius: "4px"
            }}
          >
            <Disc size={13} color="#FF1028" />
            <span style={{ letterSpacing: "0.04em" }}>NOW SCREENING: LEO (2023)</span>
          </div>

          {/* Sync Stats Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block"
              }}
            />
            <span style={{ color: "#22c55e", fontWeight: "600" }}>
              {isMobile ? "Synced" : "2 Viewers in Sync"}
            </span>
          </div>
        </div>

        {/* Real Screenshot Preview */}
        <div style={{ position: "relative", width: "100%", background: "#000" }}>
          <img
            src="/images/cinematic-room-preview.png"
            alt="WatchParty Live Movie Screening with Chat"
            loading="lazy"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "contain"
            }}
          />
        </div>

        {/* Integrated Cinema Console (Directly underneath the screen) */}
        <div
          style={{
            background: "#0B0C10",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            padding: isMobile ? "12px 10px" : "16px 20px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? "8px" : "14px",
            boxSizing: "border-box"
          }}
        >
          {features.map((item, idx) => {
            const isActive = activeFeature === idx;
            return (
              <div
                key={item.id}
                onClick={() => setActiveFeature(idx)}
                style={{
                  background: isActive ? "rgba(255, 16, 40, 0.08)" : "rgba(255, 255, 255, 0.02)",
                  border: isActive ? "1px solid rgba(255, 16, 40, 0.35)" : "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "10px",
                  padding: isMobile ? "10px 12px" : "12px 16px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px"
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    background: isActive ? "rgba(255, 16, 40, 0.18)" : "rgba(255, 255, 255, 0.05)",
                    color: isActive ? "#FF1028" : "rgba(255, 255, 255, 0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: isMobile ? "0.82rem" : "0.88rem",
                      fontWeight: "700",
                      color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.85)",
                      marginBottom: "3px"
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? "0.72rem" : "0.76rem",
                      lineHeight: 1.4,
                      color: "rgba(255, 255, 255, 0.55)"
                    }}
                  >
                    {item.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call To Action Buttons below stage */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginTop: "24px"
        }}
      >
        <button
          onClick={openCreateModal}
          style={{
            background: "linear-gradient(135deg, #FF1028 0%, #D4081E 100%)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: isMobile ? "11px 20px" : "11px 24px",
            fontSize: "0.88rem",
            fontWeight: "700",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 6px 20px rgba(255, 16, 40, 0.3)",
            transition: "all 0.2s ease",
            width: isMobile ? "100%" : "auto"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Play size={15} fill="#FFFFFF" />
          <span>{isHinglish ? "Room Banao — Free" : "Create Room — Free"}</span>
          <ArrowRight size={15} />
        </button>

        <button
          onClick={openJoinModal}
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: isMobile ? "11px 20px" : "11px 22px",
            fontSize: "0.88rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s ease",
            width: isMobile ? "100%" : "auto"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
          }}
        >
          <Users size={15} color="rgba(255, 255, 255, 0.7)" />
          <span>{isHinglish ? "Room ID Se Join Karo" : "Join With Room ID"}</span>
        </button>
      </div>
    </section>
  );
};
