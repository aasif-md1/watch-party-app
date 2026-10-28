import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "./home/Navbar";
import { Hero } from "./home/Hero";
import { FeatureGrid } from "./home/FeatureGrid";
import { RoomShowcase } from "./home/RoomShowcase";
import { HowItWorks } from "./home/HowItWorks";
import { FaqSection } from "./home/FaqSection";
import { CtaBanner } from "./home/CtaBanner";
import { Footer } from "./home/Footer";
import { InfoModal } from "./home/InfoModal";

const Home = () => {
  const { user, authLoading, signInWithGoogle, signOut, updateCustomName } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isHinglish, setIsHinglish] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalTab, setInfoModalTab] = useState("about");

  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const openCreateModal = () => navigate("/room?action=create");
  const openJoinModal = () => navigate("/room?action=join");

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#0A0B0E",
        color: "#FFFFFF",
        position: "relative",
        overflowX: "hidden"
      }}
    >
      {/* Subtle film grain texture overlay across page */}
      <div className="film-grain-overlay" aria-hidden="true" />

      <Helmet>
        <title>WatchParty — Watch YouTube & Any Movie Together</title>
        <meta
          name="description"
          content="WatchParty — Watch YouTube together in sync for free. Enjoy live chat, video call, screen sharing, and synchronized playback with friends. No download required!"
        />
        <meta property="og:title" content="WatchParty — Watch YouTube Together in Sync" />
        <meta
          property="og:description"
          content="WatchParty — Watch YouTube together in sync for free. Enjoy live chat, video call, screen sharing, and synchronized playback with friends. No download required!"
        />
        <meta property="og:url" content="https://watchparty.website/" />
        <link rel="canonical" href="https://watchparty.website/" />
      </Helmet>

      {/* 1. Header / Navbar matching reference mockup */}
      <Navbar
        user={user}
        authLoading={authLoading}
        signOut={signOut}
        signInWithGoogle={signInWithGoogle}
        updateCustomName={updateCustomName}
        openCreateModal={openCreateModal}
        isMobile={isMobile}
      />

      {/* 2. Hero Section (2 Columns: Typography & CTA left, Space Video TV mockup right) */}
      <Hero
        openCreateModal={openCreateModal}
        openJoinModal={openJoinModal}
        isHinglish={isHinglish}
        isMobile={isMobile}
      />

      {/* 3. Feature Grid (4 clean equal cards in 1 row) */}
      <FeatureGrid isHinglish={isHinglish} isMobile={isMobile} />

      {/* 3.5 Cinematic Room Showcase (Inside The Theater - Live Leo Movie & Chat Preview) */}
      <RoomShowcase
        openCreateModal={openCreateModal}
        openJoinModal={openJoinModal}
        isHinglish={isHinglish}
        isMobile={isMobile}
      />

      {/* 4. How It Works Section ("Get Started in Seconds" with 4 steps) */}
      <HowItWorks
        isHinglish={isHinglish}
        setIsHinglish={setIsHinglish}
        isMobile={isMobile}
      />

      {/* 5. Frequently Asked Questions (FAQ) Section */}
      <FaqSection
        openCreateModal={openCreateModal}
        openJoinModal={openJoinModal}
        isHinglish={isHinglish}
        isMobile={isMobile}
      />

      {/* 6. Full-Width Crimson CTA Banner */}
      <CtaBanner
        openCreateModal={openCreateModal}
        openJoinModal={openJoinModal}
        isHinglish={isHinglish}
        isMobile={isMobile}
      />

      {/* 7. Footer matching reference mockup with working links */}
      <Footer
        onOpenInfoModal={(tab) => {
          setInfoModalTab(tab);
          setInfoModalOpen(true);
        }}
        isMobile={isMobile}
      />

      {/* Info / About / Privacy / Terms / Contact Working Modal */}
      <InfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        initialTab={infoModalTab}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Home;