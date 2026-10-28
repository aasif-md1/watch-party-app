import React, { useState } from "react";
import { Zap, MessageSquare, Monitor, Sparkles, ArrowRight, Play, Users, CheckCircle2 } from "lucide-react";

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
      title: isHinglish ? "Millisecond Frame Sync" : "Frame-Perfect Video Sync",
      desc: isHinglish
        ? "Host ya koi bhi dost play, pause ya seek kare — sabhi ka playback exact same frame par lock rehta hai."
        : "When anyone pauses, plays, or seeks, everyone's playback stays locked to the exact microsecond."
    },
    {
      icon: <MessageSquare size={20} color="#FF1028" />,
      title: isHinglish ? "Live Banter & Goosebumps" : "Real-Time Chat & Reactions",
      desc: isHinglish
        ? "Movie scenes par instant reactions, hype messages aur chat real-time share karo bina video roke."
        : "Share laughter, plot twists, and hype banter right alongside the screen with zero distraction."
    },
    {
      icon: <Monitor size={20} color="#FF1028" />,
      title: isHinglish ? "Any OTT, Movie ya YouTube" : "Stream Any Movie, OTT or Tab",
      desc: isHinglish
        ? "YouTube links ho ya browser tab se desktop screen sharing — sab kuch bina lag ke stream hota hai."
        : "Share direct YouTube links or stream any browser tab and desktop app in crisp HD."
    }
  ];

  return (
    <section
      id="room-showcase"
      style={{
        position: "relative",
        padding: isMobile ? "36px 16px 50px" : "48px 28px 72px",
        maxWidth: "1560px",
        boxSizing: "border-box",
        margin: "0 auto",
        width: "100%",
        overflow: "hidden"
      }}
    >
      {/* Theatrical Ambient Backlight Projections (Blue & Crimson) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: isMobile ? "240px" : "480px",
          height: isMobile ? "240px" : "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.14) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "15%",
          right: "12%",
          width: isMobile ? "260px" : "520px",
          height: isMobile ? "260px" : "520px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 16, 40, 0.16) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Header text */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: "840px",
          margin: "0 auto 36px"
        }}
      >
        {/* Eyebrow Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 16, 40, 0.1)",
            border: "1px solid rgba(255, 16, 40, 0.28)",
            padding: "6px 14px",
            borderRadius: "999px",
            marginBottom: "14px"
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#FF1028",
              boxShadow: "0 0 10px #FF1028",
              display: "inline-block"
            }}
          />
          <span
            style={{
              color: "#FF5A70",
              fontSize: "0.76rem",
              fontWeight: "800",
              letterSpacing: "0.12em",
              textTransform: "uppercase"
            }}
          >
            {isHinglish ? "ASLI ROOM KA EXPERIENCE" : "INSIDE THE LIVING ROOM"}
          </span>
        </div>

        {/* Section Heading */}
        <h2
          className="font-heading"
          style={{
            fontSize: isMobile ? "1.9rem" : "2.65rem",
            fontWeight: "900",
            color: "#FFFFFF",
            margin: "0 0 12px 0",
            letterSpacing: "-0.025em",
            lineHeight: 1.18
          }}
        >
          {isHinglish ? (
            <>
              Movie Nights Ka Naya Andaaz —{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #FF1028 20%, #FF6B81 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                Bilkul Saath Hone Jaisa Feel
              </span>
            </>
          ) : (
            <>
              Feels Like You’re Sitting on the{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #FF1028 20%, #FF6B81 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                Exact Same Couch
              </span>
            </>
          )}
        </h2>

        {/* Subtitle description */}
        <p
          style={{
            fontSize: isMobile ? "0.9rem" : "1.02rem",
            lineHeight: 1.6,
            color: "rgba(255, 255, 255, 0.65)",
            margin: 0
          }}
        >
          {isHinglish
            ? "Dekho room ke andar movie streaming kaisa dikhta hai: Lag-free ultra-fast sync, real-time banter, aur private video calling — bina kisi complicated setup ke."
            : "Explore what streaming together feels like in reality. Lag-free synchronized video, lively real-time chat banter, and instant video calling in one unified cinema interface."}
        </p>
      </div>

      {/* Cinematic Showcase Container */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1340px",
          margin: "0 auto 40px"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ambient Cinema Halo behind mockup */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-20px",
            background: isHovered
              ? "radial-gradient(ellipse at 50% 50%, rgba(255, 16, 40, 0.28) 0%, rgba(14, 165, 233, 0.18) 45%, transparent 75%)"
              : "radial-gradient(ellipse at 50% 50%, rgba(255, 16, 40, 0.18) 0%, rgba(14, 165, 233, 0.12) 45%, transparent 75%)",
            filter: "blur(40px)",
            transition: "all 0.5s ease",
            pointerEvents: "none",
            zIndex: 0
          }}
        />

        {/* Desktop Studio Browser Mockup Frame */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: "#0E1015",
            borderRadius: isMobile ? "12px" : "18px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: isHovered
              ? "0 30px 100px -15px rgba(0, 0, 0, 0.9), 0 0 50px -5px rgba(255, 16, 40, 0.3), 0 0 0 1px rgba(255, 16, 40, 0.3)"
              : "0 24px 80px -15px rgba(0, 0, 0, 0.85), 0 0 40px -10px rgba(255, 16, 40, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.08)",
            overflow: "hidden",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease",
            transform: isHovered && !isMobile ? "translateY(-4px)" : "translateY(0)"
          }}
        >
          {/* Top Window Bar (macOS / Studio Browser chrome) */}
          <div
            style={{
              height: isMobile ? "36px" : "44px",
              background: "linear-gradient(180deg, #181A20 0%, #111318 100%)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: isMobile ? "0 12px" : "0 18px",
              boxSizing: "border-box"
            }}
          >
            {/* Window control dots */}
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F56", display: "inline-block" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFBD2E", display: "inline-block" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27C93F", display: "inline-block" }} />
            </div>

            {/* Address Pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "6px",
                padding: "3px 14px",
                fontSize: isMobile ? "0.7rem" : "0.78rem",
                color: "rgba(255, 255, 255, 0.65)",
                fontFamily: "monospace"
              }}
            >
              <span style={{ color: "#22c55e" }}>🔒</span>
              <span>watchparty.website/room/leo-premiere</span>
            </div>

            {/* Live Indicator on Top Right */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 8px #22c55e",
                  display: "inline-block"
                }}
              />
              <span
                style={{
                  fontSize: isMobile ? "0.68rem" : "0.74rem",
                  color: "#e2e8f0",
                  fontWeight: "600"
                }}
              >
                2 Watching
              </span>
            </div>
          </div>

          {/* Actual High-Res Screenshot of the Room */}
          <div style={{ position: "relative", width: "100%", background: "#000" }}>
            <img
              src="/images/cinematic-room-preview.png"
              alt="WatchParty Live Cinematic Room with Movie and Real-time Chat"
              loading="lazy"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "contain"
              }}
            />

            {/* Floating Live Reaction Micro-Badge over preview */}
            {!isMobile && (
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "24px",
                  background: "rgba(10, 11, 14, 0.88)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.6)"
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(255, 16, 40, 0.15)",
                    border: "1px solid rgba(255, 16, 40, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FF1028"
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#FFFFFF" }}>
                    {isHinglish ? "Real-Time Movie Party" : "Instant Synced Theater"}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.6)" }}>
                    {isHinglish ? "Zero lag playback + direct chat" : "1080p stream + synchronized audio"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 Value Pillars underneath the Mockup */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1340px",
          margin: "0 auto 36px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "18px"
        }}
      >
        {highlights.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: "#111318",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: "14px",
              padding: "22px 20px",
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              transition: "border-color 0.25s ease, transform 0.25s ease",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 16, 40, 0.4)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.07)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(255, 16, 40, 0.1)",
                border: "1px solid rgba(255, 16, 40, 0.25)",
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
                  fontSize: "0.98rem",
                  fontWeight: "700",
                  color: "#FFFFFF",
                  margin: "0 0 6px 0",
                  letterSpacing: "-0.01em"
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: "0.82rem",
                  lineHeight: 1.5,
                  color: "rgba(255, 255, 255, 0.6)",
                  margin: 0
                }}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Action Bar under the section */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px"
        }}
      >
        <button
          onClick={openCreateModal}
          style={{
            background: "linear-gradient(135deg, #FF1028 0%, #D4081E 100%)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "10px",
            padding: "13px 28px",
            fontSize: "0.92rem",
            fontWeight: "700",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "9px",
            boxShadow: "0 8px 24px rgba(255, 16, 40, 0.35)",
            transition: "all 0.2s ease",
            width: isMobile ? "100%" : "auto"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(255, 16, 40, 0.48)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 16, 40, 0.35)";
          }}
        >
          <Play size={16} fill="#FFFFFF" />
          <span>{isHinglish ? "Abhi Free Room Banao" : "Create a Free Room Now"}</span>
          <ArrowRight size={16} />
        </button>

        <button
          onClick={openJoinModal}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "10px",
            padding: "13px 24px",
            fontSize: "0.92rem",
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
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
          }}
        >
          <Users size={16} color="rgba(255, 255, 255, 0.8)" />
          <span>{isHinglish ? "Code Se Room Join Karo" : "Join with Room Code"}</span>
        </button>
      </div>
    </section>
  );
};
