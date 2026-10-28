import React from "react";

/**
 * WatchParty Official Brand Logo
 * Extracted directly from official brand sheet (Watch Party.png)
 * - logo_navbar.png: Full horizontal primary logo (Symbol + "Watch Party" wordmark) with transparent background
 * - logo_symbol.png: Ribbon play triangle symbol only with transparent background
 * - logo_footer.png: Muted version for footer with transparent background
 */
export const BrandLogo = ({
  size = 36,
  showText = false,
  variant = "default", // "default" | "footer" | "symbol"
  className = "",
  style = {}
}) => {
  const numSize = typeof size === "number" ? size : parseInt(size, 10) || 36;

  // If explicit symbol variant or showText is false, render symbol only
  if (variant === "symbol" || (!showText && variant !== "footer")) {
    return (
      <div
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
          userSelect: "none",
          ...style
        }}
      >
        <img
          src="/logo_symbol.png"
          alt="WatchParty Symbol"
          width={numSize}
          height={numSize}
          style={{
            width: `${numSize}px`,
            height: `${numSize}px`,
            display: "block",
            flexShrink: 0,
            objectFit: "contain",
            filter: "drop-shadow(0 2px 10px rgba(255, 16, 40, 0.35))"
          }}
        />
      </div>
    );
  }

  // Footer muted logo
  if (variant === "footer") {
    return (
      <div
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
          userSelect: "none",
          ...style
        }}
      >
        <img
          src="/logo_footer.png"
          alt="WatchParty Logo"
          height={numSize}
          style={{
            height: `${numSize}px`,
            width: "auto",
            display: "block",
            flexShrink: 0,
            objectFit: "contain"
          }}
        />
      </div>
    );
  }

  // Default: Primary Navbar Logo (Horizontal with Symbol + "Watch Party" official typography)
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        textDecoration: "none",
        userSelect: "none",
        ...style
      }}
    >
      <img
        src="/logo_navbar.png"
        alt="WatchParty Logo"
        height={numSize}
        style={{
          height: `${numSize}px`,
          width: "auto",
          display: "block",
          flexShrink: 0,
          objectFit: "contain"
        }}
      />
    </div>
  );
};
