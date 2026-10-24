import React from "react";
import { Play, Users, Zap, Smartphone, Heart } from "lucide-react";

export const Hero = ({
  openCreateModal,
  openJoinModal,
  isHinglish = false,
  isMobile
}) => {
  return (
    <section
      id="home"
      style={{
        position: "relative",
        marginTop: "72px",
        background: "#0A0B0E",
        backgroundImage: `url('/images/hero_perfect_canvas.jpg?v=2')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: isMobile ? "center top" : "right center",
        backgroundSize: "cover",
        height: isMobile ? "auto" : "calc(100vh - 72px)",
        minHeight: isMobile ? "auto" : "560px",
        maxHeight: isMobile ? "none" : "880px",
        display: "flex",
        alignItems: "center",
        padding: isMobile ? "30px 20px 30px" : "20px 56px 20px",
        overflow: "hidden",
        boxSizing: "border-box"
      }}
    >
      {/* Soft atmospheric ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          right: "15%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(229, 9, 20, 0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Main Hero Container */}
      <div
        style={{
          maxWidth: "1340px",
          width: "100%",
          margin: "0 auto",
          position: "relative",
          zIndex: 2
        }}
      >
        {/* Left Column: Headline, Copy, Action Buttons, Trust Badges directly over dark background */}
        <div
          style={{
            maxWidth: isMobile ? "100%" : "660px",
            paddingTop: isMobile ? "0px" : "10px",
            paddingBottom: isMobile ? "0px" : "10px"
          }}
        >
          {/* Headline matching mockup strictly in 2 lines with larger, bold presence */}
          <h1
            className="font-heading"
            style={{
              fontSize: isMobile ? "clamp(2.2rem, 7.5vw, 2.7rem)" : "clamp(2.8rem, 3.4vw, 3.8rem)",
              fontWeight: "900",
              lineHeight: 1.1,
              margin: "0 0 20px 0",
              letterSpacing: "-0.03em"
            }}
          >
            <span style={{ color: "#FFFFFF", display: "block" }}>
              {isHinglish ? "Saath Mein Dekhein." : "Watch Together."}
            </span>
            <span
              style={{
                display: "block",
                background: "linear-gradient(90deg, #E50914 0%, #FF2233 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                paddingRight: "8px"
              }}
            >
              {isHinglish ? "Doston Ke Saath Sab Kuch Stream Karein." : "Stream Anything with Friends."}
            </span>
          </h1>

          {/* Subtitle description highlighting YouTube + HD Screen Share */}
          <p
            style={{
              fontSize: isMobile ? "0.96rem" : "1.12rem",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.72)",
              margin: "0 0 34px 0",
              maxWidth: "560px"
            }}
          >
            {isHinglish
              ? "YouTube videos sync karein ya screen share karke movies aur shows doston ke saath live dekhein. Real-time chat, live reactions, aur instant playback — 100% free."
              : "Stream YouTube videos or share your screen in HD to watch movies, anime, and shows together. Sync playback in real-time, chat live, and react with friends — 100% free, private, and instant."}
          </p>

          {/* Action Buttons Row matching mockup rounded rectangle */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "16px",
              marginBottom: "38px"
            }}
          >
            {/* Primary Button: Solid Netflix Crimson Red Rounded Rectangle with Play Icon */}
            <button
              type="button"
              onClick={openCreateModal}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "11px",
                padding: isMobile ? "14px 24px" : "15px 32px",
                borderRadius: "9px",
                background: "linear-gradient(135deg, #E50914 0%, #B80710 100%)",
                border: "none",
                color: "#FFFFFF",
                fontSize: "1.02rem",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(229, 9, 20, 0.45)",
                transition: "all 0.15s ease",
                width: isMobile ? "100%" : "auto"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F6121D";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(229, 9, 20, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #E50914 0%, #B80710 100%)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(229, 9, 20, 0.45)";
              }}
            >
              <Play size={18} fill="#FFFFFF" />
              <span>Create Watch Room</span>
            </button>

            {/* Secondary Button: Sleek Dark Translucent Rounded Rectangle with Users Icon */}
            <button
              type="button"
              onClick={openJoinModal}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "11px",
                padding: isMobile ? "14px 22px" : "15px 30px",
                borderRadius: "9px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#FFFFFF",
                fontSize: "1.02rem",
                fontWeight: "600",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.15s ease",
                width: isMobile ? "100%" : "auto"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.45)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Users size={18} />
              <span>Join with Room ID</span>
            </button>
          </div>

          {/* Row of 3 Trust Badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: isMobile ? "18px" : "32px",
              color: "rgba(255, 255, 255, 0.72)",
              fontSize: "0.92rem",
              fontWeight: "600"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <Zap size={16} style={{ color: "#E50914" }} />
              <span>No downloads</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <Smartphone size={16} style={{ color: "#E50914" }} />
              <span>Works on all devices</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <Heart size={16} style={{ color: "#E50914" }} />
              <span>100% free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
