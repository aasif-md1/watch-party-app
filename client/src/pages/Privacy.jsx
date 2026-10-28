import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ChevronRight,
  Lock,
  EyeOff,
  Database,
  ExternalLink,
  ShieldAlert,
  Server,
  Layers,
  CheckCircle2,
  HelpCircle,
  Mail,
  Info
} from "lucide-react";
import { Navbar } from "./home/Navbar";
import { Footer } from "./home/Footer";
import { useAuth } from "../hooks/useAuth";

export default function Privacy() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [activeNav, setActiveNav] = useState("overview");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: "overview", label: "1. Overview & Architecture" },
    { id: "data-collection", label: "2. Information We Process" },
    { id: "youtube-compliance", label: "3. YouTube API & Google Data" },
    { id: "webrtc-screenshare", label: "4. WebRTC Media & Screen Sharing" },
    { id: "ephemeral-chat", label: "5. Transient Chat & Room State" },
    { id: "storage-cookies", label: "6. LocalStorage & Cookies" },
    { id: "third-parties", label: "7. Third-Party Service Providers" },
    { id: "retention-deletion", label: "8. Data Retention & Deletion" },
    { id: "user-rights", label: "9. Global Privacy Rights (GDPR/CCPA)" },
    { id: "security-measures", label: "10. Technical Security Safeguards" },
    { id: "children-privacy", label: "11. Children's Online Privacy" },
    { id: "contact-desk", label: "12. Privacy Officer & Contact" }
  ];

  const scrollTo = (id) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 95;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div style={{ background: "#080809", color: "#FFFFFF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>Privacy Policy & Data Protection — WatchParty</title>
        <meta
          name="description"
          content="Comprehensive Privacy Policy for WatchParty. Learn how we handle ephemeral room communications, YouTube API compliance, WebRTC encryption, and user data rights."
        />
      </Helmet>

      <Navbar
        user={user}
        authLoading={authLoading}
        signOut={signOut}
        openCreateModal={() => { window.location.href = "/room?action=create"; }}
        isMobile={false}
      />

      <main style={{ flex: 1, paddingTop: "100px", paddingBottom: "90px" }}>
        {/* Top Header Banner */}
        <section
          style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
            background: "linear-gradient(180deg, rgba(255, 16, 40, 0.04) 0%, rgba(8, 8, 9, 0) 100%)",
            padding: "36px 0 44px 0"
          }}
        >
          <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 36px" }}>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", marginBottom: "20px" }}>
              <Link to="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link>
              <ChevronRight size={13} />
              <span>Legal</span>
              <ChevronRight size={13} />
              <span style={{ color: "#FF1028", fontWeight: "600" }}>Privacy Policy</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "860px" }}>
              <h1
                className="font-heading"
                style={{
                  fontSize: "clamp(2.4rem, 4.5vw, 3.4rem)",
                  fontWeight: "900",
                  letterSpacing: "-0.03em",
                  margin: 0,
                  lineHeight: 1.15
                }}
              >
                Privacy Policy & Data Standards
              </h1>
              <p style={{ fontSize: "1.05rem", color: "rgba(255, 255, 255, 0.65)", margin: 0, lineHeight: 1.6 }}>
                Official disclosure on how WatchParty collects, processes, and protects your information across real-time room sessions, YouTube synchronization, and peer-to-peer screen sharing.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "12px", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", flexWrap: "wrap" }}>
                <span><strong>Effective Date:</strong> October 2026</span>
                <span>•</span>
                <span><strong>Version:</strong> 2.4.0 (Global Production)</span>
                <span>•</span>
                <span style={{ color: "#22c55e", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                  <CheckCircle2 size={13} /> Verified YouTube API Compliant
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Grid: Sidebar Index + Document Body */}
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "48px 36px 0 36px",
            display: "grid",
            gridTemplateColumns: "290px minmax(0, 1fr)",
            gap: "56px",
            alignItems: "start"
          }}
          className="legal-grid-container"
        >
          {/* Left Column: Sticky Table of Contents & Quick Summary */}
          <aside
            style={{
              position: "sticky",
              top: "92px",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
          >
            {/* Quick Navigation Card */}
            <div
              style={{
                background: "#0E0E12",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "22px 20px"
              }}
            >
              <div style={{ fontSize: "0.78rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: "14px" }}>
                Document Table of Contents
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    style={{
                      textAlign: "left",
                      background: activeNav === s.id ? "rgba(255, 16, 40, 0.12)" : "transparent",
                      border: "none",
                      color: activeNav === s.id ? "#FF1028" : "rgba(255, 255, 255, 0.7)",
                      fontWeight: activeNav === s.id ? "700" : "500",
                      fontSize: "0.85rem",
                      padding: "7px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      lineHeight: 1.3
                    }}
                    onMouseEnter={(e) => {
                      if (activeNav !== s.id) e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      if (activeNav !== s.id) e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Privacy Pillars Card */}
            <div
              style={{
                background: "#0E0E12",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "14px"
              }}
            >
              <div style={{ fontSize: "0.78rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)" }}>
                Core Privacy Guarantees
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.83rem", color: "rgba(255,255,255,0.7)" }}>
                <Lock size={15} style={{ color: "#FF1028", flexShrink: 0, marginTop: "2px" }} />
                <span><strong>No Permanent Logs:</strong> Video timestamps and chat messages are held exclusively in volatile RAM.</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.83rem", color: "rgba(255,255,255,0.7)" }}>
                <EyeOff size={15} style={{ color: "#FF1028", flexShrink: 0, marginTop: "2px" }} />
                <span><strong>Zero Data Brokerage:</strong> We never sell, rent, or trade user identities or room activities.</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.83rem", color: "rgba(255,255,255,0.7)" }}>
                <Database size={15} style={{ color: "#FF1028", flexShrink: 0, marginTop: "2px" }} />
                <span><strong>Client-Side Control:</strong> Session keys reside in your browser and can be wiped instantly.</span>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div
              style={{
                background: "rgba(255, 16, 40, 0.05)",
                border: "1px solid rgba(255, 16, 40, 0.2)",
                borderRadius: "14px",
                padding: "18px 20px"
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FFFFFF", marginBottom: "6px" }}>
                Need Privacy Assistance?
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", margin: "0 0 12px 0", lineHeight: 1.5 }}>
                Exercise your deletion, export, or access rights anytime with our Data Protection Officer.
              </p>
              <a
                href="mailto:privacy@watchparty.app"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#FF1028",
                  fontSize: "0.83rem",
                  fontWeight: "700",
                  textDecoration: "none"
                }}
              >
                <Mail size={13} /> privacy@watchparty.app
              </a>
            </div>
          </aside>

          {/* Right Column: In-Depth Document Sections */}
          <article
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "48px",
              fontSize: "0.98rem",
              lineHeight: 1.75,
              color: "rgba(255, 255, 255, 0.78)",
              minWidth: 0
            }}
          >
            {/* 1. Overview */}
            <section id="overview" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                1. Overview & Architectural Principles
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                WatchParty ("WatchParty," "Platform," "we," "us," or "our") operates a decentralized and real-time social video synchronization infrastructure. Our service enables distributed groups of individuals to synchronize media playback from official third-party hosts (such as YouTube) and exchange browser-based screen captures and live WebRTC audio/video feeds.
              </p>
              <p style={{ margin: "0 0 16px 0" }}>
                Unlike legacy streaming platforms or social networks, WatchParty is founded upon the principle of <strong>Zero-Surveillance Architecture</strong>. We believe synchronous shared entertainment should mirror private living-room conversations: ephemeral, spontaneous, and unburdened by invasive behavioral trackers, algorithmic profiling, or persistent surveillance databases.
              </p>
              <div style={{ background: "#0E0E12", borderLeft: "3px solid #FF1028", padding: "16px 20px", borderRadius: "0 8px 8px 0", margin: "16px 0" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.85)" }}>
                  <strong>Key Architectural Boundary:</strong> WatchParty does not host, store, or transcode copyright video files on our infrastructure. All video synchronized in YouTube mode is loaded directly into the participant's browser from official YouTube content delivery servers via the official YouTube IFrame Embed API.
                </p>
              </div>
            </section>

            {/* 2. Information We Process */}
            <section id="data-collection" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                2. Information We Process & Collect
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                We strictly limit data processing to the technical parameters essential to establishing, routing, and maintaining low-latency socket sessions between peers:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "20px 0" }}>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "20px" }}>
                  <div style={{ fontWeight: "700", color: "#FFFFFF", marginBottom: "6px" }}>A. Authentication Profile (Google OAuth 2.0)</div>
                  <p style={{ margin: 0, fontSize: "0.92rem", color: "rgba(255, 255, 255, 0.7)" }}>
                    When you sign in using Google Identity Services, our servers receive your public Google User ID (UID), primary email address, verified display name, and avatar image URI. We store this profile in authenticated sessions solely to verify host permissions and render participant identity badges in room sidebars. We do not request or access contacts, drive files, or account passwords.
                  </p>
                </div>

                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "20px" }}>
                  <div style={{ fontWeight: "700", color: "#FFFFFF", marginBottom: "6px" }}>B. Virtual Room Tokens & Peer Metadata</div>
                  <p style={{ margin: 0, fontSize: "0.92rem", color: "rgba(255, 255, 255, 0.7)" }}>
                    When a room is created, our backend generates an encrypted nano-identifier (e.g., <code>k8X2-m9Pq</code>) that serves as the room lookup token. We record temporary socket connection IDs, client user-agent strings, and transport protocol capabilities (WebSockets vs. long-polling fallbacks) to maintain synchronized connection health.
                  </p>
                </div>

                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "20px" }}>
                  <div style={{ fontWeight: "700", color: "#FFFFFF", marginBottom: "6px" }}>C. Telemetry & Security Diagnostics</div>
                  <p style={{ margin: 0, fontSize: "0.92rem", color: "rgba(255, 255, 255, 0.7)" }}>
                    To guard against denial-of-service (DDoS) attacks and brute-force room ID scrapers, our edge network temporarily processes client IP addresses in volatile memory buffers for rate-limiting. These IP logs are automatically rotated and purged without being correlated to personal account identities.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. YouTube API & Google Data */}
            <section id="youtube-compliance" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                3. YouTube API Services & Google Developer Compliance
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                WatchParty utilizes official YouTube API Services to parse public video identifiers, coordinate synchronized seek positions, and control embedded playback state. As a condition of utilizing these services, our integration strictly complies with the Google Developer Terms and YouTube API Policies:
              </p>

              <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "20px", margin: "16px 0" }}>
                <div style={{ fontWeight: "700", color: "#FFFFFF", marginBottom: "8px" }}>Mandatory Third-Party Disclosures:</div>
                <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.92rem" }}>
                  <li>By using WatchParty to synchronize YouTube video playback, you acknowledge and agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#FF1028", textDecoration: "underline" }}>YouTube Terms of Service</a>.</li>
                  <li>User data processed through YouTube API embeds is governed by the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#FF1028", textDecoration: "underline" }}>Google Privacy Policy</a>.</li>
                  <li>You can review and revoke WatchParty's access to your Google account permissions at any time via the official <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: "#FF1028", textDecoration: "underline" }}>Google Security Settings</a> page.</li>
                </ul>
              </div>

              <p style={{ margin: 0, fontSize: "0.92rem", color: "rgba(255, 255, 255, 0.65)" }}>
                WatchParty never accesses, modifies, or extracts private YouTube account details, subscriber lists, watch histories, or private playlists. All interactions are restricted strictly to public media metadata.
              </p>
            </section>

            {/* 4. WebRTC Media & Screen Sharing */}
            <section id="webrtc-screenshare" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                4. WebRTC Media Streams & Screen Sharing Security
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                In Screen Share mode and live voice/video rooms, media transmission is conducted over WebRTC (Web Real-Time Communication) protocols. Here is how your media data is protected:
              </p>
              <ul style={{ margin: "0 0 16px 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li><strong>End-to-End Media Encryption (DTLS/SRTP):</strong> WebRTC audio and video packets are encrypted in transit using industry-standard Datagram Transport Layer Security (DTLS) and Secure Real-time Transport Protocol (SRTP). Only authorized peers in your room possess the cryptographic session keys to decrypt your stream.</li>
                <li><strong>No Central Video Recording:</strong> WatchParty servers act purely as signaling coordinators (exchanging SDP offers, answers, and ICE candidate network route tokens). Once the peer-to-peer or selective forwarding mesh is established, your audio and video streams flow directly between participants. Our servers do not capture, record, store, or inspect your screen content or camera feeds.</li>
                <li><strong>Explicit Browser Consent:</strong> Screen capture and webcam access can never be triggered programmatically without explicit browser permission dialogues prompted to the user. You retain full control to terminate sharing at any instant.</li>
              </ul>
            </section>

            {/* 5. Ephemeral Chat */}
            <section id="ephemeral-chat" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                5. Transient Chat & In-Memory Room Lifecycle
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                Room communication on WatchParty is intentionally non-persistent:
              </p>
              <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "20px" }}>
                <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.92rem" }}>
                  <li><strong>Volatile RAM Retention:</strong> Text chat messages, emoji reactions, and video timestamps exist exclusively in volatile node memory while a room is active.</li>
                  <li><strong>Zero Disk Persistence:</strong> We do not log message transcripts to MySQL, MongoDB, PostgreSQL, or persistent block storage.</li>
                  <li><strong>Immediate Disband Purge:</strong> When all participants exit a room or when the host disbands the session, the room token and all associated memory structures are instantly dereferenced and garbage-collected from server memory.</li>
                </ul>
              </div>
            </section>

            {/* 6. LocalStorage & Cookies */}
            <section id="storage-cookies" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                6. Local Storage & Cookie Inventory
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                WatchParty does not deploy third-party advertising cookies, behavioral fingerprinting scripts, or cross-site tracking beacons. We utilize browser <code>LocalStorage</code> strictly for essential functional preferences:
              </p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", background: "#0E0E12", borderRadius: "8px", overflow: "hidden" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF" }}>Storage Key</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF" }}>Purpose</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", color: "#FFFFFF" }}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "#FF1028" }}>wp_custom_name_[uid]</td>
                      <td style={{ padding: "12px 16px" }}>Stores your preferred room display nickname</td>
                      <td style={{ padding: "12px 16px" }}>Persistent until cleared</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "#FF1028" }}>wp_username</td>
                      <td style={{ padding: "12px 16px" }}>Fallback display nickname for guest participants</td>
                      <td style={{ padding: "12px 16px" }}>Persistent until cleared</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "#FF1028" }}>wp_roomMode</td>
                      <td style={{ padding: "12px 16px" }}>Remembers your last selected room mode (YouTube vs. Screen Share)</td>
                      <td style={{ padding: "12px 16px" }}>Session / Persistent</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 7. Third-Party Service Providers */}
            <section id="third-parties" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                7. Third-Party Subprocessors & Infrastructure Partners
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                We partner with vetted cloud service infrastructure providers bound by strict data processing agreements:
              </p>
              <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li><strong>Google Cloud & Firebase:</strong> Provides Google Identity OAuth 2.0 authentication endpoints and edge distribution.</li>
                <li><strong>YouTube (Alphabet Inc.):</strong> Delivers embedded public video playback streams and official API player controls.</li>
                <li><strong>Cloudflare / Global CDN:</strong> Provides edge reverse proxying, DDoS mitigation, and SSL/TLS 1.3 transport encryption.</li>
              </ul>
            </section>

            {/* 8. Retention & Deletion */}
            <section id="retention-deletion" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                8. Data Retention & Deletion Procedures
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                Because our application operates with an ephemeral-first topology, the vast majority of session data ceases to exist milliseconds after a session concludes. For user profile metadata associated with Google Sign-In, records are maintained only for the lifetime of your active user account.
              </p>
              <p style={{ margin: 0 }}>
                You may request complete account deletion and purge of any cached profile associations by emailing <strong>privacy@watchparty.app</strong> or submitting a request via our Contact Desk. Verification and deletion are executed within thirty (30) business days.
              </p>
            </section>

            {/* 9. Global Rights */}
            <section id="user-rights" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                9. Global Privacy Rights (GDPR & CCPA/CPRA Compliance)
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                Depending on your geographical jurisdiction (including the European Economic Area under GDPR and California under CCPA/CPRA), you are entitled to statutory privacy rights:
              </p>
              <ul style={{ margin: "0 0 16px 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li><strong>Right of Access & Portability:</strong> The right to obtain confirmation and copies of personal data we hold about you.</li>
                <li><strong>Right to Rectification:</strong> The right to update inaccurate display names or profile information.</li>
                <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> The right to request permanent deletion of your profile data.</li>
                <li><strong>Right to Opt-Out of Sale:</strong> We do not sell personal information as defined by California law; hence no opt-out is necessary.</li>
              </ul>
            </section>

            {/* 10. Security Safeguards */}
            <section id="security-measures" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                10. Technical Security Safeguards
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                WatchParty implements defense-in-depth security engineering to protect user integrity:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255,255,255,0.08)", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ fontWeight: "700", color: "#FFFFFF", marginBottom: "4px" }}>TLS 1.3 Transport</div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>All web traffic and WebSocket frames are encrypted in transit via forced HTTPS/WSS.</div>
                </div>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255,255,255,0.08)", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ fontWeight: "700", color: "#FFFFFF", marginBottom: "4px" }}>Cryptographic Tokens</div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Room access keys use high-entropy random nanoids to prevent sequential ID guessing.</div>
                </div>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255,255,255,0.08)", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ fontWeight: "700", color: "#FFFFFF", marginBottom: "4px" }}>XSS & Sanity Filters</div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Chat messages and nickname inputs are sanitized against DOM-based XSS injection vulnerabilities.</div>
                </div>
              </div>
            </section>

            {/* 11. Children's Privacy */}
            <section id="children-privacy" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                11. Children's Online Privacy (COPPA Compliance)
              </h2>
              <p style={{ margin: 0 }}>
                WatchParty is not targeted toward, marketed to, or intentionally designed for children under thirteen (13) years of age (or sixteen (16) where applicable under local regulations). We do not knowingly collect personal information from minors. If you believe a minor has established an account without parental consent, please contact our team immediately for prompt deletion.
              </p>
            </section>

            {/* 12. Contact Desk */}
            <section id="contact-desk" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                12. Privacy Compliance Desk & Contact
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                If you have questions, feedback, or statutory inquiries regarding this Privacy Policy or our security architecture, our team is directly accessible:
              </p>
              <div style={{ background: "#0E0E12", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div><strong>Platform:</strong> WatchParty Social Video Synchronization Utility</div>
                <div><strong>Privacy Desk:</strong> <a href="mailto:privacy@watchparty.app" style={{ color: "#FF1028" }}>privacy@watchparty.app</a></div>
                <div><strong>General Support:</strong> <a href="mailto:support@watchparty.app" style={{ color: "#FF1028" }}>support@watchparty.app</a></div>
                <div><strong>Contact Portal:</strong> <Link to="/contact" style={{ color: "#FF1028", textDecoration: "underline" }}>Direct Support Ticket Desk</Link></div>
              </div>
            </section>
          </article>
        </div>
      </main>

      <Footer isMobile={false} />

      <style>{`
        @media (max-width: 960px) {
          .legal-grid-container {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
            padding: 32px 20px 0 20px !important;
          }
          .legal-grid-container aside {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
