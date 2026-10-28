import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Clock,
  HelpCircle
} from "lucide-react";
import { Navbar } from "./home/Navbar";
import { Footer } from "./home/Footer";
import { useAuth } from "../hooks/useAuth";

export default function Contact() {
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    category: "general",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Please enter your name.";
    if (!formData.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.subject.trim()) errs.subject = "Please provide a subject line.";
    if (!formData.message.trim()) {
      errs.message = "Please write your message.";
    } else if (formData.message.trim().length < 15) {
      errs.message = "Message should be at least 15 characters long.";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    // Simulate real network submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const resetForm = () => {
    setFormData({
      name: user?.displayName || "",
      email: user?.email || "",
      category: "general",
      subject: "",
      message: ""
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div style={{ background: "#08080A", color: "#FFFFFF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>Contact Us — WatchParty Support</title>
        <meta
          name="description"
          content="Get in touch with the WatchParty team. Contact support for bug reports, feature requests, partnership inquiries, or general questions."
        />
      </Helmet>

      <Navbar
        user={user}
        authLoading={authLoading}
        signOut={signOut}
        openCreateModal={() => { window.location.href = "/"; }}
        isMobile={false}
      />

      <main style={{ flex: 1, paddingTop: "110px", paddingBottom: "80px", maxWidth: "1440px", margin: "0 auto", width: "100%", paddingLeft: "36px", paddingRight: "36px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "32px" }}>
          <Link to="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#E50914", fontWeight: "600" }}>Contact Us</span>
        </div>

        {/* Section Header */}
        <header style={{ marginBottom: "48px", maxWidth: "700px" }}>

          <h1 className="font-heading" style={{ fontSize: "clamp(2.3rem, 4.5vw, 3.6rem)", fontWeight: "900", lineHeight: 1.1, margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>
            We'd Love to Hear<br />
            <span style={{ background: "linear-gradient(90deg, #E50914 0%, #FF5A78 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              From You.
            </span>
          </h1>

          <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "rgba(255,255,255,0.7)", margin: 0 }}>
            Encountered a bug? Have a killer feature idea? Or want to partner with us? Drop a message below and our engineering team will respond within 24 hours.
          </p>
        </header>

        {/* 2-Column Grid: Form on Left, Contact Details on Right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
            alignItems: "start"
          }}
        >
          {/* Contact Form Container */}
          <div
            style={{
              background: "#121217",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "36px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.6)"
            }}
          >
            {isSubmitted ? (
              <div style={{ textAlign: "center", padding: "40px 10px" }}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "rgba(34, 197, 94, 0.15)",
                    border: "1px solid rgba(34, 197, 94, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    color: "#22c55e"
                  }}
                >
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "800", margin: "0 0 10px 0" }}>
                  Message Received!
                </h3>
                <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", maxWidth: "400px", margin: "0 auto 28px" }}>
                  Thanks for reaching out, <strong>{formData.name}</strong>. We've logged your message and sent an acknowledgement to <strong>{formData.email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: "10px 24px",
                    background: "#E50914",
                    border: "none",
                    borderRadius: "24px",
                    color: "#FFFFFF",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    cursor: "pointer"
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Name & Email Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aman Sharma"
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        background: "#181820",
                        border: errors.name ? "1px solid #E50914" : "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontSize: "0.9rem",
                        outline: "none"
                      }}
                    />
                    {errors.name && <span style={{ color: "#E50914", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>{errors.name}</span>}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        background: "#181820",
                        border: errors.email ? "1px solid #E50914" : "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontSize: "0.9rem",
                        outline: "none"
                      }}
                    />
                    {errors.email && <span style={{ color: "#E50914", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>{errors.email}</span>}
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                    Topic Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#181820",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.9rem",
                      outline: "none",
                      cursor: "pointer"
                    }}
                  >
                    <option value="general">General Question</option>
                    <option value="bug">Report a Bug / Sync Glitch</option>
                    <option value="feature">Feature Request / Suggestion</option>
                    <option value="partnership">Business / Creator Partnership</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief summary of your inquiry"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#181820",
                      border: errors.subject ? "1px solid #E50914" : "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                  />
                  {errors.subject && <span style={{ color: "#E50914", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>{errors.subject}</span>}
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist you today? Please share as much detail as possible..."
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#181820",
                      border: errors.message ? "1px solid #E50914" : "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.9rem",
                      outline: "none",
                      resize: "vertical"
                    }}
                  />
                  {errors.message && <span style={{ color: "#E50914", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>{errors.message}</span>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "14px 28px",
                    background: "#E50914",
                    border: "none",
                    borderRadius: "10px",
                    color: "#FFFFFF",
                    fontSize: "0.95rem",
                    fontWeight: "800",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 18px rgba(229, 9, 20, 0.4)",
                    transition: "all 0.2s ease",
                    marginTop: "6px"
                  }}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Side: Quick Info Channels */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#121217", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(229,9,20,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#E50914" }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: "700" }}>Direct Email</div>
                  <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>For inquiries and press</div>
                </div>
              </div>
              <a href="mailto:support@watchparty.app" style={{ color: "#FFFFFF", fontWeight: "600", textDecoration: "underline", fontSize: "0.95rem" }}>
                support@watchparty.app
              </a>
            </div>

            <div style={{ background: "#121217", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(229,9,20,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#E50914" }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: "700" }}>Turnaround Time</div>
                  <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>Engineering triage</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
                Our core team reviews support tickets twice daily. Expect a response in under 24 hours on business days.
              </p>
            </div>

            <div style={{ background: "#121217", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(229,9,20,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#E50914" }}>
                  <HelpCircle size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: "700" }}>Common Questions?</div>
                  <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>Quick answers</div>
                </div>
              </div>
              <p style={{ margin: "0 0 12px 0", fontSize: "0.88rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
                Many questions regarding room limits, video sync, and screen sharing are answered in our FAQ.
              </p>
              <Link to="/#faq" style={{ color: "#E50914", fontWeight: "700", fontSize: "0.88rem", textDecoration: "none" }}>
                View FAQ Section →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer isMobile={false} />
    </div>
  );
}
