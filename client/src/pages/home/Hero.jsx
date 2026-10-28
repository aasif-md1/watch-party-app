import React from "react";
import { Play, Users, Zap, Smartphone, Heart } from "lucide-react";

export const Hero = ({
  openCreateModal,
  openJoinModal,
  isHinglish = false,
  isMobile
}) => {
  return (
    <section id="home" className="hero-section">
      <style>{`
        .hero-section {
          position: relative;
          margin-top: 72px;
          background-color: #0A0B0E;
          background-image: url('/images/hero_perfect_canvas.jpg?v=2');
          background-repeat: no-repeat;
          background-position: right center;
          background-size: cover;
          height: calc(100vh - 72px);
          min-height: 560px;
          max-height: 840px;
          display: flex;
          align-items: center;
          padding: 20px 56px;
          overflow: hidden;
          box-sizing: border-box;
        }
        .hero-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #0A0B0E 0%, rgba(10, 11, 14, 0.94) 40%, rgba(10, 11, 14, 0.45) 65%, transparent 100%);
          pointer-events: none;
          z-index: 1;
        }
        .hero-content {
          max-width: 520px;
          position: relative;
          z-index: 2;
        }
        .hero-title {
          font-size: clamp(2.4rem, 3.4vw, 3.5rem);
          font-weight: 900;
          line-height: 1.12;
          margin: 0 0 18px 0;
          letter-spacing: -0.03em;
        }
        .hero-desc {
          font-size: clamp(0.95rem, 1.15vw, 1.1rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.72);
          margin: 0 0 32px 0;
          max-width: 480px;
        }
        .hero-btn-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
          margin-bottom: 34px;
        }
        .hero-trust-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 28px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.92rem;
          font-weight: 600;
        }

        /* Large Tablets / Small Laptops (1024px to 1200px) */
        @media (max-width: 1200px) {
          .hero-section {
            padding: 20px 36px;
            background-position: right -60px center;
          }
          .hero-content {
            max-width: 460px;
          }
          .hero-scrim {
            background: linear-gradient(90deg, #0A0B0E 0%, rgba(10, 11, 14, 0.96) 48%, rgba(10, 11, 14, 0.5) 75%, transparent 100%);
          }
          .hero-title {
            font-size: 2.6rem;
          }
        }

        /* Tablets Landscape & Portrait (768px to 1024px) */
        @media (max-width: 1024px) {
          .hero-section {
            height: auto;
            min-height: 520px;
            max-height: none;
            padding: 44px 28px 52px;
            background-position: right -100px center;
          }
          .hero-scrim {
            background: linear-gradient(90deg, #0A0B0E 0%, rgba(10, 11, 14, 0.97) 54%, rgba(10, 11, 14, 0.65) 78%, rgba(10, 11, 14, 0.3) 100%);
          }
          .hero-content {
            max-width: 440px;
          }
          .hero-title {
            font-size: 2.3rem;
          }
          .hero-desc {
            max-width: 420px;
            font-size: 0.96rem;
          }
        }

        /* Mobile & Small Tablets (<= 820px) */
        @media (max-width: 820px) {
          .hero-section {
            height: auto;
            min-height: auto;
            max-height: none;
            padding: 36px 18px 44px;
            background-position: center top;
            align-items: flex-start;
          }
          .hero-scrim {
            background: linear-gradient(180deg, rgba(10, 11, 14, 0.95) 0%, rgba(10, 11, 14, 0.88) 50%, rgba(10, 11, 14, 0.97) 100%);
          }
          .hero-content {
            max-width: 100%;
            text-align: center;
          }
          .hero-title {
            font-size: clamp(2rem, 7vw, 2.5rem);
          }
          .hero-desc {
            max-width: 100%;
            margin: 0 auto 28px;
            font-size: 0.92rem;
          }
          .hero-btn-row {
            justify-content: center;
          }
          .hero-btn-row button {
            width: 100% !important;
          }
          .hero-trust-row {
            justify-content: center;
            gap: 16px;
            font-size: 0.84rem;
          }
        }
      `}</style>

      {/* Dark Scrim protecting text from TV on all screens */}
      <div className="hero-scrim" aria-hidden="true" />

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
        <div className="hero-content">
          {/* Headline */}
          <h1 className="font-heading hero-title">
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

          {/* Subtitle description */}
          <p className="hero-desc">
            {isHinglish
              ? "YouTube videos sync karein ya screen share karke movies aur shows doston ke saath live dekhein. Real-time chat, live reactions, aur instant playback — 100% free."
              : "Stream YouTube videos or share your screen in HD to watch movies, anime, and shows together. Sync playback in real-time, chat live, and react with friends — 100% free, private, and instant."}
          </p>

          {/* Action Buttons Row */}
          <div className="hero-btn-row">
            <button
              type="button"
              onClick={openCreateModal}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "11px",
                padding: "14px 28px",
                borderRadius: "9px",
                background: "linear-gradient(135deg, #E50914 0%, #B80710 100%)",
                border: "none",
                color: "#FFFFFF",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(229, 9, 20, 0.45)",
                transition: "all 0.15s ease"
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
              <Play size={17} fill="#FFFFFF" />
              <span>Create Watch Room</span>
            </button>

            <button
              type="button"
              onClick={openJoinModal}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "11px",
                padding: "14px 26px",
                borderRadius: "9px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#FFFFFF",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.15s ease"
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
              <Users size={17} />
              <span>Join with Room ID</span>
            </button>
          </div>

          {/* Row of 3 Trust Badges */}
          <div className="hero-trust-row">
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
