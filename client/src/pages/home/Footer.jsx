import React from "react";
import { Link } from "react-router-dom";
import { BrandLogo } from "../../components/BrandLogo";

export const Footer = ({ onOpenInfoModal, isMobile }) => {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        padding: isMobile ? "32px 16px" : "36px 28px",
        background: "#08080A",
        color: "rgba(255, 255, 255, 0.6)",
        boxSizing: "border-box",
        width: "100%"
      }}
    >
      <div
        style={{
          maxWidth: "1504px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: "24px"
        }}
      >
        {/* Left: Logo + Divider + Tagline */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          {/* Logo Mark */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <BrandLogo size={28} showText={true} textSize="1.05rem" />
          </Link>

          {!isMobile && (
            <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>|</span>
          )}

          {/* Tagline */}
          <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.55)" }}>
            Watch YouTube Together, Anywhere.
          </span>
        </div>

        {/* Right: Working Dedicated Page Links & Social Icons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: isMobile ? "18px" : "24px",
            fontSize: "0.85rem"
          }}
        >
          {[
            { id: "about", label: "About" },
            { id: "privacy", label: "Privacy" },
            { id: "terms", label: "Terms" },
            { id: "contact", label: "Contact" }
          ].map((item) => (
            <Link
              key={item.id}
              to={"/" + item.id}
              style={{
                color: "rgba(255, 255, 255, 0.65)",
                fontSize: "0.85rem",
                fontWeight: "500",
                textDecoration: "none",
                transition: "color 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)")}
            >
              {item.label}
            </Link>
          ))}

          {/* Social Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "6px" }}>
            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{ color: "rgba(255, 255, 255, 0.65)", display: "flex" }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              style={{ color: "rgba(255, 255, 255, 0.65)", display: "flex" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              style={{ color: "rgba(255, 255, 255, 0.65)", display: "flex" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
