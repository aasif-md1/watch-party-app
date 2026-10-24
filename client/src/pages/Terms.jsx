import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FileText, ChevronRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { Navbar } from "./home/Navbar";
import { Footer } from "./home/Footer";
import { useAuth } from "../hooks/useAuth";

export default function Terms() {
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: "#08080A", color: "#FFFFFF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>Terms of Service — WatchParty</title>
        <meta
          name="description"
          content="Review the WatchParty Terms of Service. Learn about acceptable use, user conduct, intellectual property rights, and YouTube platform compliance."
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
          <span style={{ color: "#E50914", fontWeight: "600" }}>Terms of Service</span>
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
            <FileText size={14} style={{ color: "#E50914" }} />
            <span style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.74rem", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              USER AGREEMENT & SERVICE TERMS
            </span>
          </div>

          <h1 className="font-heading" style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: "900", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", margin: 0 }}>
            Last Updated: September 13, 2026 • Please read carefully before using WatchParty
          </p>
        </header>

        {/* Terms Content */}
        <article style={{ display: "flex", flexDirection: "column", gap: "36px", fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.78)" }}>
          <section>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 12px 0" }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ margin: 0 }}>
              By creating a watch room, entering an existing Room ID, or accessing any part of the WatchParty web application ("Service"), you signify that you have read, understood, and agreed to be bound by these Terms of Service and our associated Privacy Policy. If you do not agree to these terms, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 12px 0" }}>
              2. Nature of the Service
            </h2>
            <p style={{ margin: 0 }}>
              WatchParty is a social synchronization utility designed to coordinate video playback positions across multiple remote internet browsers. <strong>WatchParty is not a video host, content distribution network (CDN), or streaming server.</strong> All video content synchronized through our YouTube mode is rendered directly from official YouTube servers via standard YouTube IFrame embeds.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 12px 0" }}>
              3. YouTube Terms & Content Compliance
            </h2>
            <div style={{ background: "#121217", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#E50914", fontWeight: "700" }}>
                <AlertTriangle size={18} />
                <span>Third-Party Platform Adherence</span>
              </div>
              <p style={{ margin: 0, fontSize: "0.92rem", color: "rgba(255,255,255,0.75)" }}>
                You must comply with all applicable terms, conditions, and community guidelines of the content platforms you link to, including the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#E50914" }}>YouTube Terms of Service</a>. You may not use WatchParty to circumvent age restrictions, territorial broadcasting restrictions, or digital rights management protections.
              </p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 12px 0" }}>
              4. User Conduct & Community Guidelines
            </h2>
            <p style={{ margin: "0 0 12px 0" }}>
              When participating in WatchParty rooms and live chat, you agree not to:
            </p>
            <ul style={{ margin: 0, paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>Share, stream, or transmit illegal, abusive, defamatory, harassing, or sexually explicit material.</li>
              <li>Attempt to disrupt, overload, or reverse-engineer our WebSocket signalling relays or socket clusters.</li>
              <li>Impersonate any person, brand, or administrator in the room chat or nickname fields.</li>
              <li>Distribute malicious links, viruses, or phishing URLs through the room text chat.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 12px 0" }}>
              5. Intellectual Property Rights
            </h2>
            <p style={{ margin: 0 }}>
              The WatchParty logo, design system, web code, and brand trademarks are the intellectual property of WatchParty. All movie trailers, music videos, and content viewed within the video player remain the exclusive property of their respective copyright owners and creators.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 12px 0" }}>
              6. Disclaimer of Warranties & Limitation of Liability
            </h2>
            <p style={{ margin: 0 }}>
              WatchParty is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. In no event shall WatchParty or its contributors be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", margin: "0 0 12px 0" }}>
              7. Inquiries & Legal Notices
            </h2>
            <p style={{ margin: 0 }}>
              For legal notifications, DMCA inquiries, or questions regarding these Terms, please reach out via our <Link to="/contact" style={{ color: "#E50914" }}>Contact Page</Link> or email <strong>legal@watchparty.app</strong>.
            </p>
          </section>
        </article>
      </main>

      <Footer isMobile={false} />
    </div>
  );
}
