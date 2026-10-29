import React, { useState } from "react";
import { ArrowRight, Play, Users, Lock, RotateCw, ChevronLeft, ChevronRight } from "lucide-react";

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
      {/* 2. AUTHENTIC 16:10 WIDESCREEN CINEMA TABLET               */}
      {/* Real-world tablet proportions (16:10 ratio, NOT stretched) */}
      {/* ========================================================= */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: isMobile ? "100%" : "780px",
          margin: "0 auto",
          padding: isMobile ? "0 4px" : "0 12px"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ========================================================= */}
        {/* SOFT RED AMBIENT BACKLIGHT GLOW (Ambilight Aura)          */}
        {/* ========================================================= */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: isMobile ? "-14px -10px" : "-28px -36px",
            borderRadius: isMobile ? "24px" : "36px",
            background: isHovered
              ? "radial-gradient(ellipse at 50% 50%, rgba(255, 24, 48, 0.42) 0%, rgba(220, 16, 38, 0.24) 45%, rgba(180, 10, 28, 0.08) 72%, transparent 100%)"
              : "radial-gradient(ellipse at 50% 50%, rgba(255, 24, 48, 0.30) 0%, rgba(220, 16, 38, 0.18) 45%, rgba(180, 10, 28, 0.05) 72%, transparent 100%)",
            filter: isMobile ? "blur(24px)" : "blur(44px)",
            opacity: 0.95,
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: "none",
            zIndex: 1
          }}
        />

        {/* ========================================================= */}
        {/* AUTHENTIC 16:10 SOLID UNIBODY TABLET (Real-World Ratio)   */}
        {/* Single piece lifts on hover - ZERO separation             */}
        {/* ========================================================= */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            aspectRatio: "16 / 10",
            background: "linear-gradient(180deg, #1E1F29 0%, #13141B 50%, #0A0B10 100%)",
            borderRadius: isMobile ? "16px" : "26px",
            padding: isMobile ? "6px" : "11px",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            borderTop: "1px solid rgba(255, 255, 255, 0.30)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.10)",
            boxShadow: isHovered
              ? "0 30px 80px -10px rgba(0, 0, 0, 0.98), 0 0 50px 8px rgba(229, 9, 20, 0.24), 0 0 100px 24px rgba(229, 9, 20, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.25)"
              : "0 22px 60px -10px rgba(0, 0, 0, 0.95), 0 0 35px 5px rgba(229, 9, 20, 0.16), 0 0 75px 15px rgba(229, 9, 20, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.18)",
            transform: isHovered ? "translateY(-4px) scale(1.008)" : "translateY(0) scale(1)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box"
          }}
        >
          {/* Subtle Stylus Magnetic Charging Strip on Top Edge */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-1px",
              left: "50%",
              transform: "translateX(-50%)",
              width: isMobile ? "60px" : "90px",
              height: isMobile ? "1.5px" : "2px",
              background: "rgba(255, 255, 255, 0.32)",
              borderRadius: "0 0 2px 2px",
              boxShadow: "0 0 3px rgba(255, 255, 255, 0.4)"
            }}
          />

          {/* Centered Front Camera & Ambient Sensor inside Top Bezel */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: isMobile ? "2.5px" : "4px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: isMobile ? "3px" : "5px",
              zIndex: 5,
              pointerEvents: "none"
            }}
          >
            {/* Ambient Sensor */}
            <span
              style={{
                width: isMobile ? "2px" : "3px",
                height: isMobile ? "2px" : "3px",
                borderRadius: "50%",
                background: "#08090D",
                display: "inline-block"
              }}
            />
            {/* Front Camera Lens */}
            <span
              style={{
                width: isMobile ? "3.5px" : "5px",
                height: isMobile ? "3.5px" : "5px",
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 35%, #18202A 0%, #050608 80%)",
                border: "1px solid rgba(255, 255, 255, 0.22)",
                boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.9)",
                display: "inline-block"
              }}
            />
            {/* Status Indicator LED */}
            <span
              style={{
                width: isMobile ? "1.5px" : "2px",
                height: isMobile ? "1.5px" : "2px",
                borderRadius: "50%",
                background: "#22C55E",
                boxShadow: "0 0 3px #22C55E, 0 0 6px rgba(34, 197, 94, 0.6)",
                display: "inline-block"
              }}
            />
          </div>

          {/* Inner Widescreen OLED Cinema Display (Full Height 16:10 Screen) */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: isMobile ? "11px" : "17px",
              overflow: "hidden",
              background: "#08090C",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.7)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            {/* Tablet Status Bar */}
            <div
              style={{
                height: isMobile ? "13px" : "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: isMobile ? "2px 10px 0" : "3px 14px 0",
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: isMobile ? "6px" : "9px",
                fontWeight: 600,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                letterSpacing: "-0.01em",
                zIndex: 3,
                userSelect: "none"
              }}
            >
              <span>9:41</span>
              <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "3px" : "6px" }}>
                <span style={{ fontSize: isMobile ? "5px" : "7.5px", opacity: 0.85 }}>5G</span>
                <div
                  style={{
                    width: isMobile ? "13px" : "18px",
                    height: isMobile ? "6.5px" : "9px",
                    borderRadius: "2px",
                    border: "1px solid rgba(255, 255, 255, 0.7)",
                    padding: "1px",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <div style={{ width: "100%", height: "100%", borderRadius: "1px", background: "#22C55E" }} />
                </div>
              </div>
            </div>

            {/* Tablet Browser Omnibar / Address Bar (Showing watchparty.website) */}
            <div
              style={{
                height: isMobile ? "18px" : "26px",
                background: "rgba(18, 19, 27, 0.92)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                borderTop: "1px solid rgba(255, 255, 255, 0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: isMobile ? "0 8px" : "0 12px",
                zIndex: 4,
                userSelect: "none"
              }}
            >
              {/* Left Navigation Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "4px" : "8px", color: "rgba(255, 255, 255, 0.4)" }}>
                <ChevronLeft size={isMobile ? 10 : 13} />
                <ChevronRight size={isMobile ? 10 : 13} />
              </div>

              {/* Center: Domain Address Pill */}
              <div
                style={{
                  flex: isMobile ? "0 1 76%" : "0 1 62%",
                  height: isMobile ? "13px" : "19px",
                  background: "rgba(8, 9, 13, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: isMobile ? "4px" : "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: isMobile ? "0 6px" : "0 9px",
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.7)"
                }}
              >
                {/* SSL Lock & Domain */}
                <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "3px" : "5px" }}>
                  <Lock size={isMobile ? 6.5 : 9} color="#22C55E" strokeWidth={2.5} />
                  <span
                    style={{
                      fontSize: isMobile ? "6.5px" : "9.5px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                      letterSpacing: "-0.01em"
                    }}
                  >
                    watchparty.website
                  </span>
                </div>

                {/* Refresh Icon */}
                <RotateCw size={isMobile ? 6 : 8.5} color="rgba(255, 255, 255, 0.55)" strokeWidth={2.5} />
              </div>

              {/* Right: Tab Count Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: isMobile ? "11px" : "15px",
                  height: isMobile ? "11px" : "15px",
                  borderRadius: "2.5px",
                  border: "1px solid rgba(255, 255, 255, 0.35)",
                  color: "rgba(255, 255, 255, 0.75)",
                  fontSize: isMobile ? "5.5px" : "8px",
                  fontWeight: 700
                }}
              >
                1
              </div>
            </div>

            {/* Authentic WatchParty Cinema Room Image (Centered in Native Proportions, Never Stretched!) */}
            <div
              style={{
                flex: 1,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 0,
                width: "100%",
                overflow: "hidden"
              }}
            >
              <img
                src="/images/cinematic-room-preview.png"
                alt="WatchParty Live Movie Screening with Chat"
                loading="lazy"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "100%",
                  objectFit: "contain",
                  display: "block"
                }}
              />

              {/* Ultra-subtle Screen Glass Reflection Sheen */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 32%, transparent 55%)",
                  pointerEvents: "none",
                  zIndex: 4
                }}
              />
            </div>

            {/* Bottom Navigation Pill */}
            <div
              style={{
                height: isMobile ? "10px" : "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: isMobile ? "2px" : "4px",
                zIndex: 3
              }}
            >
              <div
                style={{
                  width: isMobile ? "64px" : "100px",
                  height: isMobile ? "2px" : "3px",
                  background: "rgba(255, 255, 255, 0.50)",
                  borderRadius: "3px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.8)"
                }}
              />
            </div>
          </div>
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
