import React, { useState } from "react";
import { ArrowRight, Play, Users } from "lucide-react";

export const RoomShowcase = ({
  openCreateModal,
  openJoinModal,
  isHinglish = false,
  isMobile = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      id="room-showcase"
      style={{
        position: "relative",
        padding: isMobile ? "28px 14px 40px" : "48px 24px 64px",
        maxWidth: "1400px",
        boxSizing: "border-box",
        margin: "0 auto",
        width: "100%",
        overflow: "hidden"
      }}
    >
      {/* ========================================================= */}
      {/* 1. SECTION HEADING: Clean, uncluttered, cinematic         */}
      {/* ========================================================= */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: "760px",
          margin: "0 auto 28px"
        }}
      >
        <h2
          className="font-heading"
          style={{
            fontSize: isMobile ? "1.8rem" : "2.45rem",
            fontWeight: "900",
            color: "#FFFFFF",
            margin: "0 0 8px 0",
            letterSpacing: "-0.025em",
            lineHeight: 1.18
          }}
        >
          {isHinglish
            ? "Theater Room Experience — In Real Time"
            : "The Virtual Cinema Room — In Real Time"}
        </h2>

        <p
          style={{
            fontSize: isMobile ? "0.86rem" : "0.96rem",
            lineHeight: 1.55,
            color: "rgba(255, 255, 255, 0.65)",
            margin: 0,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          {isHinglish
            ? "Left me synchronized movie player aur right side me live friends chat — bina kisi delay ke."
            : "Synchronized movie playback on the left with live sidecar banter on the right — zero lag, zero clutter."}
        </p>
      </div>

      {/* ========================================================= */}
      {/* 2. FLOATING CINEMA OLED SCREEN (Wall-Mounted with Ambilight) */}
      {/* ========================================================= */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "980px",
          margin: "0 auto"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ========================================================= */}
        {/* SOFT RED AMBIENT BACKLIGHT GLOW (Ambilight Aura)          */}
        {/* Radiates outside the frame onto the dark theater wall     */}
        {/* Warm, diffuse, gentle on eyes, no harsh glare             */}
        {/* ========================================================= */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: isMobile ? "-14px -12px" : "-36px -44px",
            borderRadius: isMobile ? "24px" : "36px",
            background: isHovered
              ? "radial-gradient(ellipse at 50% 50%, rgba(255, 24, 48, 0.38) 0%, rgba(220, 16, 38, 0.22) 44%, rgba(180, 10, 28, 0.08) 72%, transparent 100%)"
              : "radial-gradient(ellipse at 50% 50%, rgba(255, 24, 48, 0.28) 0%, rgba(220, 16, 38, 0.16) 44%, rgba(180, 10, 28, 0.05) 72%, transparent 100%)",
            filter: isMobile ? "blur(30px)" : "blur(48px)",
            opacity: 0.95,
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: "none",
            zIndex: 1
          }}
        />

        {/* The Precision Cinema OLED Bezel */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            background: "linear-gradient(180deg, #14161C 0%, #0C0E12 100%)",
            borderRadius: isMobile ? "12px" : "16px",
            padding: isMobile ? "6px" : "10px",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            /* Multi-layer soft ambient box-shadow */
            boxShadow: isHovered
              ? "0 30px 85px -15px rgba(0, 0, 0, 0.96), 0 0 50px 8px rgba(255, 20, 48, 0.24), 0 0 100px 22px rgba(220, 14, 38, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
              : "0 20px 65px -15px rgba(0, 0, 0, 0.92), 0 0 38px 6px rgba(255, 20, 48, 0.18), 0 0 80px 18px rgba(220, 14, 38, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
            transform: isHovered ? "translateY(-3px)" : "translateY(0)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {/* Top Delicate Rim-Lighting Specular Line */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: "12%",
              right: "12%",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35) 45%, rgba(255, 77, 94, 0.5) 50%, rgba(255, 255, 255, 0.35) 55%, transparent)",
              zIndex: 4,
              pointerEvents: "none"
            }}
          />

          {/* Screen Inner Frame */}
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: isMobile ? "8px" : "10px",
              overflow: "hidden",
              background: "#000000",
              boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.9), 0 4px 16px rgba(0, 0, 0, 0.6)",
              lineHeight: 0
            }}
          >
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

            {/* Subtle Screen Glass Sheen Overlay */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.035) 0%, transparent 40%)",
                pointerEvents: "none",
                zIndex: 3
              }}
            />
          </div>
        </div>

        {/* Soft Ambient Floor Reflection */}
        <div
          aria-hidden="true"
          style={{
            width: isMobile ? "220px" : "440px",
            height: "2px",
            margin: isMobile ? "10px auto 0" : "14px auto 0",
            background: "linear-gradient(90deg, transparent, rgba(255, 20, 48, 0.6), transparent)",
            borderRadius: "2px",
            filter: "blur(1px)",
            boxShadow: "0 0 16px 3px rgba(255, 20, 48, 0.35)"
          }}
        />
      </div>

      {/* ========================================================= */}
      {/* 3. CLEAN ACTION BUTTONS: Sleek, high-converting           */}
      {/* ========================================================= */}
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
          marginTop: isMobile ? "20px" : "28px"
        }}
      >
        <button
          onClick={openCreateModal}
          style={{
            background: "linear-gradient(135deg, #FF1028 0%, #D4081E 100%)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: isMobile ? "12px 20px" : "12px 28px",
            fontSize: "0.92rem",
            fontWeight: "700",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 6px 22px rgba(255, 16, 40, 0.35)",
            transition: "all 0.2s ease",
            width: isMobile ? "100%" : "auto"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 8px 28px rgba(255, 16, 40, 0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 22px rgba(255, 16, 40, 0.35)";
          }}
        >
          <Play size={15} fill="#FFFFFF" />
          <span>{isHinglish ? "Free Theater Room Banao" : "Create Free Theater Room"}</span>
          <ArrowRight size={15} />
        </button>

        <button
          onClick={openJoinModal}
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "8px",
            padding: isMobile ? "12px 20px" : "12px 24px",
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
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
          }}
        >
          <Users size={15} color="rgba(255, 255, 255, 0.75)" />
          <span>{isHinglish ? "Room ID Se Join Karo" : "Join With Room ID"}</span>
        </button>
      </div>
    </section>
  );
};
