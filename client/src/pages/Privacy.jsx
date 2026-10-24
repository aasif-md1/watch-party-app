import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ShieldCheck, ChevronRight, Lock, EyeOff, Database, FileText } from "lucide-react";
import { Navbar } from "./home/Navbar";
import { Footer } from "./home/Footer";
import { useAuth } from "../hooks/useAuth";

export default function Privacy() {
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: "#08080A", color: "#FFFFFF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>Privacy Policy — WatchParty</title>
        <meta
          name="description"
          content="Review the WatchParty Privacy Policy. Learn how we protect your privacy with ephemeral in-memory storage, zero persistent chat logs, and YouTube API compliance."
        />
      </Helmet>

      <Navbar
        user={user}
        authLoading={authLoading}
        signOut={signOut}
        openCreateModal={() => { window.location.href = "/"; }}
        isMobile={false}
      />

      <main style={{ flex: 1, paddingTop: "110px", paddingBottom: "80px", maxWidth: "1000px", margin: "0 auto", width: "100%", paddingLeft: "24px", paddingRight: "24px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "32px" }}>
          <Link to="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#E50914", fontWeight: "600" }}>Privacy Policy</span>
        </div>

        {/* Header */}
        <header style={{ marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 14px",
              borderRadius: "30px",
              background: "rgba(229, 9, 20, 0.1)",
              border: "1px solid rgba(229, 9, 20, 0.35)",
              marginBottom: "16px"
            }}
          >
            <ShieldCheck size={14} style={{ color: "#E50914" }} />
            <span style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.74rem", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              LEGAL & PRIVACY STANDARDS
            </span>
          </div>

          <h1 className="font-heading" style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: "900", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", margin: 0 }}>
            Effective Date: September 13, 2026 • Last Reviewed: Today
          </p>
        </header>

        {/* Highlights Banner */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "48px"
          }}
        >
          <div style={{ background: "#111216", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "20px" }}>
            <Lock size={20} style={{ color: "#E50914", marginBottom: "8px" }} />
            <div style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "4px" }}>Zero Persistent Chat Logs</div>
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>Messages live only in server RAM during active calls and are discarded when rooms close.</div>
          </div>
          <div style={{ background: "#111216", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "20px" }}>
            <EyeOff size={20} style={{ color: "#E50914", marginBottom: "8px" }} />
            <div style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "4px" }}>Zero Data Selling</div>
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>We never sell, monetize, or broker personal user identities to third-party ad brokers.</div>
          </div>
          <div style={{ background: "#111216", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "20px" }}>
            <Database size={20} style={{ color: "#E50914", marginBottom: "8px" }} />
            <div style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "4px" }}>Minimal Local Storage</div>
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>Only temporary nicknames and preferences are retained in browser LocalStorage.</div>
          </div>
        </div>

        {/* Policy Body */}
        <article style={{ display: "flex", flexDirection: "column", gap: "36px", fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.78)" }}>
          <section>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 12px 0" }}>
              1. Overview & Commitment
            </h2>
            <p style={{ margin: 0 }}>
              WatchParty ("we," "our," or "the Service") operates an online video synchronization platform allowing users to watch YouTube content and share browser screen video with peers in private, password-less or secure rooms. We prioritize privacy by design: our infrastructure is engineered to process real-time communication without hoarding long-term user telemetry.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 12px 0" }}>
              2. Information We Process
            </h2>
            <p style={{ margin: "0 0 12px 0" }}>
              We limit data collection strictly to what is necessary for establishing synchronized web connections:
            </p>
            <ul style={{ margin: 0, paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>User Profile Data:</strong> When authenticating via Google Sign-In, we receive basic public profile information (name, email address, and profile photo URL) provided by Google Identity Services to display your avatar and identify room participants.</li>
              <li><strong>Room Identifiers & Session Tokens:</strong> Unique cryptographic nanoids are generated to route peers to the same virtual room.</li>
              <li><strong>Ephemeral Chat & Playback State:</strong> Video play/pause timestamps and text chat messages are relayed over WebSockets to peers in the same room. These states are volatile and are not written to long-term storage or databases.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 12px 0" }}>
              3. YouTube API Services Disclosure
            </h2>
            <p style={{ margin: "0 0 12px 0" }}>
              WatchParty integrates with YouTube API Services to load and control public video playback. By using WatchParty to stream YouTube content, you acknowledge and agree to be bound by the:
            </p>
            <div style={{ background: "#121217", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div>• <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#E50914", textDecoration: "underline" }}>YouTube Terms of Service</a></div>
              <div>• <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#E50914", textDecoration: "underline" }}>Google Privacy Policy</a></div>
            </div>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.92rem", color: "rgba(255,255,255,0.65)" }}>
              WatchParty does not access private YouTube user accounts, subscriptions, or search histories. We only pass video IDs to the official embedded player in accordance with YouTube Developer Policies.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 12px 0" }}>
              4. WebRTC Peer-to-Peer Screen Sharing
            </h2>
            <p style={{ margin: 0 }}>
              When you engage in screen sharing within a room, audio and video streams are transmitted directly between room participants using WebRTC peer-to-peer connections or selective forwarding units. WatchParty servers do not record, transcode, or save your screen video feeds.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 12px 0" }}>
              5. LocalStorage & Cookies
            </h2>
            <p style={{ margin: 0 }}>
              We do not deploy third-party advertising cookies or cross-site tracking beacons. We store small client-side keys in your browser's LocalStorage (such as <code>wp_username</code> and <code>wp_roomMode</code>) solely to remember your preferred display nickname and room settings between page reloads.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 12px 0" }}>
              6. Contact & Data Rights
            </h2>
            <p style={{ margin: 0 }}>
              If you have any questions regarding this Privacy Policy or wish to request deletion of your authenticated profile records, please reach out to our privacy compliance desk through our <Link to="/contact" style={{ color: "#E50914" }}>Contact Page</Link> or email <strong>privacy@watchparty.app</strong>.
            </p>
          </section>
        </article>
      </main>

      <Footer isMobile={false} />
    </div>
  );
}
