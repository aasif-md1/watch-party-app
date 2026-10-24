import React from "react";

/**
 * WatchParty Custom Brand Logo
 * Features:
 * - 3D Ultra-Modern Ribbon 'W' (Same render user loved, Play triangle completely removed)
 * - Single Crisp Squircle (Zero double borders, transparent background)
 * - 100% Identical to favicon.png & favicon.svg
 * - Typography wordmark: "Watch" (White) + "Party" (Netflix Red)
 */
export const BrandLogo = ({
  size = 36,
  showText = false,
  textSize = "1.25rem",
  className = "",
  style = {}
}) => {
  const numSize = typeof size === "number" ? size : parseInt(size, 10) || 36;

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
        userSelect: "none",
        ...style
      }}
    >
      {/* 3D App Icon Badge (Zero double borders, exact 3D render without play icon) */}
      <img
        src="/brand_logo_3d.png"
        alt="WatchParty Logo"
        width={numSize}
        height={numSize}
        style={{
          width: `${numSize}px`,
          height: `${numSize}px`,
          display: "block",
          flexShrink: 0,
          objectFit: "contain",
          filter: "drop-shadow(0 4px 12px rgba(229, 9, 20, 0.45))"
        }}
      />

      {/* Typography Wordmark */}
      {showText && (
        <span
          style={{
            fontSize: textSize,
            fontWeight: "800",
            letterSpacing: "-0.02em",
            fontFamily: "Inter, sans-serif",
            display: "inline-flex",
            alignItems: "center",
            lineHeight: 1
          }}
        >
          <span style={{ color: "#FFFFFF" }}>Watch</span>
          <span style={{ color: "#E50914", marginLeft: "1px" }}>Party</span>
        </span>
      )}
    </div>
  );
};
