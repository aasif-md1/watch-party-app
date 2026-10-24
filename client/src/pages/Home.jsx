import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "./home/Navbar";
import { Hero } from "./home/Hero";
import { FeatureGrid } from "./home/FeatureGrid";
import { HowItWorks } from "./home/HowItWorks";
import { FaqSection } from "./home/FaqSection";
import { CtaBanner } from "./home/CtaBanner";
import { Footer } from "./home/Footer";
import { CreateRoomModal } from "./home/CreateRoomModal";
import { JoinRoomModal } from "./home/JoinRoomModal";
import { RoomIdModal } from "./home/RoomIdModal";
import { LoginModal } from "./home/LoginModal";
import { InfoModal } from "./home/InfoModal";

const isValidYouTubeUrl = (url) => {
  const patterns = [
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?.*v=[\w-]{11}/,
    /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]{11}/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]{11}/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]{11}/,
    /^(https?:\/\/)?m\.youtube\.com\/watch\?.*v=[\w-]{11}/,
  ];
  return patterns.some((pattern) => pattern.test(url.trim()));
};

const Home = () => {
  const { user, authLoading, signInWithGoogle, signOut, updateCustomName } = useAuth();
  const [username, setUsername] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isHinglish, setIsHinglish] = useState(false);
  const [roomMode, setRoomMode] = useState("youtube");
  const [generatedRoomId, setGeneratedRoomId] = useState("");
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // New Modals for the exact reference design flow
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalTab, setInfoModalTab] = useState("about");

  const pendingAction = useRef(null); // "create" or "join"
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Post-login auto-continue pending action
  useEffect(() => {
    if (user && pendingAction.current) {
      const action = pendingAction.current;
      pendingAction.current = null;
      setShowLoginModal(false);
      setIsCreateModalOpen(false);
      setIsJoinModalOpen(false);
      setTimeout(() => {
        if (action === "create") {
          executeCreateRoom();
        } else if (action === "join") {
          executeJoinRoom();
        }
      }, 100);
    }
  }, [user]);

  const handleVideoUrlChange = (e) => {
    const val = e.target.value;
    setVideoUrl(val);
    if (val && !isValidYouTubeUrl(val)) {
      setLinkError("Please enter a valid YouTube video link");
    } else {
      setLinkError("");
    }
  };

  const validateCreateFields = () => {
    if (!username.trim()) {
      alert("Please enter a username!");
      return false;
    }
    if (roomMode === "youtube") {
      if (!videoUrl) {
        alert("Please enter a YouTube video link!");
        return false;
      }
      if (!isValidYouTubeUrl(videoUrl)) {
        setLinkError("Please enter a valid YouTube video link");
        return false;
      }
    }
    return true;
  };

  const validateJoinFields = () => {
    if (!username.trim()) {
      alert("Please enter a username!");
      return false;
    }
    if (roomMode === "youtube") {
      if (!joinRoomId || !videoUrl) {
        alert("Room ID and YouTube link cannot be empty!");
        return false;
      }
      if (!isValidYouTubeUrl(videoUrl)) {
        setLinkError("Please enter a valid YouTube video link");
        return false;
      }
    } else {
      if (!joinRoomId) {
        alert("Room ID cannot be empty!");
        return false;
      }
    }
    return true;
  };

  const executeCreateRoom = useCallback(() => {
    const newId = nanoid();
    setGeneratedRoomId(newId);
    setCopied(false);
    setShowRoomModal(true);
  }, []);

  const executeJoinRoom = useCallback(() => {
    localStorage.setItem("wp_username", username.trim());
    if (roomMode === "youtube") {
      localStorage.setItem("wp_videoUrl", videoUrl);
      localStorage.setItem("wp_roomMode", "youtube");
      navigate(`/stream/${joinRoomId}`);
    } else {
      localStorage.setItem("wp_roomMode", "screenshare");
      navigate(`/screen/${joinRoomId}`);
    }
  }, [roomMode, videoUrl, joinRoomId, navigate, username]);

  const createRoom = () => {
    if (!validateCreateFields()) return;
    if (!user) {
      pendingAction.current = "create";
      setIsCreateModalOpen(false);
      setShowLoginModal(true);
      return;
    }
    setIsCreateModalOpen(false);
    executeCreateRoom();
  };

  const handleJoinRoom = () => {
    if (!validateJoinFields()) return;
    if (!user) {
      pendingAction.current = "join";
      setIsJoinModalOpen(false);
      setShowLoginModal(true);
      return;
    }
    setIsJoinModalOpen(false);
    executeJoinRoom();
  };

  const enterGeneratedRoom = () => {
    localStorage.setItem("wp_username", username.trim());
    if (roomMode === "youtube") {
      localStorage.setItem("wp_videoUrl", videoUrl);
      localStorage.setItem("wp_roomMode", "youtube");
      navigate(`/stream/${generatedRoomId}`);
    } else {
      localStorage.setItem("wp_roomMode", "screenshare");
      navigate(`/screen/${generatedRoomId}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(generatedRoomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = generatedRoomId;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
        openCreateModal={() => setIsCreateModalOpen(true)}
        isMobile={isMobile}
      />

      {/* 2. Hero Section (2 Columns: Typography & CTA left, Space Video TV mockup right) */}
      <Hero
        openCreateModal={() => setIsCreateModalOpen(true)}
        openJoinModal={() => setIsJoinModalOpen(true)}
        isHinglish={isHinglish}
        isMobile={isMobile}
      />

      {/* 3. Feature Grid (4 clean equal cards in 1 row) */}
      <FeatureGrid isHinglish={isHinglish} isMobile={isMobile} />

      {/* 4. How It Works Section ("Get Started in Seconds" with 4 steps) */}
      <HowItWorks
        isHinglish={isHinglish}
        setIsHinglish={setIsHinglish}
        isMobile={isMobile}
      />

      {/* 5. Frequently Asked Questions (FAQ) Section */}
      <FaqSection
        openCreateModal={() => setIsCreateModalOpen(true)}
        openJoinModal={() => setIsJoinModalOpen(true)}
        isHinglish={isHinglish}
        isMobile={isMobile}
      />

      {/* 6. Full-Width Crimson CTA Banner */}
      <CtaBanner
        openCreateModal={() => setIsCreateModalOpen(true)}
        openJoinModal={() => setIsJoinModalOpen(true)}
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

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        roomMode={roomMode}
        setRoomMode={setRoomMode}
        username={username}
        setUsername={setUsername}
        videoUrl={videoUrl}
        handleVideoUrlChange={handleVideoUrlChange}
        linkError={linkError}
        setLinkError={setLinkError}
        createRoom={createRoom}
        isMobile={isMobile}
      />

      {/* Join Room Modal */}
      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        roomMode={roomMode}
        setRoomMode={setRoomMode}
        username={username}
        setUsername={setUsername}
        joinRoomId={joinRoomId}
        setJoinRoomId={setJoinRoomId}
        videoUrl={videoUrl}
        handleVideoUrlChange={handleVideoUrlChange}
        linkError={linkError}
        setLinkError={setLinkError}
        handleJoinRoom={handleJoinRoom}
        isMobile={isMobile}
      />

      {/* Room ID Generated Modal */}
      <RoomIdModal
        showRoomModal={showRoomModal}
        setShowRoomModal={setShowRoomModal}
        generatedRoomId={generatedRoomId}
        copied={copied}
        copyRoomId={copyRoomId}
        enterGeneratedRoom={enterGeneratedRoom}
        isMobile={isMobile}
      />

      {/* Login Authentication Modal */}
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        pendingAction={pendingAction}
        handleGoogleLogin={handleGoogleLogin}
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