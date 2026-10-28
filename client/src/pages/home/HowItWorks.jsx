import React, { useState } from "react";
import { Play, Monitor } from "lucide-react";

export const HowItWorks = ({ isHinglish, setIsHinglish, isMobile }) => {
  // 0 = YouTube Sync, 1 = Screen Share & Movies
  const [mode, setMode] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setAnimating(true);
    setTimeout(() => {
      setMode(newMode);
      setAnimating(false);
    }, 140);
  };

  // 4 Workflow steps for YouTube Sync (how to watch YouTube together)
  const youtubeSteps = [
    {
      num: "01",
      isAccentRed: true,
      title: isHinglish ? "YouTube Link Paste Karo" : "Paste YouTube Link",
      desc: isHinglish
        ? "Koi bhi YouTube video link paste karo. Play, pause ya seek — sabhi doston ka playback perfect sync rehta hai."
        : "Add any YouTube video you want to watch together. Play, pause, or seek — everyone follows in real time."
    },
    {
      num: "02",
      isAccentRed: false,
      title: isHinglish ? "Room Banao ya Join Karo" : "Create or Join a Room",
      desc: isHinglish
        ? "Unique Room ID ke saath room create karo aur doston ko direct link bhej kar invite karo."
        : "Create a room with a unique ID and share it. Friends join your watch party instantly with one click."
    },
    {
      num: "03",
      isAccentRed: true,
      title: isHinglish ? "Synchronized Playback" : "Synchronized Playback",
      desc: isHinglish
        ? "Sub-second sync engine har viewer ko exact same frame par lock rakhta hai bina kisi lag ke."
        : "Watch YouTube videos together in perfect sync. Sub-second engine keeps every viewer locked to the same second."
    },
    {
      num: "04",
      isAccentRed: false,
      title: isHinglish ? "Live Chat & Reactions" : "Live Chat & Reactions",
      desc: isHinglish
        ? "Video dekhte huye doston ke sath real-time chat karo, funny reactions aur emojis share karo."
        : "Chat with your friends while watching. Share reactions, comments, and moments alongside the video."
    }
  ];

  // 4 Workflow steps for Screen Share / Movie Nights (how to stream movies)
  const screenShareSteps = [
    {
      num: "01",
      isAccentRed: true,
      title: isHinglish ? "Screen Share Mode Chuno" : "Select Screen Share",
      desc: isHinglish
        ? "Room banate waqt Screen Share mode select karo taaki browser tab, video player ya desktop app stream kar sako."
        : "Choose Screen Share mode when creating your room to stream any browser tab, movie, or desktop app."
    },
    {
      num: "02",
      isAccentRed: false,
      title: isHinglish ? "Netflix, Prime ya Movie Stream" : "Stream Any Movie or Tab",
      desc: isHinglish
        ? "Netflix, Prime Video, Disney+ ya local video files HD video aur clear system audio ke saath stream karo."
        : "Stream Netflix, Prime Video, Disney+, or local MKV/MP4 files with crisp 1080p and native system audio."
    },
    {
      num: "03",
      isAccentRed: true,
      title: isHinglish ? "Doston ko Invite Karo" : "Invite Friends with Link",
      desc: isHinglish
        ? "Apna party invite link share karo — dost bina kisi software download ke seedha browser se join karein."
        : "Send your party invite link — friends join in HD from any modern browser with zero downloads."
    },
    {
      num: "04",
      isAccentRed: false,
      title: isHinglish ? "Watch, Call & Chat" : "Watch, Call & Chat",
      desc: isHinglish
        ? "Webcam on karo, low-latency voice call par baatein karo aur real cinema theatre jaisa maza lo."
        : "Turn on live webcams, chat over low-latency voice, and enjoy full cinema ambience right from your sofa."
    }
  ];

  const currentSteps = mode === 0 ? youtubeSteps : screenShareSteps;

  return (
    <section
      id="how-it-works"
      style={{
        padding: isMobile ? "36px 16px 54px" : "40px 28px 68px",
        maxWidth: "1560px",
        boxSizing: "border-box",
        margin: "0 auto",
        width: "100%"
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "flex-end",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "32px"
        }}
      >
        <div>
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px"
            }}
          >
            <span
              style={{
                color: "#E50914",
                fontSize: "0.78rem",
                fontWeight: "800",
                letterSpacing: "0.14em",
                textTransform: "uppercase"
              }}
            >
              HOW IT WORKS
            </span>
            <span style={{ width: "24px", height: "2px", background: "#E50914", borderRadius: "1px" }} />
          </div>

          {/* Heading */}
          <h2
            className="font-heading"
            style={{
              fontSize: isMobile ? "1.9rem" : "2.45rem",
              fontWeight: "900",
              color: "#FFFFFF",
              margin: "0 0 8px 0",
              letterSpacing: "-0.025em"
            }}
          >
            {isHinglish ? "Shuru Karein Seconds Mein" : "Get Started in Seconds"}
          </h2>

          <p
            style={{
              fontSize: "0.94rem",
              color: "rgba(255, 255, 255, 0.65)",
              margin: 0
            }}
          >
            {mode === 0
              ? (isHinglish
                  ? "Bohot aasan hai. Bas 4 easy steps aur aap YouTube saath dekhne ke liye ready hain."
                  : "It's simple. Just 4 easy steps and you're ready to stream together in sync.")
              : (isHinglish
                  ? "Screen Share party ke 4 aasan steps — movies direct doston ke sath dekhein."
                  : "Screen share mode in 4 easy steps — stream movies live with friends.")}
          </p>
        </div>

        {/* Right Header Area: Mode Toggle Pill + Mockup-Accurate Nav Arrows */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Mode Selector */}
          <div
            style={{
              display: "inline-flex",
              background: "rgba(255, 255, 255, 0.05)",
              padding: "4px",
              borderRadius: "30px",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <button
              type="button"
              onClick={() => switchMode(0)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "20px",
                background: mode === 0 ? "#E50914" : "transparent",
                border: "none",
                color: "#FFFFFF",
                fontSize: "0.80rem",
                fontWeight: mode === 0 ? "700" : "500",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <Play size={12} fill={mode === 0 ? "#FFFFFF" : "rgba(255,255,255,0.7)"} />
              <span>YouTube Sync</span>
            </button>

            <button
              type="button"
              onClick={() => switchMode(1)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "20px",
                background: mode === 1 ? "#E50914" : "transparent",
                border: "none",
                color: "#FFFFFF",
                fontSize: "0.80rem",
                fontWeight: mode === 1 ? "700" : "500",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <Monitor size={13} />
              <span>Screen Share</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .hiw-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          justify-content: center;
          gap: 14px;
          padding-bottom: 18px;
        }
        @media (max-width: 1024px) {
          .hiw-steps-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
            overflow-x: visible !important;
          }
        }
        @media (max-width: 640px) {
          .hiw-steps-grid {
            grid-template-columns: repeat(4, 220px) !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            justify-content: flex-start !important;
            -webkit-overflow-scrolling: touch !important;
          }
        }
      `}</style>

      {/* 4 Step Cards — Proportions matched to reference screenshot */}
      <div
        className="no-scrollbar hiw-steps-grid"
        style={{
          opacity: animating ? 0.15 : 1,
          transform: animating ? "translateY(6px)" : "translateY(0)",
          transition: "opacity 0.15s ease, transform 0.15s ease"
        }}
      >
        {currentSteps.map((step, idx) => {
          const isHovered = hoveredIdx === idx;
          const showRedNumber = step.isAccentRed || isHovered;

          return (
            <div
              key={`${mode}-${idx}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                /* Warm charcoal from screenshot: rgb(28,25,24) to rgb(24,25,25) */
                background: "linear-gradient(180deg, #1C1918 0%, #181919 100%)",
                /* Barely-visible warm border: rgb(38,30,31) */
                border: isHovered
                  ? "1px solid rgba(229, 9, 20, 0.45)"
                  : "1px solid #261E1F",
                borderRadius: "10px",
                padding: "0 14px 16px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                /* Landscape rectangle: 183w x 118h (slightly shrunk from bottom) */
                aspectRatio: "183 / 118",
                position: "relative",
                overflow: "hidden",
                scrollSnapAlign: "start",
                /* 3D shadow dropping to near-black */
                boxShadow: isHovered
                  ? "0 18px 36px -6px rgba(0, 0, 0, 0.95), 0 8px 16px -4px rgba(229, 9, 20, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
                  : "0 14px 28px -6px rgba(0, 0, 0, 0.9), 0 6px 12px -4px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
                transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              {/* Subtle red ambient glow for accent cards */}
              {showRedNumber && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "55%",
                    height: "50%",
                    background: "radial-gradient(circle at 80% 20%, rgba(229, 9, 20, 0.12) 0%, rgba(180, 10, 20, 0.04) 50%, transparent 70%)",
                    filter: "blur(12px)",
                    pointerEvents: "none",
                    zIndex: 0
                  }}
                />
              )}

              {/* HUGE Number — spans ~65% of card height, top-right */}
              {/* Red: rgb(71,21,24) = #471518 | Grey: rgb(40,40,40) = #282828 */}
              <span
                style={{
                  position: "absolute",
                  top: "-3%",
                  right: isMobile ? "2px" : "6px",
                  fontSize: isMobile ? "6.5rem" : "8.5rem",
                  fontWeight: "400",
                  lineHeight: "0.85",
                  fontFamily: "'Bebas Neue', 'Inter', system-ui, sans-serif",
                  color: showRedNumber ? "#471518" : "#282828",
                  letterSpacing: "0em",
                  userSelect: "none",
                  pointerEvents: "none",
                  transition: "color 0.2s ease",
                  zIndex: 1
                }}
              >
                {step.num}
              </span>

              {/* Red accent bar — 13px wide, 2px tall, #E50914 */}
              <div
                style={{
                  width: "13px",
                  height: "2px",
                  background: "#E50914",
                  borderRadius: "0",
                  marginBottom: "8px",
                  position: "relative",
                  zIndex: 2
                }}
              />

              {/* Title — bold white */}
              <h3
                style={{
                  fontSize: isMobile ? "0.88rem" : "0.95rem",
                  fontWeight: "700",
                  color: "#FFFFFF",
                  margin: "0 0 5px 0",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                  position: "relative",
                  zIndex: 2
                }}
              >
                {step.title}
              </h3>

              {/* Description — muted grey */}
              <p
                style={{
                  fontSize: "0.72rem",
                  lineHeight: 1.45,
                  color: "rgba(255, 255, 255, 0.5)",
                  margin: 0,
                  position: "relative",
                  zIndex: 2
                }}
              >
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
