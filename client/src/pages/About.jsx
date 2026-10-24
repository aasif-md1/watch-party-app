import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Sparkles,
  Users,
  Shield,
  Radio,
  Tv,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Navbar } from "./home/Navbar";
import { Footer } from "./home/Footer";
import { useAuth } from "../hooks/useAuth";

export default function About() {
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { label: "Synced Playback Latency", value: "< 200ms" },
    { label: "Active Watch Parties", value: "10,000+" },
    { label: "Global Server Uptime", value: "99.98%" },
    { label: "Software Downloads", value: "0" }
  ];

  const pillars = [
    {
      icon: <Radio size={24} style={{ color: "#E50914" }} />,
      title: "Real-time WebSocket Engine",
      description:
        "Engineered with high-throughput bi-directional Socket.io relays, WatchParty synchronizes video play, pause, seek, and playback rates across all room participants in sub-second precision."
    },
    {
      icon: <Tv size={24} style={{ color: "#E50914" }} />,
      title: "Direct YouTube API Integration",
      description:
        "Zero video scraping or pirated streaming. WatchParty utilizes the official YouTube IFrame Player API, ensuring high quality, creator revenue protection, and 100% legal compliance."
    },
    {
      icon: <Users size={24} style={{ color: "#E50914" }} />,
      title: "Peer-to-Peer Screen Sharing",
      description:
        "Built-in WebRTC mesh networking enables direct browser-to-browser screen sharing with ultra-low latency, hardware-accelerated audio pass-through, and zero third-party relay recording."
    },
    {
      icon: <Shield size={24} style={{ color: "#E50914" }} />,
      title: "Ephemeral In-Memory Privacy",
      description:
        "Your private cinema remains strictly private. WatchParty does not log chat messages to persistent databases. When a room closes, all active session data is instantaneously purged from server RAM."
    }
  ];

  return (
    <div style={{ background: "#08080A", color: "#FFFFFF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>About WatchParty — Synchronized Social Cinema</title>
        <meta
          name="description"
          content="Learn about WatchParty: our mission, real-time WebSocket sync engine, peer-to-peer screen sharing, and the team building borderless cinema experiences."
        />
      </Helmet>

      {/* Shared Navbar */}
      <Navbar
        user={user}
        authLoading={authLoading}
        signOut={signOut}
        openCreateModal={() => { window.location.href = "/"; }}
        isMobile={false}
      />

      <main style={{ flex: 1, paddingTop: "110px", paddingBottom: "80px", maxWidth: "1200px", margin: "0 auto", width: "100%", paddingLeft: "24px", paddingRight: "24px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "32px" }}>
          <Link to="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#E50914", fontWeight: "600" }}>About</span>
        </div>

        {/* Hero Section */}
        <section style={{ marginBottom: "64px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 14px",
              borderRadius: "30px",
              background: "rgba(229, 9, 20, 0.1)",
              border: "1px solid rgba(229, 9, 20, 0.35)",
              marginBottom: "20px"
            }}
          >
            <Sparkles size={14} style={{ color: "#E50914" }} />
            <span style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.74rem", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              OUR MISSION & STORY
            </span>
          </div>

          <h1
            className="font-heading"
            style={{
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: "900",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: "0 0 24px 0"
            }}
          >
            Bringing People Together,<br />
            <span style={{ background: "linear-gradient(90deg, #E50914 0%, #FF5A78 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              One Frame at a Time.
            </span>
          </h1>

          <p style={{ fontSize: "1.15rem", lineHeight: 1.7, color: "rgba(255,255,255,0.72)", maxWidth: "800px", margin: 0 }}>
            WatchParty was built out of a simple, modern necessity: thousands of miles shouldn't stand between friends sharing laughs over a trending YouTube clip, couples having a long-distance movie date, or study groups collaborating over a screen-share session. We set out to engineer the fastest, cleanest, and most accessible watch-together platform on the web.
          </p>
        </section>

        {/* Stats Strip */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "72px"
          }}
        >
          {stats.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#121217",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}
            >
              <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "#FFFFFF", fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
                {item.value}
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", fontWeight: "500" }}>
                {item.label}
              </div>
            </div>
          ))}
        </section>

        {/* Core Pillars */}
        <section style={{ marginBottom: "80px" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 className="font-heading" style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 10px 0" }}>
              Architecture & Core Technology
            </h2>
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", margin: 0 }}>
              Built with zero bloat, native web APIs, and enterprise-grade performance.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "22px"
            }}
          >
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                style={{
                  background: "#111216",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "16px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  transition: "all 0.2s ease"
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(229, 9, 20, 0.12)",
                    border: "1px solid rgba(229, 9, 20, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {pillar.icon}
                </div>
                <h3 style={{ fontSize: "1.18rem", fontWeight: "700", color: "#FFFFFF", margin: 0 }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(255,255,255,0.62)", margin: 0 }}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner Section */}
        <section
          style={{
            background: "linear-gradient(135deg, rgba(229, 9, 20, 0.25) 0%, rgba(15, 15, 20, 0.8) 100%)",
            border: "1px solid rgba(229, 9, 20, 0.35)",
            borderRadius: "24px",
            padding: "48px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.7)"
          }}
        >
          <div>
            <h3 className="font-heading" style={{ fontSize: "1.85rem", fontWeight: "800", margin: "0 0 8px 0" }}>
              Ready to Host Your First Session?
            </h3>
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.75)", margin: 0 }}>
              No downloads, no subscriptions, 100% free. Jump straight into the action.
            </p>
          </div>

          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 28px",
              borderRadius: "30px",
              background: "#FFFFFF",
              color: "#0A0A0E",
              fontSize: "0.95rem",
              fontWeight: "800",
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(255,255,255,0.2)",
              transition: "transform 0.15s ease"
            }}
          >
            <span>Launch WatchParty</span>
            <ArrowRight size={16} />
          </Link>
        </section>
      </main>

      <Footer isMobile={false} />
    </div>
  );
}
