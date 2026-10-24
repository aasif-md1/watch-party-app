import React, { useState } from "react";
import { Plus } from "lucide-react";

export const FaqSection = ({ isHinglish, isMobile }) => {
  // Single-accordion mode: only one question open at a time, first one open by default
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  const faqs = [
    {
      num: "01",
      q: isHinglish
        ? "Kya WatchParty sach me bilkul free hai?"
        : "Is WatchParty completely free to use?",
      a: isHinglish
        ? "Haan, 100% free hai! WatchParty me koi bhi subscription charges, hidden fees ya credit card ki zaroorat nahi hai. Aap unlimited watch party rooms bana kar doston ke sath movies aur YouTube videos enjoy kar sakte hain."
        : "Yes, 100% free! WatchParty requires no subscriptions, credit cards, or trial periods. You can host unlimited watch parties and invite friends anytime."
    },
    {
      num: "02",
      q: isHinglish
        ? "Kya koi software ya chrome extension download karni hogi?"
        : "Do I or my friends need to install any extension?",
      a: isHinglish
        ? "Bilkul nahi! WatchParty seedha aapke browser (Chrome, Edge, Safari, Brave, Firefox) me chalta hai. Kisi ko bhi koi chrome extension ya software download karne ki bilkul zaroorat nahi hai. Bas ek invite link bhejo aur dost instant join karein."
        : "No downloads or browser extensions required! WatchParty runs natively in Chrome, Edge, Safari, Brave, and Firefox. Simply share your room link and friends join in seconds."
    },
    {
      num: "03",
      q: isHinglish
        ? "Real-time synchronized playback kaise kaam karta hai?"
        : "How does synchronized playback work across devices?",
      a: isHinglish
        ? "Jab bhi koi participant video ko play, pause ya seek karta hai, humara high-speed WebSocket engine instant sub-second signals bhejta hai. Sabhi viewers ka player exact same frame aur millisecond par lock rehta hai bina kisi delay ke."
        : "When anyone plays, pauses, or seeks, our high-speed WebSocket engine broadcasts instant signals to all connected viewers. Everyone's player stays locked to the exact same frame with sub-second accuracy."
    },
    {
      num: "04",
      q: isHinglish
        ? "Kaunse platforms aur video formats support hote hain?"
        : "Which streaming platforms and formats can we watch?",
      a: isHinglish
        ? "Direct YouTube URLs paste karke synchronized playback chala sakte hain. Iske alawa Screen Share mode ke zariye aap Netflix, Prime Video, Disney+, Hotstar, anime streaming sites ya local MKV/MP4 files ko HD video aur system audio ke sath stream kar sakte hain."
        : "Paste direct YouTube URLs for native synchronized viewing. For Netflix, Prime Video, Disney+, Hotstar, anime streaming sites, or local MKV/MP4 movie files, use Screen Share mode with crisp HD video and system audio."
    },
    {
      num: "05",
      q: isHinglish
        ? "Kya movie dekhte waqt voice call aur webcams on kar sakte hain?"
        : "Can we voice call or turn on webcams while watching?",
      a: isHinglish
        ? "Ji haan! WatchParty me built-in ultra-low latency WebRTC voice calling aur live webcams support hain. Saath me live emoji chat se reactions bhej sakte hain bina Discord ya Zoom khole."
        : "Yes! WatchParty features built-in low-latency WebRTC voice calling, live webcams, and instant emoji chat so you can talk, react, and see each other live without needing Discord or Zoom."
    },
    {
      num: "06",
      q: isHinglish
        ? "Ek room me kitne log join ho sakte hain aur privacy kaisi hai?"
        : "How many people can join and is the party private?",
      a: isHinglish
        ? "Friends ki koi strict limit nahi hai. Unique cryptographically random Room ID ke zariye sirf wahi dost join ho sakte hain jinhe aap invite karte hain. Google Firebase authentication se aapka session 100% safe aur private rehta hai."
        : "There is no strict participant limit. Every room is private with a unique cryptographically random ID accessible only to invited friends, backed by secure Google Firebase authentication."
    }
  ];

  return (
    <section
      id="faq"
      style={{
        padding: isMobile ? "36px 16px 54px" : "48px 28px 76px",
        maxWidth: "1560px",
        boxSizing: "border-box",
        margin: "0 auto",
        width: "100%"
      }}
    >
      {/* Header matching the reference mockup layout */}
      <div style={{ textAlign: "center", marginBottom: isMobile ? "24px" : "36px" }}>
        {/* Eyebrow: Red text + Red Line */}
        <div
          style={{
            display: "inline-flex",
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
            FAQ
          </span>
          <span
            style={{
              width: "24px",
              height: "2px",
              background: "#E50914",
              borderRadius: "1px"
            }}
          />
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
          {isHinglish ? "Aksar Poochhe Jane Wale Sawaal" : "Frequently Asked Questions"}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "0.94rem",
            color: "rgba(255, 255, 255, 0.65)",
            margin: "0 auto",
            maxWidth: "640px"
          }}
        >
          {isHinglish
            ? "WatchParty ke real-time sync, video streaming aur doston ke sath movie nights se judi sabhi baatein."
            : "Everything you need to know about synchronized playback, streaming movies, and inviting friends."}
        </p>
      </div>

      {/* Unified Luxury Cinema Accordion Console (Single seamless container) */}
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          background: "#101217",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.45)"
        }}
      >
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          const isLast = idx === faqs.length - 1;

          return (
            <div
              key={idx}
              style={{
                borderBottom: isLast ? "none" : "1px solid rgba(255, 255, 255, 0.07)",
                background: isOpen
                  ? "linear-gradient(90deg, rgba(229, 9, 20, 0.09) 0%, rgba(18, 20, 28, 0.98) 100%)"
                  : "transparent",
                borderLeft: isOpen ? "4px solid #E50914" : "4px solid transparent",
                transition: "all 0.22s ease"
              }}
            >
              {/* Question Row (Clickable) */}
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                style={{
                  width: "100%",
                  padding: isMobile ? "18px 18px" : "24px 30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "none",
                  border: "none",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: "16px"
                }}
                onMouseEnter={(e) => {
                  if (!isOpen) {
                    e.currentTarget.parentElement.style.background = "rgba(255, 255, 255, 0.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) {
                    e.currentTarget.parentElement.style.background = "transparent";
                  }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    minWidth: 0,
                    flex: 1
                  }}
                >
                  {/* Monospace Number */}
                  <span
                    style={{
                      fontFamily: "monospace, Inter, sans-serif",
                      fontSize: "0.88rem",
                      fontWeight: "800",
                      letterSpacing: "0.05em",
                      color: isOpen ? "#E50914" : "rgba(255, 255, 255, 0.4)",
                      transition: "color 0.2s ease",
                      flexShrink: 0
                    }}
                  >
                    {item.num}
                  </span>

                  {/* Question Text */}
                  <span
                    style={{
                      fontSize: isMobile ? "0.96rem" : "1.1rem",
                      fontWeight: "700",
                      color: "#FFFFFF",
                      lineHeight: 1.35,
                      letterSpacing: "-0.015em"
                    }}
                  >
                    {item.q}
                  </span>
                </div>

                {/* Rotating Plus Toggle */}
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: isOpen ? "#E50914" : "rgba(255, 255, 255, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease"
                  }}
                >
                  <Plus
                    size={16}
                    color={isOpen ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)"}
                  />
                </div>
              </button>

              {/* Answer Content */}
              {isOpen && (
                <div
                  style={{
                    padding: isMobile ? "0 18px 20px 48px" : "0 30px 24px 62px",
                    color: "rgba(255, 255, 255, 0.76)",
                    fontSize: isMobile ? "0.88rem" : "0.96rem",
                    lineHeight: 1.68
                  }}
                >
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
