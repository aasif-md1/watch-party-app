import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Shield,
  Radio,
  Tv,
  ArrowRight,
  ChevronRight,
  Cpu,
  Zap,
  Lock,
  Globe
} from "lucide-react";
import { Navbar } from "./home/Navbar";
import { Footer } from "./home/Footer";
import { useAuth } from "../hooks/useAuth";

export default function About() {
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const realSpecs = [
    {
      icon: <Globe size={22} style={{ color: "#FF1028" }} />,
      title: "100% Web-Native",
      desc: "Runs directly in modern browsers (Chrome, Edge, Firefox, Safari). Zero browser extensions or desktop software required."
    },
    {
      icon: <Zap size={22} style={{ color: "#FF1028" }} />,
      title: "Sub-Second WebSocket Sync",
      desc: "Low-latency Socket.io event distribution relays play, pause, seek, and playback rate actions in real time."
    },
    {
      icon: <Tv size={22} style={{ color: "#FF1028" }} />,
      title: "Direct YouTube API",
      desc: "Official Google YouTube IFrame embeds. Zero pirated streaming — creators receive 100% of their views and ad impressions."
    },
    {
      icon: <Lock size={22} style={{ color: "#FF1028" }} />,
      title: "Volatile In-Memory Privacy",
      desc: "Chat messages and room states live strictly in server RAM. When a room disbands, everything is permanently purged from memory."
    }
  ];

  const comparisonProblems = [
    {
      title: "The Extension Headache",
      sub: "Teleparty, Scener & Browser Add-ons",
      bad: "Constantly breaks with Chrome updates, requires invasive permissions to read all your browsing data, and forces every single friend to install and configure software before watching.",
      good: "WatchParty is a pure web link. Send the URL to a friend, they click it, and they're watching with you in 2 seconds. Nothing to install, nothing to break."
    },
    {
      title: "The Bandwidth & Quality Trap",
      sub: "Discord / Zoom Screen Sharing",
      bad: "Screen sharing a video over Discord strains the host's upload bandwidth, drops resolution down to 720p or 30fps, and causes terrible audio desync.",
      good: "In YouTube Mode, every participant streams full 1080p/4K directly from Google's edge servers. The host only sends tiny 50-byte sync signals, using virtually zero upload bandwidth."
    },
    {
      title: "The Mandatory Sign-Up Wall",
      sub: "Legacy Social Video Sites",
      bad: "Forcing friends to create an account, verify emails, remember passwords, and enter personal details just to watch a quick 10-minute video together.",
      good: "Guests can jump into any room with just a nickname — no signup required. Optional 1-click Google Sign-In is available for those who want their avatar and room ownership preserved."
    }
  ];


  return (
    <div style={{ background: "#080809", color: "#FFFFFF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>About WatchParty — Real-Time Synchronized Cinema</title>
        <meta
          name="description"
          content="Learn about WatchParty: our mission, the real WebSocket sync engine, peer-to-peer WebRTC screen sharing, and how we engineered a zero-install social cinema platform."
        />
      </Helmet>

      {/* Shared Navbar */}
      <Navbar
        user={user}
        authLoading={authLoading}
        signOut={signOut}
        openCreateModal={() => { window.location.href = "/room?action=create"; }}
        isMobile={false}
      />

      <main style={{ flex: 1, paddingTop: "105px", paddingBottom: "90px" }}>
        {/* Full-Width Header Hero Section */}
        <section
          style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
            background: "linear-gradient(180deg, rgba(255, 16, 40, 0.05) 0%, rgba(8, 8, 9, 0) 100%)",
            padding: "36px 0 54px 0"
          }}
        >
          <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 36px" }}>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", marginBottom: "24px" }}>
              <Link to="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link>
              <ChevronRight size={13} />
              <span style={{ color: "#FF1028", fontWeight: "600" }}>About WatchParty</span>
            </div>

            <div style={{ maxWidth: "980px" }}>

              <h1
                className="font-heading"
                style={{
                  fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                  fontWeight: "900",
                  lineHeight: 1.12,
                  letterSpacing: "-0.03em",
                  margin: "0 0 20px 0"
                }}
              >
                Engineered for Shared Moments,{" "}
                <span style={{ background: "linear-gradient(90deg, #FF1028 0%, #FF5A78 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Anywhere on the Web.
                </span>
              </h1>

              <p style={{ fontSize: "1.12rem", lineHeight: 1.7, color: "rgba(255,255,255,0.75)", margin: 0 }}>
                WatchParty was built out of a simple, modern frustration: watching a video with friends online shouldn't require downloading buggy browser extensions, buying monthly subscriptions, or tolerating laggy Discord screen shares. We engineered a pure, web-native synchronization platform where anyone can create a room, share a link, and watch together in real time.
              </p>
            </div>
          </div>
        </section>

        {/* Outer Standard Layout Container */}
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "52px 36px 0 36px" }}>

          {/* Real Architectural Specs Strip */}
          <section style={{ marginBottom: "68px" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: "16px" }}>
              Core Technical Foundation
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px"
              }}
            >
              {realSpecs.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#0E0E12",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    transition: "border-color 0.2s ease"
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: "rgba(255, 16, 40, 0.1)",
                      border: "1px solid rgba(255, 16, 40, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "750", color: "#FFFFFF" }}>
                    {item.title}
                  </div>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "rgba(255, 255, 255, 0.65)", margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* The Real Problem We Solved (Honest Comparison) */}
          <section style={{ marginBottom: "80px" }}>
            <div style={{ marginBottom: "32px", maxWidth: "800px" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#FF1028", marginBottom: "8px" }}>
                Why We Built It
              </div>
              <h2 className="font-heading" style={{ fontSize: "2.1rem", fontWeight: "800", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
                The Real Problems with Other Solutions
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.6 }}>
                Every existing watch party tool comes with unnecessary friction. Here is why WatchParty was engineered with a completely different approach:
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                gap: "24px"
              }}
            >
              {comparisonProblems.map((prob, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#0E0E12",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px"
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 4px 0" }}>
                      {prob.title}
                    </h3>
                    <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", fontWeight: "600" }}>
                      {prob.sub}
                    </div>
                  </div>

                  <div style={{ background: "rgba(255, 255, 255, 0.03)", borderLeft: "3px solid #FF5252", padding: "14px 16px", borderRadius: "0 8px 8px 0" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#FF5252", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                      Common Problem
                    </div>
                    <p style={{ margin: 0, fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>
                      {prob.bad}
                    </p>
                  </div>

                  <div style={{ background: "rgba(34, 197, 94, 0.05)", borderLeft: "3px solid #22c55e", padding: "14px 16px", borderRadius: "0 8px 8px 0" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                      WatchParty Architecture
                    </div>
                    <p style={{ margin: 0, fontSize: "0.88rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.55 }}>
                      {prob.good}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Under The Hood: How It Actually Works */}
          <section style={{ marginBottom: "80px" }}>
            <div style={{ marginBottom: "36px", maxWidth: "860px" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#FF1028", marginBottom: "8px" }}>
                Deep Dive
              </div>
              <h2 className="font-heading" style={{ fontSize: "2.1rem", fontWeight: "800", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
                How Playback Synchronization Actually Works
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.6 }}>
                There is no magic or video cloning involved. Here is an honest, developer-level breakdown of the mathematical sync loop and media pipeline:
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="about-tech-grid">
              {/* Tech 1 */}
              <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", color: "#FF1028" }}>
                  <Radio size={20} />
                  <span style={{ fontWeight: "800", fontSize: "1.15rem", color: "#FFFFFF" }}>1. WebSocket Event Protocol</span>
                </div>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "rgba(255,255,255,0.72)", margin: 0 }}>
                  Whenever a participant pauses, resumes, or skips to an epic moment, that exact command is instantly broadcast to all room members in milliseconds over bi-directional WebSocket connections, keeping everyone locked in the exact same frame.
                </p>
              </div>

              {/* Tech 2 */}
              <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", color: "#FF1028" }}>
                  <Cpu size={20} />
                  <span style={{ fontWeight: "800", fontSize: "1.15rem", color: "#FFFFFF" }}>2. Smart Drift Compensation</span>
                </div>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "rgba(255,255,255,0.72)", margin: "0 0 14px 0" }}>
                  Natural internet jitter causes tiny millisecond differences between viewers. A naive sync app would constantly force <code style={{ color: "#FF1028" }}>seekTo()</code>, causing unbearable audio stutter.
                </p>
                <div style={{ background: "#060608", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "14px", fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", marginBottom: "14px" }}>
                  <strong>Drift Logic:</strong> If local playback differs from the broadcast by <strong>&lt; 1.5 seconds</strong>, playback continues naturally without pausing. If drift exceeds 1.5s, the player seamlessly snaps to the target timestamp.
                </div>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(255,255,255,0.6)", margin: 0 }}>
                  This guarantees buttery-smooth, stutter-free viewing even on varying mobile or Wi-Fi networks.
                </p>
              </div>

              {/* Tech 3 */}
              <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", color: "#FF1028" }}>
                  <Tv size={20} />
                  <span style={{ fontWeight: "800", fontSize: "1.15rem", color: "#FFFFFF" }}>3. Dual-Engine Viewing Architecture</span>
                </div>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "rgba(255,255,255,0.72)", margin: "0 0 12px 0" }}>
                  WatchParty supports two completely distinct media synchronization modes:
                </p>
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.88rem", color: "rgba(255,255,255,0.7)", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <li><strong>YouTube IFrame Embed API:</strong> Coordinates synchronized playback of any public YouTube video. Video streams directly from Google's edge CDN, protecting creator ad revenue and rights.</li>
                  <li><strong>WebRTC Screen Share:</strong> Captures any application window, browser tab, or desktop screen with hardware-accelerated audio pass-through, encrypted end-to-end via DTLS/SRTP.</li>
                </ul>
              </div>

              {/* Tech 4 */}
              <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", color: "#FF1028" }}>
                  <Shield size={20} />
                  <span style={{ fontWeight: "800", fontSize: "1.15rem", color: "#FFFFFF" }}>4. Zero-Storage Ephemeral Rooms</span>
                </div>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "rgba(255,255,255,0.72)", margin: "0 0 12px 0" }}>
                  Unlike messaging apps or social networks, WatchParty is built on ephemeral architecture:
                </p>
                <div style={{ background: "rgba(255, 16, 40, 0.04)", border: "1px solid rgba(255, 16, 40, 0.18)", borderRadius: "8px", padding: "14px", fontSize: "0.86rem", color: "rgba(255,255,255,0.8)", marginBottom: "12px" }}>
                  <strong>Zero Chat Persistence:</strong> Room chat messages, emoji reactions, and video state exist exclusively in volatile server RAM. We do not write your chat logs to disk or any database.
                </div>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(255,255,255,0.6)", margin: 0 }}>
                  When the host disbands or everyone leaves, all memory buffers for that room are instantly dereferenced and purged.
                </p>
              </div>
            </div>
          </section>

          {/* Operating Principles / Commitments */}
          <section style={{ marginBottom: "80px" }}>
            <div
              style={{
                background: "#0E0E12",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "36px 40px"
              }}
            >
              <div style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#FF1028", marginBottom: "8px" }}>
                Our Guiding Commitments
              </div>
              <h3 className="font-heading" style={{ fontSize: "1.8rem", fontWeight: "800", margin: "0 0 24px 0" }}>
                What WatchParty Will Always Stand For
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px" }}>
                <div>
                  <div style={{ fontWeight: "750", color: "#FFFFFF", fontSize: "1.05rem", marginBottom: "6px" }}>
                    1. Creator Respect & Compliance
                  </div>
                  <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(255,255,255,0.65)" }}>
                    We never rip, download, or re-stream copyrighted media. Creators retain 100% of their views and monetization on YouTube.
                  </p>
                </div>
                <div>
                  <div style={{ fontWeight: "750", color: "#FFFFFF", fontSize: "1.05rem", marginBottom: "6px" }}>
                    2. Zero Data Selling
                  </div>
                  <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(255,255,255,0.65)" }}>
                    We do not sell user data, track you across websites, or integrate invasive marketing pixels. Your watch parties are private.
                  </p>
                </div>
                <div>
                  <div style={{ fontWeight: "750", color: "#FFFFFF", fontSize: "1.05rem", marginBottom: "6px" }}>
                    3. Frictionless Experience
                  </div>
                  <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(255,255,255,0.65)" }}>
                    Anyone should be able to join with a single click. We will never hide basic watch party features behind paywalls or subscriptions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Full-Width Action Banner */}
          <section
            style={{
              background: "linear-gradient(135deg, rgba(255, 16, 40, 0.16) 0%, rgba(14, 14, 18, 0.95) 100%)",
              border: "1px solid rgba(255, 16, 40, 0.3)",
              borderRadius: "20px",
              padding: "44px 48px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "24px",
              marginBottom: "30px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
            }}
          >
            <div style={{ maxWidth: "640px" }}>
              <h3 className="font-heading" style={{ fontSize: "1.9rem", fontWeight: "900", margin: "0 0 10px 0" }}>
                Ready to Watch Together?
              </h3>
              <p style={{ fontSize: "0.98rem", color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6 }}>
                Create a private room in seconds, invite your friends, and experience synchronized cinema with zero downloads.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
              <Link
                to="/room?action=create"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "13px 26px",
                  borderRadius: "30px",
                  background: "#FF1028",
                  color: "#FFFFFF",
                  fontSize: "0.95rem",
                  fontWeight: "800",
                  textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(255, 16, 40, 0.35)",
                  transition: "all 0.15s ease"
                }}
              >
                <span>Create a Watch Room</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/room?action=join"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 24px",
                  borderRadius: "30px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#FFFFFF",
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  textDecoration: "none",
                  transition: "all 0.15s ease"
                }}
              >
                <span>Join with Room ID</span>
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer isMobile={false} />

      <style>{`
        @media (max-width: 900px) {
          .about-tech-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
