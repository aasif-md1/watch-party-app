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
        padding: isMobile ? "32px 14px 44px" : "64px 24px 68px",
        scrollMarginTop: "80px",
        maxWidth: "1360px",
        boxSizing: "border-box",
        margin: "0 auto",
        width: "100%",
        overflow: "hidden"
      }}
    >
      {/* ========================================================= */}
      {/* 1. SECTION HEADING                                        */}
      {/* ========================================================= */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: "720px",
          margin: "0 auto 24px"
        }}
      >
        <h2
          className="font-heading"
          style={{
            fontSize: isMobile ? "1.75rem" : "2.35rem",
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
            fontSize: isMobile ? "0.85rem" : "0.94rem",
            lineHeight: 1.55,
            color: "rgba(255, 255, 255, 0.65)",
            margin: 0,
            maxWidth: "580px",
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
      {/* 2. REALISTIC MACBOOK PRO CINEMA RIG MOCKUP               */}
      {/* ========================================================= */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: isMobile ? "100%" : "890px",
          margin: "0 auto",
          padding: isMobile ? "0 4px" : "0 12px"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ========================================================= */}
        {/* SOFT RED AMBIENT BACKLIGHT GLOW (Ambilight Aura)          */}
        {/* Radiates outside the laptop frame onto dark background    */}
        {/* Soft, warm, eye-friendly, no harsh glare                  */}
        {/* ========================================================= */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: isMobile ? "-14px -10px -10px -10px" : "-36px -48px -20px -48px",
            borderRadius: isMobile ? "20px" : "32px",
            background: isHovered
              ? "radial-gradient(ellipse at 50% 46%, rgba(255, 24, 48, 0.40) 0%, rgba(220, 16, 38, 0.24) 44%, rgba(180, 10, 28, 0.08) 72%, transparent 100%)"
              : "radial-gradient(ellipse at 50% 46%, rgba(255, 24, 48, 0.30) 0%, rgba(220, 16, 38, 0.18) 44%, rgba(180, 10, 28, 0.05) 72%, transparent 100%)",
            filter: isMobile ? "blur(26px)" : "blur(48px)",
            opacity: 0.95,
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: "none",
            zIndex: 1
          }}
        />

        {/* ========================================================= */}
        {/* MACBOOK DISPLAY LID                                       */}
        {/* ========================================================= */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            background: "linear-gradient(180deg, #181922 0%, #101117 100%)",
            borderRadius: isMobile ? "11px 11px 2px 2px" : "16px 16px 3px 3px",
            padding: isMobile ? "5px 5px 0 5px" : "9px 9px 0 9px",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.95)",
            /* Multi-layer soft ambient box-shadow */
            boxShadow: isHovered
              ? "0 25px 70px -10px rgba(0, 0, 0, 0.95), 0 0 45px 6px rgba(255, 20, 48, 0.22), 0 0 95px 20px rgba(220, 14, 38, 0.11), inset 0 1px 0 rgba(255, 255, 255, 0.22)"
              : "0 18px 55px -10px rgba(0, 0, 0, 0.90), 0 0 35px 5px rgba(255, 20, 48, 0.16), 0 0 75px 15px rgba(220, 14, 38, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
            transform: isHovered ? "translateY(-3px)" : "translateY(0)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {/* Top Camera Notch */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: isMobile ? "64px" : "98px",
              height: isMobile ? "8px" : "11px",
              background: "#08090C",
              borderRadius: "0 0 6px 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderTop: "none"
            }}
          >
            <span
              style={{
                width: isMobile ? "3px" : "4px",
                height: isMobile ? "3px" : "4px",
                borderRadius: "50%",
                background: "#0d2b1f",
                border: "1px solid rgba(34, 197, 94, 0.4)",
                display: "inline-block"
              }}
            />
          </div>

          {/* Screen Inner Display */}
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: isMobile ? "6px 6px 0 0" : "8px 8px 0 0",
              overflow: "hidden",
              background: "#000000",
              boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.95)",
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
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, transparent 40%)",
                pointerEvents: "none",
                zIndex: 4
              }}
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* MACBOOK BASE / CHASSIS & THUMB GROOVE                     */}
        {/* ========================================================= */}
        <div
          aria-hidden="true"
          style={{
            position: "relative",
            zIndex: 3,
            margin: isMobile ? "0 -4px" : "0 -12px"
          }}
        >
          {/* Laptop Base Body */}
          <div
            style={{
              height: isMobile ? "9px" : "13px",
              background: "linear-gradient(180deg, #242732 0%, #15161D 60%, #0D0E13 100%)",
              borderRadius: isMobile ? "0 0 9px 9px" : "0 0 14px 14px",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              borderTop: "1px solid rgba(255, 255, 255, 0.28)",
              boxShadow: "0 14px 35px -5px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255, 255, 255, 0.18)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              position: "relative"
            }}
          >
            {/* Center Thumb Notch / Open Groove */}
            <div
              style={{
                width: isMobile ? "54px" : "88px",
                height: isMobile ? "3px" : "4px",
                background: "#08090C",
                borderRadius: "0 0 4px 4px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            />
          </div>

          {/* Under-Chassis Desk Surface Red Glow Bleed */}
          <div
            style={{
              width: "75%",
              height: "4px",
              margin: "2px auto 0",
              background: "radial-gradient(ellipse at center, rgba(255, 20, 48, 0.6) 0%, transparent 75%)",
              filter: "blur(4px)"
            }}
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. CLEAN ACTION BUTTONS                                   */}
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
