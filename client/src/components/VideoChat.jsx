import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, Sliders, Smile, PhoneOff, Volume2 } from "lucide-react";

/* ======================================================
   STUDIO CAMERA LOOKS — Subtle, Professional Color Grading
   (NO sparkles, clean and elegant)
   ====================================================== */
const STUDIO_LOOKS = [
  { id: "natural", label: "Natural", value: "none", desc: "Original feed" },
  { id: "studio", label: "Studio Pro", value: "contrast(1.05) brightness(1.04) saturate(1.06)", desc: "Enhanced skin" },
  { id: "warm", label: "Warm Glow", value: "contrast(1.08) brightness(1.02) saturate(1.12) sepia(8%)", desc: "Golden hour" },
  { id: "noir", label: "Cinema B&W", value: "grayscale(100%) contrast(1.22) brightness(1.02)", desc: "Classic 35mm" },
  { id: "midnight", label: "Midnight", value: "contrast(1.12) brightness(0.98) saturate(1.15) hue-rotate(12deg)", desc: "Cool moody" },
  { id: "vivid", label: "Vivid Pop", value: "contrast(1.06) saturate(1.24)", desc: "Crisp colors" },
];

/* Quick Live Video Reactions */
const LIVE_REACTIONS = ["👏", "🔥", "❤️", "😂", "🎉", "💯"];

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    {
      urls: "turn:free.expressturn.com:3478",
      username: import.meta.env.VITE_TURN_USERNAME,
      credential: import.meta.env.VITE_TURN_CREDENTIAL,
    },
  ],
};

/* Optimize video sender for crisp 720p/1080p stream */
const optimizeVideoChatParams = async (pc) => {
  const senders = pc.getSenders();
  for (const s of senders) {
    if (s.track?.kind === "video") {
      try {
        const p = s.getParameters();
        if (!p.encodings || p.encodings.length === 0) p.encodings = [{}];
        p.encodings[0].maxBitrate = 2_500_000; // 2.5 Mbps crisp HD
        p.encodings[0].scaleResolutionDownBy = 1;
        p.degradationPreference = "maintain-resolution";
        await s.setParameters(p);
      } catch (e) {
        console.warn("Could not set video params:", e);
      }
    }
  }
};

const VideoChat = ({ socket, roomId, username }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [activeLook, setActiveLook] = useState("none");
  const [activePanel, setActivePanel] = useState(null); // 'looks' | 'reactions'
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [floatingBursts, setFloatingBursts] = useState([]);

  const localVideoRef = useRef(null);
  const peerConnectionsRef = useRef(new Map());
  const localStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const animFrameRef = useRef(null);

  // Passive voice volume monitor (read-only: DOES NOT degrade system audio)
  const setupVoiceMeter = (stream) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser); // Never connect to destination! Only analyze volume!

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkVolume = () => {
        if (!audioContextRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        setIsSpeaking(avg > 18);
        animFrameRef.current = requestAnimationFrame(checkVolume);
      };
      checkVolume();
    } catch (e) {
      console.warn("Passive voice meter not available:", e);
    }
  };

  const cleanupVoiceMeter = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;
    setIsSpeaking(false);
  };

  const enableVideoChat = async () => {
    try {
      // High-Definition Video (720p/1080p) + Clean 48kHz Audio
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 30 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000, // 48kHz preserves full fidelity of shared screen & YouTube
          channelCount: 1,
        },
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsEnabled(true);

      setupVoiceMeter(stream);
      socket.emit("video_chat_enabled", { room: roomId, username });
    } catch (err) {
      console.error("Camera/Mic permission error:", err);
      alert("Could not access camera/mic: " + err.message);
    }
  };

  const disableVideoChat = useCallback(() => {
    cleanupVoiceMeter();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    setIsEnabled(false);
    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();
    setPeers([]);
    socket.emit("video_chat_disabled", { room: roomId });
  }, [socket, roomId]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !t.enabled;
      });
    }
    setIsMuted((prev) => !prev);
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !t.enabled;
      });
    }
    setIsCamOff((prev) => !prev);
  };

  const triggerLiveReaction = (emoji) => {
    spawnReactionBurst(emoji);
    socket.emit("video_live_reaction", { room: roomId, reaction: emoji });
    setActivePanel(null);
  };

  const spawnReactionBurst = (emoji) => {
    const burstId = Date.now() + Math.random();
    const count = 6;
    const particles = Array.from({ length: count }).map((_, i) => ({
      id: `${burstId}-${i}`,
      emoji,
      x: 20 + Math.random() * 60,
      delay: i * 0.08,
      size: 1.5 + Math.random() * 0.7,
    }));

    setFloatingBursts((prev) => [...prev, ...particles]);
    setTimeout(() => {
      setFloatingBursts((prev) => prev.filter((p) => !particles.some((pt) => pt.id === p.id)));
    }, 1800);
  };

  // Sync Studio Look
  useEffect(() => {
    if (isEnabled) {
      socket.emit("video_chat_effect", { room: roomId, filter: activeLook });
    }
  }, [isEnabled, activeLook, socket, roomId]);

  // Peer Signaling
  useEffect(() => {
    if (!isEnabled) return;

    const handlePeerEnabled = async ({ peerId, username: peerUsername }) => {
      if (!localStreamRef.current) return;
      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionsRef.current.set(peerId, pc);
      localStreamRef.current.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current));

      pc.ontrack = (event) => {
        setPeers((prev) => {
          const existing = prev.find((p) => p.peerId === peerId);
          if (existing) return prev.map((p) => (p.peerId === peerId ? { ...p, stream: event.streams[0] } : p));
          return [...prev, { peerId, username: peerUsername, stream: event.streams[0] }];
        });
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) socket.emit("video_chat_ice", { to: peerId, candidate: event.candidate, room: roomId });
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await optimizeVideoChatParams(pc);
      socket.emit("video_chat_offer", { to: peerId, offer: pc.localDescription, room: roomId, username });
    };

    const handleOffer = async ({ from, offer, username: peerUsername }) => {
      if (!localStreamRef.current) return;
      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionsRef.current.set(from, pc);
      localStreamRef.current.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current));

      pc.ontrack = (event) => {
        setPeers((prev) => {
          const existing = prev.find((p) => p.peerId === from);
          if (existing) return prev.map((p) => (p.peerId === from ? { ...p, stream: event.streams[0] } : p));
          return [...prev, { peerId: from, username: peerUsername || "Peer", stream: event.streams[0] }];
        });
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) socket.emit("video_chat_ice", { to: from, candidate: event.candidate, room: roomId });
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await optimizeVideoChatParams(pc);
      socket.emit("video_chat_answer", { to: from, answer: pc.localDescription, room: roomId, username });
    };

    const handleAnswer = async ({ from, answer }) => {
      const pc = peerConnectionsRef.current.get(from);
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleIce = async ({ from, candidate }) => {
      const pc = peerConnectionsRef.current.get(from);
      if (pc && candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    };

    const handlePeerDisabled = ({ peerId }) => {
      const pc = peerConnectionsRef.current.get(peerId);
      if (pc) {
        pc.close();
        peerConnectionsRef.current.delete(peerId);
      }
      setPeers((prev) => prev.filter((p) => p.peerId !== peerId));
    };

    const handleEffect = ({ from, filter }) => {
      setPeers((prev) => prev.map((p) => (p.peerId === from ? { ...p, filter } : p)));
    };

    const handleLiveReaction = ({ reaction }) => {
      spawnReactionBurst(reaction);
    };

    socket.on("peer_video_chat_enabled", handlePeerEnabled);
    socket.on("video_chat_offer", handleOffer);
    socket.on("video_chat_answer", handleAnswer);
    socket.on("video_chat_ice", handleIce);
    socket.on("peer_video_chat_disabled", handlePeerDisabled);
    socket.on("video_chat_effect", handleEffect);
    socket.on("video_live_reaction", handleLiveReaction);

    return () => {
      socket.off("peer_video_chat_enabled", handlePeerEnabled);
      socket.off("video_chat_offer", handleOffer);
      socket.off("video_chat_answer", handleAnswer);
      socket.off("video_chat_ice", handleIce);
      socket.off("peer_video_chat_disabled", handlePeerDisabled);
      socket.off("video_chat_effect", handleEffect);
      socket.off("video_live_reaction", handleLiveReaction);
    };
  }, [isEnabled, socket, roomId, username]);

  useEffect(() => {
    return () => disableVideoChat();
  }, [disableVideoChat]);

  // Clean, sleek pre-join state (Restored to original clean horizontal card style)
  if (!isEnabled) {
    return (
      <div style={{ padding: "16px", width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f1f5f9",
              }}
            >
              <Video size={18} />
            </div>
            <div>
              <p style={{ color: "#f1f5f9", fontSize: "0.88rem", margin: 0, fontWeight: "600" }}>
                Video Call
              </p>
              <p style={{ color: "#64748b", fontSize: "0.72rem", margin: "2px 0 0 0" }}>
                Camera & microphone
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={enableVideoChat}
            style={{
              background: "#ffffff",
              color: "#0f172a",
              border: "none",
              padding: "9px 18px",
              borderRadius: "9px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.82rem",
              letterSpacing: "0.3px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
            }}
          >
            Enable
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const hasPeer = peers.length > 0;
  const mainStream = hasPeer ? peers[0].stream : localStream;
  const isMainLocal = !hasPeer;

  return (
    <div className="vc-active-root">
      {/* Main Video Viewport */}
      <div className={`vc-video-box ${isSpeaking && isMainLocal ? "speaking-glow" : ""}`}>
        <video
          ref={(el) => {
            if (el) {
              if (mainStream && el.srcObject !== mainStream) el.srcObject = mainStream;
              if (isMainLocal) localVideoRef.current = el;
            }
          }}
          autoPlay
          playsInline
          muted={isMainLocal}
          className="vc-main-video"
          style={{
            transform: isMainLocal ? "scaleX(-1)" : "none",
            filter: isMainLocal ? activeLook : (peers[0]?.filter || "none"),
          }}
        />

        {/* Camera Off Placeholder */}
        {isMainLocal && isCamOff && (
          <div className="vc-cam-off-screen">
            <div className="vc-avatar-large">{username.charAt(0).toUpperCase()}</div>
            <span className="vc-cam-off-text">Camera Off</span>
          </div>
        )}

        {/* Name tag with Mic indicator */}
        <div className="vc-tag-overlay">
          <span className="vc-tag-name">{isMainLocal ? `${username} (You)` : peers[0].username}</span>
          {isMuted && isMainLocal && (
            <span className="vc-tag-muted">
              <MicOff size={11} />
            </span>
          )}
          {isSpeaking && isMainLocal && (
            <span className="vc-tag-speaking">
              <Volume2 size={11} />
            </span>
          )}
        </div>

        {/* Floating live reaction burst stream */}
        <AnimatePresence>
          {floatingBursts.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -180, scale: p.size }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, delay: p.delay, ease: "easeOut" }}
              className="vc-floating-particle"
              style={{ left: `${p.x}%` }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Local PiP thumbnail when peer is present */}
      {hasPeer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`vc-pip-container ${isSpeaking ? "speaking-glow-sm" : ""}`}
        >
          <video
            ref={(el) => {
              if (el && localStream && el.srcObject !== localStream) {
                el.srcObject = localStream;
                localVideoRef.current = el;
              }
            }}
            autoPlay
            playsInline
            muted
            className="vc-pip-video"
            style={{ transform: "scaleX(-1)", filter: activeLook }}
          />
          {isCamOff && (
            <div className="vc-pip-cam-off">
              <div className="vc-avatar-small">{username.charAt(0).toUpperCase()}</div>
            </div>
          )}
          <span className="vc-pip-label">You</span>
        </motion.div>
      )}

      {/* Floating Control Toolbar */}
      <div className="vc-toolbar">
        <motion.button
          whileTap={{ scale: 0.92 }}
          className={`vc-tool-btn ${isMuted ? "btn-danger" : ""}`}
          onClick={toggleMute}
          title={isMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.92 }}
          className={`vc-tool-btn ${isCamOff ? "btn-danger" : ""}`}
          onClick={toggleCamera}
          title={isCamOff ? "Turn Camera On" : "Turn Camera Off"}
        >
          {isCamOff ? <VideoOff size={15} /> : <Video size={15} />}
        </motion.button>

        <div className="vc-divider" />

        {/* Clean Sliders icon for Studio Looks — NO SPARKLES */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          className={`vc-tool-btn ${activePanel === "looks" ? "active" : ""}`}
          onClick={() => setActivePanel((p) => (p === "looks" ? null : "looks"))}
          title="Studio Looks"
        >
          <Sliders size={15} />
        </motion.button>

        {/* Clean Smile icon for Live Reactions — NO SPARKLES */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          className={`vc-tool-btn ${activePanel === "reactions" ? "active" : ""}`}
          onClick={() => setActivePanel((p) => (p === "reactions" ? null : "reactions"))}
          title="Live Reactions"
        >
          <Smile size={15} />
        </motion.button>

        <div className="vc-divider" />

        {/* Professional Solid Red Call End Button with PhoneOff */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="vc-end-call-btn"
          onClick={disableVideoChat}
          title="End Video Call"
        >
          <PhoneOff size={16} strokeWidth={2.4} />
        </motion.button>
      </div>

      {/* Popovers for Studio Looks & Live Reactions */}
      <AnimatePresence>
        {activePanel === "looks" && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="vc-popover-panel"
          >
            <div className="vc-panel-header">
              <span className="vc-panel-title">Studio Looks</span>
              <span className="vc-panel-desc">Subtle camera color grading</span>
            </div>
            <div className="vc-looks-grid">
              {STUDIO_LOOKS.map((look) => (
                <button
                  key={look.id}
                  className={`vc-look-card ${activeLook === look.value ? "active" : ""}`}
                  onClick={() => setActiveLook(look.value)}
                >
                  <span className="vc-look-name">{look.label}</span>
                  <span className="vc-look-sub">{look.desc}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {activePanel === "reactions" && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="vc-popover-panel"
          >
            <div className="vc-panel-header">
              <span className="vc-panel-title">Live Reactions</span>
              <span className="vc-panel-desc">Stream animated bursts over video</span>
            </div>
            <div className="vc-reactions-bar">
              {LIVE_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  className="vc-reaction-btn"
                  onClick={() => triggerLiveReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .vc-active-root {
          width: 100%;
          height: 100%;
          position: relative;
          background: #09090d;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .vc-video-box {
          flex: 1;
          width: 100%;
          height: 100%;
          position: relative;
          background: #000;
          overflow: hidden;
          transition: box-shadow 0.25s ease;
        }
        .vc-main-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: #000;
        }

        .speaking-glow {
          box-shadow: inset 0 0 0 2px #22c55e, inset 0 0 24px rgba(34, 197, 94, 0.45);
        }
        .speaking-glow-sm {
          border-color: #22c55e !important;
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.6) !important;
        }

        .vc-cam-off-screen {
          position: absolute;
          inset: 0;
          background: #111116;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .vc-avatar-large {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          font-size: 1.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .vc-cam-off-text {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 500;
        }

        .vc-tag-overlay {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(14, 14, 18, 0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 4px 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 10;
        }
        .vc-tag-name {
          font-size: 0.72rem;
          color: #f1f5f9;
          font-weight: 600;
        }
        .vc-tag-muted {
          color: #ef4444;
          display: flex;
          align-items: center;
        }
        .vc-tag-speaking {
          color: #22c55e;
          display: flex;
          align-items: center;
        }

        /* PiP Container */
        .vc-pip-container {
          position: absolute;
          bottom: 64px;
          right: 12px;
          width: 96px;
          height: 136px;
          border-radius: 12px;
          overflow: hidden;
          background: #121216;
          border: 2px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
          z-index: 15;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .vc-pip-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .vc-pip-cam-off {
          position: absolute;
          inset: 0;
          background: #121218;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vc-avatar-small {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          font-size: 0.9rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vc-pip-label {
          position: absolute;
          bottom: 4px;
          left: 6px;
          font-size: 0.58rem;
          color: #cbd5e1;
          background: rgba(0, 0, 0, 0.6);
          padding: 1px 4px;
          border-radius: 4px;
        }

        /* Control Toolbar */
        .vc-toolbar {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(18, 18, 24, 0.94);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px 8px;
          border-radius: 12px;
          z-index: 25;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
        }
        .vc-tool-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .vc-tool-btn:hover {
          background: rgba(255, 255, 255, 0.14);
          color: #fff;
        }
        .vc-tool-btn.active {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.35);
          color: #ffffff;
        }
        .btn-danger {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.45);
          color: #ef4444;
        }

        /* Solid Red Premium Call End Button */
        .vc-end-call-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #dc2626;
          color: #ffffff;
          border: 1px solid rgba(239, 68, 68, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(220, 38, 38, 0.35);
          transition: all 0.15s ease;
        }
        .vc-end-call-btn:hover {
          background: #ef4444;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.5);
        }

        .vc-divider {
          width: 1px;
          height: 18px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0 2px;
        }

        /* Popovers */
        .vc-popover-panel {
          position: absolute;
          bottom: 60px;
          left: 12px;
          right: 12px;
          background: rgba(18, 18, 24, 0.98);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          padding: 12px;
          z-index: 30;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.8);
        }
        .vc-panel-header {
          margin-bottom: 10px;
        }
        .vc-panel-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #f8fafc;
          display: block;
        }
        .vc-panel-desc {
          font-size: 0.65rem;
          color: #64748b;
        }

        /* Looks Grid */
        .vc-looks-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
        .vc-look-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 6px 8px;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s;
        }
        .vc-look-card:hover {
          background: rgba(255, 255, 255, 0.07);
        }
        .vc-look-card.active {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.4);
        }
        .vc-look-name {
          font-size: 0.72rem;
          font-weight: 600;
          color: #f1f5f9;
          display: block;
        }
        .vc-look-sub {
          font-size: 0.58rem;
          color: #64748b;
        }

        /* Reactions Bar */
        .vc-reactions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 0;
        }
        .vc-reaction-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          font-size: 1.4rem;
          width: 38px;
          height: 38px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s;
        }
        .vc-reaction-btn:hover {
          transform: scale(1.25);
          background: rgba(255, 255, 255, 0.1);
        }

        /* Floating particles */
        .vc-floating-particle {
          position: absolute;
          bottom: 20px;
          font-size: 1.8rem;
          pointer-events: none;
          z-index: 20;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6));
        }
      `}</style>
    </div>
  );
};

export default VideoChat;
