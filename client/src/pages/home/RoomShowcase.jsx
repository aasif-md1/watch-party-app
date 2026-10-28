import React, { useState } from "react";
import { Zap, MessageSquare, Monitor, ArrowRight, Play, Users } from "lucide-react";

export const RoomShowcase = ({
  openCreateModal,
  openJoinModal,
  isHinglish = false,
  isMobile = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const highlights = [
    {
      icon: <Zap size={20} color="#FF1028" />,
      title: isHinglish ? "Synchronized Playback" : "Frame-Perfect Video Sync",
      desc: isHinglish
        ? "Host ya koi bhi dost play, pause ya seek kare — sabhi ka video sath me sync rehta hai."
        : "When anyone pauses, plays, or seeks, everyone's playback stays locked in real time."
    },
    {
      icon: <MessageSquare size={20} color="#FF1028" />,
      title: isHinglish ? "Live Chat & Reactions" : "Real-Time Chat & Banter",
      desc: isHinglish
        ? "Movie dekhte waqt reactions, thoughts aur chat share karo bina video interrupt kiye."
        : "Share instant reactions, jokes, and chat right alongside the video screen."
    },
    {
      icon: <Monitor size={20} color="#FF1028" />,
      title: isHinglish ? "Screen Share & Video Call" : "Screen Sharing & Video Call",
      desc: isHinglish
        ? "YouTube videos ho ya desktop screen sharing — doston ke sath high quality me stream karo."
        : "Watch YouTube together or stream any browser tab and desktop app in HD."
    }
  ];

  return (
    <section
      id="room-showcase"
      style={{
        position: "relative",
        padding: isMobile ? "32px 16px 44px" : "44px 28px 64px",
        maxWidth: "1560px",
        boxSizing: "border-box",
        margin: "0 auto",
        width: "100%",
        overflow: "hidden"
      }}
    >
      {/* Subtle ambient glow behind */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? "300px" : "700px",
          height: isMobile ? "200px" : "360px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 16, 40, 0.12) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Header text matching standard website section style */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto 32px"
        }}
      >
        {/* Eyebrow matching HowItWorks */}
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
              color: "#E50914",
              fontSize: "0.78rem",
              fontWeight: "800",
              letterSpacing: "0.14em",
              textTransform: "uppercase"
            }}
          >
            {isHinglish ? "LIVE ROOM PREVIEW" : "LIVE ROOM EXPERIENCE"}
          </span>
          <span style={{ width: "24px", height: "2px", background: "#E50914", borderRadius: "1px" }} />
        </div>

        {/* Section Heading */}
        <h2
          className="font-heading"
          style={{
            fontSize: isMobile ? "1.85rem" : "2.45rem",
            fontWeight: "900",
            color: "#FFFFFF",
            margin: "0 0 10px 0",
            letterSpacing: "-0.025em"
          }}
        >
          {isHinglish ? "Doston Ke Saath Movies Ka Asli Maza" : "Watch Movies Together In Real-Time"}
        </h2>

        {/* Subtitle description */}
        <p
          style={{
            fontSize: "0.94rem",
            lineHeight: 1.6,
            color: "rgba(255, 255, 255, 0.65)",
            margin: 0
          }}
        >
          {isHinglish
            ? "Sync playback, live chat aur video call — sab kuch ek simple aur fast room interface me."
            : "Synchronized playback, live chat, and video calling — all inside your private room."}
        </p>
      </div>

      {/* Clean Desktop Mockup Frame */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1340px",
          margin: "0 auto 32px"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            background: "#0E1015",
            borderRadius: isMobile ? "10px" : "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: isHovered
              ? "0 24px 70px -15px rgba(0, 0, 0, 0.85), 0 0 35px -5px rgba(255, 16, 40, 0.2)"
              : "0 18px 60px -15px rgba(0, 0, 0, 0.8)",
            overflow: "hidden",
            transition: "box-shadow 0.3s ease, border-color 0.3s ease"
          }}
        >
          {/* Top Window Bar */}
          <div
            style={{
              height: isMobile ? "34px" : "40px",
              background: "#14161C",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: isMobile ? "0 10px" : "0 16px",
              boxSizing: "border-box"
            }}
          >
            {/* Window control dots */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#FF5F56", display: "inline-block" }} />
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#FFBD2E", display: "inline-block" }} />
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#27C93F", display: "inline-block" }} />
            </div>

            {/* Address Pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "5px",
                padding: "2px 12px",
                fontSize: isMobile ? "0.68rem" : "0.74rem",
                color: "rgba(255, 255, 255, 0.55)",
                fontFamily: "monospace"
              }}
            >
              <span>🔒 watchparty.website/room</span>
            </div>

            {/* Live Indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  display: "inline-block"
                }}
              />
              <span
                style={{
                  fontSize: isMobile ? "0.65rem" : "0.72rem",
                  color: "#94a3b8",
                  fontWeight: "500"
                }}
              >
                In Sync
              </span>
            </div>
          </div>

          {/* Screenshot of the Room - Clean, unobscured, no floating badges */}
          <div style={{ width: "100%", background: "#000" }}>
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
        </div>
      </div>

      {/* 3 Grounded Value Cards underneath */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1340px",
          margin: "0 auto 32px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "16px"
        }}
      >
        {highlights.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: "#111318",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: "12px",
              padding: "20px 18px",
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)"
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(255, 16, 40, 0.1)",
                border: "1px solid rgba(255, 16, 40, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              {item.icon}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h3
                style={{
                  fontSize: "0.94rem",
                  fontWeight: "700",
                  color: "#FFFFFF",
                  margin: "0 0 4px 0",
                  letterSpacing: "-0.01em"
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: "0.80rem",
                  lineHeight: 1.45,
                  color: "rgba(255, 255, 255, 0.58)",
                  margin: 0
                }}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Clean action buttons */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px"
        }}
      >
        <button
          onClick={openCreateModal}
          style={{
            background: "linear-gradient(135deg, #FF1028 0%, #D4081E 100%)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "11px 24px",
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
          <span>{isHinglish ? "Room Banao" : "Create a Room"}</span>
          <ArrowRight size={15} />
        </button>

        <button
          onClick={openJoinModal}
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "11px 22px",
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
          <span>{isHinglish ? "Room Join Karo" : "Join a Room"}</span>
        </button>
      </div>
    </section>
  );
};
