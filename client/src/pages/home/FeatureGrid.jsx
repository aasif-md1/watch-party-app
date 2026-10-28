import React from "react";
import { RefreshCw, MessageSquare, Users, ShieldCheck } from "lucide-react";

export const FeatureGrid = ({ isHinglish, isMobile }) => {
  const features = [
    {
      icon: <RefreshCw size={18} />,
      title: isHinglish ? "Synchronized Playback" : "Synchronized Playback",
      desc: isHinglish
        ? "Play, pause, ya seek karo — sabhi doston ka sync hamesha perfect rehta hai."
        : "Play, pause, or seek — everyone stays in sync."
    },
    {
      icon: <MessageSquare size={18} />,
      title: isHinglish ? "Live Chat" : "Live Chat",
      desc: isHinglish
        ? "Video dekhte waqt apne reactions, thoughts aur memes real-time share karo."
        : "Share reactions, thoughts, and memes in real time."
    },
    {
      icon: <Users size={18} />,
      title: isHinglish ? "Private Rooms" : "Private Rooms",
      desc: isHinglish
        ? "Apna unique room create karo aur doston ko link bhej kar invite karo."
        : "Create a room with a unique ID and invite your friends."
    },
    {
      icon: <ShieldCheck size={18} />,
      title: isHinglish ? "Safe & Secure" : "Safe & Secure",
      desc: isHinglish
        ? "Google Sign-In ke saath personalized aur secure watch party experience."
        : "Sign in with Google for a personalized and private experience."
    }
  ];

  return (
    <section
      id="features"
      style={{
        padding: isMobile ? "24px 16px 40px" : "28px 28px 48px",
        maxWidth: "1560px",
        boxSizing: "border-box",
        margin: "0 auto",
        width: "100%"
      }}
    >
      <style>{`
        .feature-grid-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .feature-grid-row {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }
        }
        @media (max-width: 640px) {
          .feature-grid-row {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
      <div className="feature-grid-row">
        {features.map((feat, idx) => (
          <div
            key={idx}
            style={{
              background: "#111318",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: "12px",
              padding: "22px 18px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "16px",
              transition: "border-color 0.2s ease, transform 0.2s ease",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(229, 9, 20, 0.4)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.07)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Circular Red-Tinted Badge with Icon on the Left */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(229, 9, 20, 0.12)",
                border: "1px solid rgba(229, 9, 20, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E50914",
                flexShrink: 0
              }}
            >
              {feat.icon}
            </div>

            {/* Title & Description on the Right */}
            <div style={{ minWidth: 0, flex: 1 }}>
              <h3
                style={{
                  fontSize: "0.96rem",
                  fontWeight: "800",
                  color: "#FFFFFF",
                  margin: "0 0 4px 0",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2
                }}
              >
                {feat.title}
              </h3>
              <p
                style={{
                  fontSize: "0.80rem",
                  lineHeight: 1.45,
                  color: "rgba(255, 255, 255, 0.58)",
                  margin: 0
                }}
              >
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
