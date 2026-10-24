import React from "react";
import { Play, Users } from "lucide-react";

export const CtaBanner = ({
  openCreateModal,
  openJoinModal,
  isHinglish,
  isMobile
}) => {
  return (
    <section
      style={{
        padding: isMobile ? "0 16px 60px" : "0 28px 85px",
        maxWidth: "1560px",
        boxSizing: "border-box",
        margin: "0 auto",
        width: "100%"
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: "16px",
          backgroundImage: "url('/images/cta_clean_bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: isMobile ? "36px 24px" : "44px 52px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: isMobile ? "28px" : "36px",
          boxShadow: "0 18px 50px rgba(184, 20, 31, 0.38)",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.12)"
        }}
      >
        {/* Left Column: Eyebrow + Heading + Subtitle */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "640px" }}>
          <div
            style={{
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "0.78rem",
              fontWeight: "800",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "8px"
            }}
          >
            {isHinglish ? "SAATH MEIN MOVIES DEKHNE KA WAQT" : "IT'S TIME TO WATCH TOGETHER"}
          </div>

          <h2
            className="font-heading"
            style={{
              fontSize: isMobile ? "1.85rem" : "2.35rem",
              fontWeight: "900",
              color: "#FFFFFF",
              lineHeight: 1.12,
              margin: 0,
              letterSpacing: "-0.02em"
            }}
          >
            Ready for a better watching experience?
          </h2>

          <p
            style={{
              margin: "10px 0 0 0",
              fontSize: "0.95rem",
              color: "rgba(255, 255, 255, 0.78)",
              lineHeight: 1.45
            }}
          >
            {isHinglish
              ? "Doston ke sath real-time sync me YouTube aur movies stream karo bina kisi download ya extension ke."
              : "Stream YouTube & movies in real-time sync with friends. 100% free, no downloads required."}
          </p>
        </div>

        {/* Right Column: Two Rounded Rectangle Buttons + Micro-caption */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: isMobile ? "stretch" : "center",
            gap: "10px",
            width: isMobile ? "100%" : "auto"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              gap: "12px",
              width: isMobile ? "100%" : "auto"
            }}
          >
            {/* White Solid Rounded Rectangle Button */}
            <button
              type="button"
              onClick={openCreateModal}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 26px",
                borderRadius: "8px",
                background: "#FFFFFF",
                border: "none",
                color: "#990012",
                fontSize: "0.96rem",
                fontWeight: "800",
                cursor: "pointer",
                boxShadow: "0 0 24px rgba(255, 255, 255, 0.45)",
                transition: "all 0.15s ease",
                width: isMobile ? "100%" : "auto",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(255, 255, 255, 0.65)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(255, 255, 255, 0.45)";
              }}
            >
              <Play size={15} fill="#990012" color="#990012" />
              <span>Create Watch Room</span>
            </button>

            {/* Dark Outlined Translucent Rounded Rectangle Button */}
            <button
              type="button"
              onClick={openJoinModal}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "8px",
                background: "rgba(0, 0, 0, 0.28)",
                border: "1px solid rgba(255, 255, 255, 0.35)",
                color: "#FFFFFF",
                fontSize: "0.96rem",
                fontWeight: "700",
                cursor: "pointer",
                backdropFilter: "blur(6px)",
                transition: "all 0.15s ease",
                width: isMobile ? "100%" : "auto",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.45)";
                e.currentTarget.style.borderColor = "#FFFFFF";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.28)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Users size={15} />
              <span>Join with Room ID</span>
            </button>
          </div>

          {/* Micro-caption matching mockup */}
          <span
            style={{
              color: "rgba(255, 255, 255, 0.72)",
              fontSize: "0.80rem",
              fontWeight: "500",
              textAlign: "center"
            }}
          >
            No signup hassle. Just good times.
          </span>
        </div>
      </div>
    </section>
  );
};
