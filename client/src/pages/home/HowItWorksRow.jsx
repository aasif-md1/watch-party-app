import React from "react";
import { motion } from "framer-motion";
import { Globe, Play, MonitorPlay } from "lucide-react";
import { ContentRow } from "./ContentRow";

const CARD_BACKGROUNDS = [
  "radial-gradient(circle at 90% 10%, rgba(229, 9, 20, 0.16) 0%, #151515 70%)",
  "linear-gradient(145deg, #181818 0%, #101010 100%)",
  "radial-gradient(circle at 10% 90%, rgba(229, 9, 20, 0.12) 0%, #161616 80%)",
  "linear-gradient(160deg, #1b1414 0%, #0e0e0e 100%)",
  "radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.05) 0%, #141414 75%)",
  "linear-gradient(135deg, #171719 0%, #101012 100%)",
  "radial-gradient(circle at 20% 80%, rgba(229, 9, 20, 0.14) 0%, #151515 70%)"
];

export const HowItWorksRow = ({
  helpRef,
  content,
  lang,
  helpMode,
  setHelpMode,
  isHinglish,
  setIsHinglish,
  isMobile
}) => {
  const currentContent = content[lang][helpMode];
  const features = currentContent.features;
  const steps = currentContent.steps;

  // Combine features and sequential steps into one continuous row with Big Number Poster language
  const allCards = [
    ...features.map((f, i) => ({ type: "feature", data: f, id: `feat-${i}` })),
    ...steps.map((s, i) => ({ type: "step", data: s, id: `step-${i}` }))
  ];

  return (
    <div ref={helpRef}>
      <ContentRow
        title={currentContent.sectionTitle}
        isMobile={isMobile}
        rightElement={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Mode Switcher: YouTube / Screen Share */}
            <div
              style={{
                display: "flex",
                background: "#181818",
                borderRadius: "4px",
                padding: "2px",
                border: "1px solid rgba(255, 255, 255, 0.15)"
              }}
            >
              {[
                { key: "youtube", label: "YouTube", icon: Play },
                { key: "screenshare", label: "Screen Share", icon: MonitorPlay }
              ].map((m) => {
                const isActive = helpMode === m.key;
                const Icon = m.icon;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setHelpMode(m.key)}
                    style={{
                      padding: "5px 10px",
                      background: isActive ? "#E50914" : "transparent",
                      border: "none",
                      borderRadius: "3px",
                      color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <Icon size={12} fill={isActive && m.key === "youtube" ? "#FFFFFF" : "none"} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => setIsHinglish(!isHinglish)}
              style={{
                padding: "5px 10px",
                background: "#181818",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "4px",
                color: "#FFFFFF",
                fontSize: "0.75rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <Globe size={13} style={{ color: "#E50914" }} />
              <span>{content[lang].toggleLabel}</span>
            </button>
          </div>
        }
      >
        {allCards.map((card, idx) => {
          const numStr = String(idx + 1).padStart(2, "0");
          const isFeatured = idx === 0 || idx === 3;
          const bg = CARD_BACKGROUNDS[idx % CARD_BACKGROUNDS.length];
          const isRedTint = idx % 2 === 0;

          return (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.04, y: -6 }}
              transition={{ duration: 0.2 }}
              style={{
                minWidth: isMobile ? "260px" : isFeatured ? "340px" : "295px",
                maxWidth: isMobile ? "260px" : isFeatured ? "340px" : "295px",
                flex: isMobile ? "0 0 260px" : isFeatured ? "0 0 340px" : "0 0 295px",
                height: isMobile ? "250px" : "270px",
                background: bg,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                scrollSnapAlign: "start",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.7)",
                transition: "border-color 0.25s ease, box-shadow 0.25s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(229, 9, 20, 0.7)";
                e.currentTarget.style.boxShadow = "0 16px 36px rgba(229, 9, 20, 0.28)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.7)";
              }}
            >
              {/* Giant Poster Number in Background */}
              <div
                aria-hidden="true"
                className="font-display"
                style={{
                  position: "absolute",
                  top: "-18px",
                  right: "-6px",
                  fontSize: isMobile ? "7.5rem" : "9rem",
                  fontWeight: "900",
                  lineHeight: 1,
                  color: isRedTint ? "rgba(229, 9, 20, 0.13)" : "rgba(255, 255, 255, 0.07)",
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: 1
                }}
              >
                {numStr}
              </div>

              {/* Bottom-Aligned Title & Description */}
              <div style={{ position: "relative", zIndex: 2 }}>
                {/* Subtle red accent bar */}
                <div
                  style={{
                    width: "28px",
                    height: "3px",
                    background: "#E50914",
                    borderRadius: "2px",
                    marginBottom: "12px"
                  }}
                />

                <h3
                  style={{
                    fontSize: isMobile ? "1.05rem" : "1.18rem",
                    fontWeight: "800",
                    color: "#FFFFFF",
                    margin: "0 0 6px 0",
                    lineHeight: 1.25,
                    wordBreak: "break-word"
                  }}
                >
                  {card.data.title}
                </h3>

                <p
                  style={{
                    fontSize: "0.82rem",
                    lineHeight: 1.5,
                    color: "rgba(255, 255, 255, 0.72)",
                    margin: 0,
                    wordBreak: "break-word"
                  }}
                >
                  {card.data.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </ContentRow>
    </div>
  );
};
