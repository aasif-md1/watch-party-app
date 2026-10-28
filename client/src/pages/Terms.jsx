import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Scale,
  FileText,
  ExternalLink,
  Ban,
  CheckCircle2,
  Mail,
  HelpCircle,
  Video,
  Layers,
  Lock,
  Globe
} from "lucide-react";
import { Navbar } from "./home/Navbar";
import { Footer } from "./home/Footer";
import { useAuth } from "../hooks/useAuth";

export default function Terms() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [activeNav, setActiveNav] = useState("acceptance");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: "acceptance", label: "1. Acceptance & Eligibility" },
    { id: "service-scope", label: "2. Service Scope & Architecture" },
    { id: "youtube-compliance", label: "3. YouTube API & Platform Rules" },
    { id: "screenshare-broadcasting", label: "4. WebRTC Screen Share Rules" },
    { id: "user-accounts", label: "5. Accounts & Google Identity" },
    { id: "acceptable-use", label: "6. Acceptable Use & Conduct" },
    { id: "room-moderation", label: "7. Room Moderation & Lifecycle" },
    { id: "intellectual-property", label: "8. Intellectual Property Rights" },
    { id: "dmca-policy", label: "9. DMCA Notice & Takedown" },
    { id: "warranty-disclaimer", label: "10. Warranty Disclaimers" },
    { id: "limitation-liability", label: "11. Limitation of Liability" },
    { id: "indemnification", label: "12. User Indemnification" },
    { id: "dispute-resolution", label: "13. Dispute Resolution & Arbitration" },
    { id: "modifications-governing", label: "14. Modifications & Legal Desk" }
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
        <title>Terms of Service & User Agreement — WatchParty</title>
        <meta
          name="description"
          content="Review the official WatchParty Terms of Service. Clear, developer-grade legal terms governing real-time playback synchronization, YouTube API compliance, WebRTC screen sharing, and user responsibilities."
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
              <span style={{ color: "#FF1028", fontWeight: "600" }}>Terms of Service</span>
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
                Terms of Service & User Agreement
              </h1>
              <p style={{ fontSize: "1.05rem", color: "rgba(255, 255, 255, 0.65)", margin: 0, lineHeight: 1.6 }}>
                Clear, binding terms governing your access to the WatchParty platform, synchronized playback infrastructure, WebRTC media relays, and YouTube API integrations.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "12px", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", flexWrap: "wrap" }}>
                <span><strong>Effective Date:</strong> October 2026</span>
                <span>•</span>
                <span><strong>Version:</strong> 2.4.0 (Global Production)</span>
                <span>•</span>
                <span style={{ color: "#22c55e", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                  <CheckCircle2 size={13} /> YouTube API Verified Terms
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
          className="legal-layout-container"
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

            {/* Core Commitments Card */}
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
                Core Platform Boundaries
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.83rem", color: "rgba(255,255,255,0.7)" }}>
                <ShieldCheck size={15} style={{ color: "#FF1028", flexShrink: 0, marginTop: "2px" }} />
                <span><strong>Strictly Non-Hosting:</strong> WatchParty does not store or distribute copyrighted audio or video files.</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.83rem", color: "rgba(255,255,255,0.7)" }}>
                <Scale size={15} style={{ color: "#FF1028", flexShrink: 0, marginTop: "2px" }} />
                <span><strong>YouTube API Terms:</strong> Direct client-side IFrame embeds obeying Google's developer terms.</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.83rem", color: "rgba(255,255,255,0.7)" }}>
                <Ban size={15} style={{ color: "#FF1028", flexShrink: 0, marginTop: "2px" }} />
                <span><strong>Zero Piracy Tolerance:</strong> Immediate room teardown and IP ban for unauthorized rebroadcasts.</span>
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
                Legal or DMCA Inquiry?
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", margin: "0 0 12px 0", lineHeight: 1.5 }}>
                For statutory copyright notices, trademark requests, or law enforcement inquiries:
              </p>
              <a
                href="mailto:legal@watchparty.app"
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
                <Mail size={13} /> legal@watchparty.app
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
            {/* 1. Acceptance & Eligibility */}
            <section id="acceptance" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                1. Acceptance of Terms & Eligibility
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                These Terms of Service ("Terms," "Agreement") constitute a legally binding contractual agreement between you ("User," "you," or "your") and WatchParty ("WatchParty," "Platform," "we," "us," or "our"), governing your access to and utilization of the WatchParty web application, client interfaces, real-time WebSocket signaling clusters, and associated digital services (collectively, the "Service").
              </p>
              <p style={{ margin: "0 0 16px 0" }}>
                By creating a virtual watch room, entering an active Room ID, signing in via Google Identity Services, or otherwise accessing any portion of the Platform, you acknowledge that you have read, understood, and unequivocally agree to be bound by all stipulations in this Agreement, alongside our <Link to="/privacy" style={{ color: "#FF1028", textDecoration: "underline" }}>Privacy Policy</Link>. If you do not agree to every provision of these Terms, you are strictly prohibited from using or accessing the Service.
              </p>
              
              <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "20px", margin: "20px 0" }}>
                <div style={{ fontWeight: "700", color: "#FFFFFF", marginBottom: "8px" }}>Mandatory Age & Legal Capacity Requirements</div>
                <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.92rem", color: "rgba(255, 255, 255, 0.72)" }}>
                  <li>You must be at least thirteen (13) years of age (or sixteen (16) where mandated by European Union GDPR regulations or local jurisdiction law).</li>
                  <li>Minors between 13 and the age of majority in their jurisdiction must have explicit permission and supervisory consent from a parent or legal guardian.</li>
                  <li>If accessing the Platform on behalf of a company, organization, or legal entity, you represent and warrant that you possess full corporate authorization to bind that entity to these Terms.</li>
                </ul>
              </div>
            </section>

            {/* 2. Service Scope & Architecture */}
            <section id="service-scope" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                2. Service Scope & Non-Hosting Architecture
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                WatchParty operates exclusively as an ephemeral, real-time communications coordinator and playback synchronization utility. Our server infrastructure relays lightweight JSON timing events (such as timestamp offsets, play states, pause signals, and room chat payloads) across distributed web client instances.
              </p>

              <div style={{ background: "#0E0E12", borderLeft: "3px solid #FF1028", padding: "18px 22px", borderRadius: "0 8px 8px 0", margin: "20px 0" }}>
                <div style={{ fontWeight: "800", color: "#FFFFFF", marginBottom: "6px", fontSize: "1.05rem" }}>
                  CRITICAL ARCHITECTURAL DISCLAIMER: WE DO NOT HOST CONTENT
                </div>
                <p style={{ margin: 0, fontSize: "0.92rem", color: "rgba(255, 255, 255, 0.85)" }}>
                  <strong>WatchParty is strictly NOT a video hosting provider, media streaming server, video-on-demand platform, or Content Delivery Network (CDN).</strong> We do not store, encode, transcode, upload, or redistribute video, audio, or television broadcast files on our servers. All video playback occurs strictly client-side within the user's browser:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "14px" }}>
                  <div style={{ background: "rgba(255,255,255,0.04)", padding: "12px 14px", borderRadius: "6px", fontSize: "0.85rem" }}>
                    <strong style={{ color: "#FFFFFF" }}>YouTube Mode:</strong> Audio and video streams are rendered directly from Google LLC / YouTube content delivery edge servers via official IFrame Embed APIs.
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.04)", padding: "12px 14px", borderRadius: "6px", fontSize: "0.85rem" }}>
                    <strong style={{ color: "#FFFFFF" }}>Screen Share Mode:</strong> Audio and video frames are transmitted peer-to-peer (or via ephemeral WebRTC SFU relays) directly between participant browser tabs with end-to-end DTLS/SRTP encryption.
                  </div>
                </div>
              </div>
            </section>

            {/* 3. YouTube Platform Rules */}
            <section id="youtube-compliance" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                3. YouTube Platform Terms & API Compliance
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                WatchParty utilizes official YouTube API Services to parse video metadata, coordinate synchronized playback offsets, and render video content. As a mandatory condition of using YouTube synchronization features on WatchParty:
              </p>

              <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "22px", margin: "20px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#FF1028", fontWeight: "700", marginBottom: "12px" }}>
                  <AlertTriangle size={18} />
                  <span>Mandatory Third-Party Platform Adherence</span>
                </div>
                <p style={{ margin: "0 0 14px 0", fontSize: "0.92rem", color: "rgba(255, 255, 255, 0.8)" }}>
                  By utilizing WatchParty, you explicitly agree to be bound by the official{" "}
                  <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#FF1028", textDecoration: "underline", fontWeight: "600" }}>
                    YouTube Terms of Service
                  </a>
                  {" "}and acknowledge the{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#FF1028", textDecoration: "underline", fontWeight: "600" }}>
                    Google Privacy Policy
                  </a>.
                </p>
                
                <div style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.7)", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div><strong>Express Prohibitions:</strong> You may not, under any circumstances:</div>
                  <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>Attempt to bypass, strip, hide, or alter official YouTube advertisements or monetization overlays.</li>
                    <li>Download, capture, rip, or locally record video or audio streams served through the YouTube player.</li>
                    <li>Circumvent or tamper with YouTube age verification, country geoblocks, or Digital Rights Management (DRM) restrictions.</li>
                    <li>Overlay deceptive UI elements or fake controls on top of the official YouTube video viewport.</li>
                  </ul>
                  <div style={{ marginTop: "10px", fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>
                    You can inspect or revoke authorized third-party application permissions anytime via the official{" "}
                    <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: "#FF1028" }}>
                      Google Security Settings Portal
                    </a>.
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Screen Share Rules */}
            <section id="screenshare-broadcasting" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                4. WebRTC Screen Sharing & Broadcaster Liability
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                When you initiate browser screen sharing, application window capture, tab audio transmission, or webcam streaming in a room, you act as the primary publisher and broadcaster of that media stream.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px", margin: "20px 0" }}>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "18px" }}>
                  <div style={{ fontWeight: "700", color: "#FFFFFF", marginBottom: "6px" }}>A. Content Ownership & Authorization Warranty</div>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.7)" }}>
                    You represent and warrant that you own or possess all requisite copyright rights, licenses, express permissions, or lawful fair use authority for any digital content, audio tracks, games, video clips, or documents transmitted via your screen share feed.
                  </p>
                </div>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "18px" }}>
                  <div style={{ fontWeight: "700", color: "#FFFFFF", marginBottom: "6px" }}>B. Confidentiality & Sensitive Screen Data</div>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.7)" }}>
                    You acknowledge sole responsibility for preventing the broadcast of sensitive personal identifiers, passwords, financial records, corporate trade secrets, or unredacted confidential communications during screen captures. WatchParty disclaims all liability for accidental broadcasts of private data by users.
                  </p>
                </div>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "18px" }}>
                  <div style={{ fontWeight: "700", color: "#FFFFFF", marginBottom: "6px" }}>C. Private vs Public Room Responsibility</div>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.7)" }}>
                    Room creators control access tokens and room links. If you circulate your Room ID publicly (e.g. on public social media, Twitch, or forums), you assume full liability for unauthorized viewers entering the room or viewing your broadcasted feed.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Accounts & Google Identity */}
            <section id="user-accounts" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                5. User Accounts & Google Identity Security
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                WatchParty provides optional Google OAuth 2.0 authentication to verify room ownership, persist display identities across sessions, and enable administrative controls.
              </p>
              <ul style={{ margin: "0 0 16px 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li><strong>Account Integrity:</strong> You are responsible for maintaining the confidentiality of your Google account credentials and for all activities conducted under your authenticated session.</li>
                <li><strong>Unauthorized Access:</strong> You agree to immediately notify WatchParty support if you detect unauthorized access to your account or any security breach affecting your room sessions.</li>
                <li><strong>Guest Participation:</strong> Unauthenticated users participate using ephemeral volatile tokens. Guests are subject to the same strict acceptable use standards as authenticated members.</li>
              </ul>
            </section>

            {/* 6. Acceptable Use Policy */}
            <section id="acceptable-use" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                6. Acceptable Use Policy & Prohibited Conduct
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                To preserve a secure, civilized, and legally compliant collaborative environment, all users must abide by our Acceptable Use Policy. You agree that you will NOT engage in, facilitate, or promote any of the following prohibited behaviors:
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", margin: "20px 0" }}>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "18px" }}>
                  <div style={{ fontWeight: "700", color: "#FF1028", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Ban size={15} /> Harmful & Illegal Content
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", display: "flex", flexDirection: "column", gap: "5px" }}>
                    <li>Child sexual abuse material (CSAM) or exploitation of minors.</li>
                    <li>Non-consensual sexual imagery, voyeurism, or explicit pornography.</li>
                    <li>Hate speech, violent extremism, terrorism, or harassment.</li>
                    <li>Defamation, doxxing, stalking, or credible threats of harm.</li>
                  </ul>
                </div>

                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "18px" }}>
                  <div style={{ fontWeight: "700", color: "#FF1028", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Ban size={15} /> Platform & Network Attacks
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", display: "flex", flexDirection: "column", gap: "5px" }}>
                    <li>Denial-of-Service (DDoS) attacks or socket message flooding.</li>
                    <li>Automated bot swarms, crawling, or unauthorized scraping.</li>
                    <li>Brute-forcing room identifier spaces or room tokens.</li>
                    <li>Fuzzing WebSocket protocols to crash active rooms.</li>
                  </ul>
                </div>

                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "18px" }}>
                  <div style={{ fontWeight: "700", color: "#FF1028", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Ban size={15} /> Exploitation & Reverse Engineering
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", display: "flex", flexDirection: "column", gap: "5px" }}>
                    <li>Decompiling, modifying, or creating derivative software clients.</li>
                    <li>Exploiting zero-day room vulnerabilities for griefing.</li>
                    <li>Interfering with server-enforced rate-limiters or firewalls.</li>
                    <li>Impersonating WatchParty staff, developers, or room hosts.</li>
                  </ul>
                </div>

                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "18px" }}>
                  <div style={{ fontWeight: "700", color: "#FF1028", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Ban size={15} /> Malicious Payloads & Links
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", display: "flex", flexDirection: "column", gap: "5px" }}>
                    <li>Distributing phishing URLs, credential-stealing links, or spyware.</li>
                    <li>Embedding cryptocurrency mining scripts in shared tabs.</li>
                    <li>Spamming affiliate links or automated marketing messages.</li>
                    <li>Transmitting viruses, ransomware, or malicious browser payloads.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 7. Room Moderation */}
            <section id="room-moderation" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                7. Room Moderation, Host Authority & Room Lifecycle
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                WatchParty implements a distributed host-governed room model supplemented by automated network safeguards:
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "16px 0" }}>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "16px" }}>
                  <strong style={{ color: "#FFFFFF" }}>Host Moderation Powers:</strong> The creator of a virtual room holds temporary host privileges, including the authority to remove ("kick") disruptive participants, ban socket addresses from re-entering, restrict playback control permissions, and designate room access policies.
                </div>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "16px" }}>
                  <strong style={{ color: "#FFFFFF" }}>Platform Enforcement Discretion:</strong> WatchParty reserves the unilateral right, though not the obligation, to terminate socket connections, disband active rooms, or block IP address ranges that violate these Terms or threaten platform stability.
                </div>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "16px" }}>
                  <strong style={{ color: "#FFFFFF" }}>In-Memory Ephemeral Purge:</strong> Rooms are volatile runtime structures. The moment all participants disconnect, or the host initiates a room disband, all associated socket buffers, participant lists, and in-memory chat histories are immediately dereferenced and destroyed.
                </div>
              </div>
            </section>

            {/* 8. Intellectual Property */}
            <section id="intellectual-property" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                8. Intellectual Property Rights & Software License
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                The WatchParty brand identity, visual design tokens, logo assets, frontend codebase, WebSocket relay architecture, documentation, and user interfaces are the proprietary intellectual property of WatchParty and its licensors, protected by international copyright, trademark, and unfair competition laws.
              </p>
              <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "20px", margin: "16px 0" }}>
                <div style={{ fontWeight: "700", color: "#FFFFFF", marginBottom: "8px" }}>Limited License Grant</div>
                <p style={{ margin: "0 0 12px 0", fontSize: "0.92rem", color: "rgba(255, 255, 255, 0.75)" }}>
                  Subject to your complete and continued compliance with these Terms, WatchParty grants you a limited, revocable, non-exclusive, non-transferable, non-sublicensable personal license to access and use the Platform solely for lawful, non-commercial collaborative media synchronization.
                </p>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.55)" }}>
                  Third-Party Trademarks: "YouTube" is a registered trademark of Google LLC. All other third-party trademarks, movie titles, music trademarks, and game logos visible in synchronized streams remain the exclusive property of their respective copyright holders.
                </p>
              </div>
            </section>

            {/* 9. DMCA Copyright Policy */}
            <section id="dmca-policy" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                9. Digital Millennium Copyright Act (DMCA) & Takedown Policy
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                WatchParty respects intellectual property rights and adheres to the notice-and-takedown procedures codified in Title 17, United States Code, Section 512 (DMCA). Because WatchParty does not host content files on disk, infringements typically arise from unauthorized peer-to-peer screen broadcasts or malicious room linking.
              </p>

              <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "22px", margin: "20px 0" }}>
                <div style={{ fontWeight: "700", color: "#FFFFFF", marginBottom: "12px", fontSize: "1rem" }}>
                  Filing a Formal DMCA Takedown Notice
                </div>
                <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.75)", margin: "0 0 14px 0" }}>
                  If you are a copyright owner or an authorized agent and believe that content transmitted through a WatchParty room infringes upon your copyright, you must submit a written notification containing all statutory elements required under 17 U.S.C. § 512(c)(3):
                </p>
                
                <ol style={{ margin: 0, paddingLeft: "20px", fontSize: "0.88rem", color: "rgba(255, 255, 255, 0.72)", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <li>A physical or electronic signature of a person authorized to act on behalf of the copyright owner.</li>
                  <li>Identification of the copyrighted work claimed to have been infringed (or a representative list if multiple works).</li>
                  <li>Identification of the infringing material with sufficient detail for us to locate it (e.g., specific active Room ID, URL timestamp, and broadcaster handle).</li>
                  <li>Reasonably sufficient contact information (name, physical address, telephone number, and email address).</li>
                  <li>A statement that you have a good-faith belief that use of the material is not authorized by the copyright owner, its agent, or the law.</li>
                  <li>A statement made under penalty of perjury that the information in the notification is accurate and that you are authorized to act on behalf of the owner.</li>
                </ol>

                <div style={{ marginTop: "18px", padding: "14px", background: "rgba(255, 16, 40, 0.06)", border: "1px solid rgba(255, 16, 40, 0.2)", borderRadius: "8px" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FFFFFF", marginBottom: "4px" }}>Designated Copyright Agent Contact:</div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>DMCA Compliance Desk, WatchParty Legal Department</div>
                  <div style={{ fontSize: "0.85rem", color: "#FF1028", marginTop: "4px" }}>Email: <strong>dmca@watchparty.app</strong> / <strong>legal@watchparty.app</strong></div>
                </div>
              </div>

              <div style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.7)" }}>
                <strong>Repeat Infringer Policy:</strong> In accordance with Section 512(i) of the DMCA, WatchParty enforces a strict policy that provides for the immediate termination of accounts and permanent IP network bans of users who are determined to be repeat infringers.
              </div>
            </section>

            {/* 10. Warranty Disclaimers */}
            <section id="warranty-disclaimer" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                10. Disclaimer of Warranties
              </h2>
              <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "20px" }}>
                <p style={{ margin: "0 0 12px 0", fontSize: "0.92rem", lineHeight: 1.7, color: "rgba(255, 255, 255, 0.8)" }}>
                  THE SERVICE IS PROVIDED ON AN <strong>"AS IS"</strong> AND <strong>"AS AVAILABLE"</strong> BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                </p>
                <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(255, 255, 255, 0.65)" }}>
                  WATCHPARTY DOES NOT WARRANT THAT: (A) THE SERVICE WILL FUNCTION UNINTERRUPTED, SECURE, OR ERROR-FREE; (B) DEFECTS OR LATENCY DRIFT WILL BE CORRECTED; (C) TIMING SYNCHRONIZATION WILL BE FRAME-PERFECT ACROSS VARIABLE INTERNET CONNECTIONS; OR (D) THIRD-PARTY PLATFORMS (INCLUDING YOUTUBE APIS) WILL MAINTAIN CONTINUOUS COMPATIBILITY OR SERVICE AVAILABILITY.
                </p>
              </div>
            </section>

            {/* 11. Limitation of Liability */}
            <section id="limitation-liability" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                11. Limitation of Liability
              </h2>
              <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "20px" }}>
                <p style={{ margin: "0 0 12px 0", fontSize: "0.92rem", lineHeight: 1.7, color: "rgba(255, 255, 255, 0.8)" }}>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL WATCHPARTY, ITS DIRECTORS, EMPLOYEES, CONTRIBUTORS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF PROFITS, REVENUE, GOODWILL, DATA, USE, OR OTHER INTANGIBLE LOSSES) ARISING FROM OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICE.
                </p>
                <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(255, 255, 255, 0.65)" }}>
                  IN NO EVENT SHALL WATCHPARTY'S TOTAL AGGREGATE LIABILITY EXCEED THE GREATER OF FIFTY UNITED STATES DOLLARS ($50.00 USD) OR THE TOTAL AMOUNT PAID BY YOU TO WATCHPARTY IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                </p>
              </div>
            </section>

            {/* 12. Indemnification */}
            <section id="indemnification" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                12. User Indemnification & Hold Harmless
              </h2>
              <p style={{ margin: 0 }}>
                You agree to defend, indemnify, and hold harmless WatchParty, its operators, officers, employees, infrastructure partners, and agents from and against all claims, damages, obligations, losses, liabilities, costs, debts, and legal expenses (including reasonable attorney fees) arising from: (a) your use of and access to the Service; (b) any media content, audio, or video streams transmitted or broadcasted from your browser via screen share; (c) your violation of any term of this Agreement; (d) your violation of third-party copyright, trademark, or privacy rights; or (e) any claim that your room broadcast caused damage to a third party.
              </p>
            </section>

            {/* 13. Dispute Resolution & Arbitration */}
            <section id="dispute-resolution" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                13. Dispute Resolution & Mandatory Binding Arbitration
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                Please review this section carefully. It mandates that disputes be resolved by binding individual arbitration rather than court proceedings, and includes a class action waiver:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "16px" }}>
                  <strong style={{ color: "#FFFFFF" }}>Mandatory Informal Resolution:</strong> Before initiating formal proceedings, you and WatchParty agree to attempt to resolve any dispute, claim, or controversy informally for thirty (30) days by contacting <strong>legal@watchparty.app</strong>.
                </div>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "16px" }}>
                  <strong style={{ color: "#FFFFFF" }}>Binding Arbitration:</strong> Any dispute unresolved through informal negotiation shall be settled by final and binding individual arbitration conducted under the rules of the American Arbitration Association (AAA) or equivalent recognized international tribunal.
                </div>
                <div style={{ background: "#0E0E12", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "16px" }}>
                  <strong style={{ color: "#FFFFFF" }}>Waiver of Class Actions & Jury Trial:</strong> YOU AND WATCHPARTY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
                </div>
              </div>
            </section>

            {/* 14. Modifications & Legal Desk */}
            <section id="modifications-governing" style={{ scrollMarginTop: "110px" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>
                14. Modifications, Severability & Legal Desk
              </h2>
              <p style={{ margin: "0 0 16px 0" }}>
                We reserve the right to revise, amend, or replace these Terms at our sole discretion to reflect changes in regulatory statutes, infrastructure updates, or newly introduced features. When revisions occur, we will update the "Effective Date" at the top of this document. Continued use of WatchParty following the posting of amended Terms constitutes your full acceptance of the modifications.
              </p>
              <p style={{ margin: "0 0 20px 0" }}>
                <strong>Severability:</strong> If any provision of these Terms is found to be unlawful, void, or unenforceable, that provision shall be deemed severable and shall not affect the validity and enforceability of any remaining provisions.
              </p>

              <div style={{ background: "#0E0E12", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div><strong>Platform:</strong> WatchParty Social Video Synchronization Utility</div>
                <div><strong>Legal Counsel & Inquiries:</strong> <a href="mailto:legal@watchparty.app" style={{ color: "#FF1028" }}>legal@watchparty.app</a></div>
                <div><strong>DMCA Takedown Agent:</strong> <a href="mailto:dmca@watchparty.app" style={{ color: "#FF1028" }}>dmca@watchparty.app</a></div>
                <div><strong>Direct Support Ticket Desk:</strong> <Link to="/contact" style={{ color: "#FF1028", textDecoration: "underline" }}>Contact Page Portal</Link></div>
              </div>
            </section>
          </article>
        </div>
      </main>

      <Footer isMobile={false} />

      <style>{`
        @media (max-width: 960px) {
          .legal-layout-container {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
            padding: 32px 20px 0 20px !important;
          }
          .legal-layout-container aside {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
