import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../hooks/useAuth";
import ChatBox from "../components/ChatBox";
import VideoChat from "../components/VideoChat";
import { BrandLogo } from "../components/BrandLogo";
import { MessageSquare, Video, ScreenShare, Users, UserMinus, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

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

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const optimizeSenderParams = async (pc) => {
  const senders = pc.getSenders();
  for (const sender of senders) {
    if (sender.track?.kind === "video") {
      try {
        const params = sender.getParameters();
        if (!params.encodings || params.encodings.length === 0) {
          params.encodings = [{}];
        }
        params.encodings[0].maxBitrate = 3_500_000;
        params.encodings[0].maxFramerate = 30;
        params.encodings[0].scaleResolutionDownBy = 1;
        params.degradationPreference = "maintain-resolution";
        await sender.setParameters(params);
      } catch (e) {
        console.warn("Could not set sender params:", e);
      }
    }
  }
};

const ScreenShareRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useAuth();

  const username = localStorage.getItem("wp_username") || user?.displayName || "Watcher";
  const userId = user?.uid || localStorage.getItem("wp_userId") || `user_${Date.now()}`;
  if (!localStorage.getItem("wp_userId")) {
    try { localStorage.setItem("wp_userId", userId); } catch {}
  }

  const [isMobile, setIsMobile] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isPresenter, setIsPresenter] = useState(false);
  const [shareError, setShareError] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [showSidebar, setShowSidebar] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [memberCount, setMemberCount] = useState(1);
  const [roomUsers, setRoomUsers] = useState([]);
  const [hostId, setHostId] = useState("");
  const [showParticipantsDropdown, setShowParticipantsDropdown] = useState(false);
  const [chatToast, setChatToast] = useState(null);

  const isHost = hostId ? hostId === userId : (localStorage.getItem(`wp_host_${roomId}`) === "true");

  const localStreamRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const isPresenterRef = useRef(false);
  const peerConnectionsRef = useRef(new Map());
  const presenterIceQueues = useRef(new Map());
  const viewerPcRef = useRef(null);
  const viewerIceQueue = useRef([]);
  const chatToastTimer = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    isPresenterRef.current = isPresenter;
  }, [isPresenter]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowParticipantsDropdown(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const check = () => {
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTouch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isMobileUserAgent || (isTouch && isSmallScreen));
      setIsIOSDevice(isIOS());
    };
    check();
    window.addEventListener("resize", check);

    const lockOrientation = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen().catch(() => {});
        }
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock("landscape").catch(() => {});
        }
      } catch (e) {
        console.warn("Fullscreen/Orientation lock failed", e);
      }
    };
    if (window.innerWidth < 768) lockOrientation();

    return () => {
      window.removeEventListener("resize", check);
      try {
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    const handleMsg = (data) => {
      if (activeTab !== "chat") setUnreadCount((c) => c + 1);
      if (!showSidebar || activeTab !== "chat") {
        setChatToast({ author: data.author, message: data.message });
        if (chatToastTimer.current) clearTimeout(chatToastTimer.current);
        chatToastTimer.current = setTimeout(() => setChatToast(null), 4000);
      }
    };
    socket.on("receive_message", handleMsg);
    return () => socket.off("receive_message", handleMsg);
  }, [socket, activeTab, showSidebar]);

  useEffect(() => {
    if (activeTab === "chat") setUnreadCount(0);
  }, [activeTab]);

  const stopSharing = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();
    presenterIceQueues.current.clear();
    if (isPresenterRef.current) {
      socket.emit("stop_screen_share", { room: roomId, userId });
    }
    setIsSharing(false);
    setIsPresenter(false);
  }, [socket, roomId, userId]);

  // Join room & socket events
  useEffect(() => {
    const isHostInitial = localStorage.getItem(`wp_host_${roomId}`) === "true";
    const joinPayload = {
      roomId,
      roomType: "screenshare",
      username,
      userId,
      isHost: isHostInitial,
    };

    socket.emit("join_room", joinPayload);

    const handleRoomState = (state) => {
      setConnectionStatus("connected");
      if (state.hostId) setHostId(state.hostId);
      if (state.isScreenSharing && state.presenterId !== socket.id) {
        setIsSharing(true);
        setIsPresenter(false);
        socket.emit("request_screen_share", { room: roomId });
      }
    };

    const handleConnect = () => {
      setConnectionStatus("connected");
      socket.emit("join_room", joinPayload);

      if (
        isPresenterRef.current &&
        localStreamRef.current &&
        localStreamRef.current.getVideoTracks().some((t) => t.readyState === "live")
      ) {
        socket.emit("start_screen_share", { room: roomId, userId });
      } else if (!isPresenterRef.current) {
        socket.emit("request_screen_share", { room: roomId });
      }
    };

    const handleDisconnect = () => setConnectionStatus("disconnected");

    const handleRoomUsers = ({ count, users, hostId: hId }) => {
      if (typeof count === "number") setMemberCount(count);
      if (Array.isArray(users)) setRoomUsers(users);
      if (hId) setHostId(hId);
    };

    const handleKicked = (data) => {
      alert(data?.reason || "You were removed from the room by the host.");
      stopSharing();
      navigate("/");
    };

    socket.on("room_state", handleRoomState);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("room_users_update", handleRoomUsers);
    socket.on("member_count_update", (count) => setMemberCount(count));
    socket.on("kicked_from_room", handleKicked);

    if (socket.connected) setConnectionStatus("connected");

    return () => {
      socket.off("room_state", handleRoomState);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("room_users_update", handleRoomUsers);
      socket.off("member_count_update");
      socket.off("kicked_from_room", handleKicked);
      stopSharing();
    };
  }, [socket, roomId, username, userId, navigate, stopSharing]);

  // Presenter handling viewers
  useEffect(() => {
    const handleViewerJoined = async ({ viewerId }) => {
      if (!localStreamRef.current) return;

      if (peerConnectionsRef.current.has(viewerId)) {
        peerConnectionsRef.current.get(viewerId).close();
        peerConnectionsRef.current.delete(viewerId);
      }
      presenterIceQueues.current.set(viewerId, []);

      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionsRef.current.set(viewerId, pc);

      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("screen_ice_candidate", { to: viewerId, candidate: event.candidate, room: roomId });
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === "failed" || pc.iceConnectionState === "disconnected") {
          console.warn(`Viewer ${viewerId} connection state: ${pc.iceConnectionState}`);
        }
      };

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await optimizeSenderParams(pc);
        socket.emit("screen_share_offer", { to: viewerId, offer: pc.localDescription, room: roomId });
      } catch (err) {
        console.error("Error creating presenter offer for viewer:", err);
      }
    };

    const handleAnswer = async ({ from, answer }) => {
      const pc = peerConnectionsRef.current.get(from);
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          const q = presenterIceQueues.current.get(from) || [];
          while (q.length > 0) {
            const candidate = q.shift();
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {}
          }
        } catch (e) {
          console.error("Presenter setRemoteDescription error:", e);
        }
      }
    };

    const handleIce = async ({ from, candidate }) => {
      if (!candidate) return;
      const pc = peerConnectionsRef.current.get(from);
      if (pc && pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.warn("Presenter addIceCandidate error:", e);
        }
      } else if (pc) {
        let q = presenterIceQueues.current.get(from);
        if (!q) {
          q = [];
          presenterIceQueues.current.set(from, q);
        }
        q.push(candidate);
      }
    };

    const handleStopped = () => {
      setRemoteStream(null);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      setIsSharing(false);
    };

    socket.on("viewer_joined", handleViewerJoined);
    socket.on("screen_share_answer", handleAnswer);
    socket.on("screen_ice_candidate", handleIce);
    socket.on("screen_share_stopped", handleStopped);

    return () => {
      socket.off("viewer_joined", handleViewerJoined);
      socket.off("screen_share_answer", handleAnswer);
      socket.off("screen_ice_candidate", handleIce);
      socket.off("screen_share_stopped", handleStopped);
    };
  }, [socket, roomId]);

  // Viewer handling stream
  useEffect(() => {
    const handleShareStarted = ({ presenterId }) => {
      if (presenterId !== socket.id) {
        setIsSharing(true);
        setIsPresenter(false);
        socket.emit("request_screen_share", { room: roomId });
      }
    };

    const handleShareStopped = () => {
      setIsSharing(false);
      setIsPresenter(false);
      setRemoteStream(null);
      if (viewerPcRef.current) {
        viewerPcRef.current.close();
        viewerPcRef.current = null;
      }
      viewerIceQueue.current = [];
    };

    const handleOffer = async ({ from, offer }) => {
      if (viewerPcRef.current) {
        viewerPcRef.current.close();
      }
      viewerIceQueue.current = [];

      const pc = new RTCPeerConnection(ICE_SERVERS);
      viewerPcRef.current = pc;

      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        } else if (event.track) {
          setRemoteStream(new MediaStream([event.track]));
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("screen_ice_candidate", { to: from, candidate: event.candidate, room: roomId });
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === "failed") {
          socket.emit("request_screen_share", { room: roomId });
        }
      };

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        while (viewerIceQueue.current.length > 0) {
          const cand = viewerIceQueue.current.shift();
          try {
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          } catch (e) {}
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("screen_share_answer", { to: from, answer: pc.localDescription, room: roomId });
      } catch (err) {
        console.error("Viewer handleOffer error:", err);
      }
    };

    const handleIce = async ({ from, candidate }) => {
      if (!candidate) return;
      if (viewerPcRef.current && viewerPcRef.current.remoteDescription) {
        try {
          await viewerPcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.warn("Viewer addIceCandidate error:", e);
        }
      } else {
        viewerIceQueue.current.push(candidate);
      }
    };

    socket.on("screen_share_started", handleShareStarted);
    socket.on("screen_share_stopped", handleShareStopped);
    socket.on("screen_share_offer", handleOffer);
    socket.on("screen_ice_candidate", handleIce);

    return () => {
      socket.off("screen_share_started", handleShareStarted);
      socket.off("screen_share_stopped", handleShareStopped);
      socket.off("screen_share_offer", handleOffer);
      socket.off("screen_ice_candidate", handleIce);
    };
  }, [socket, roomId]);

  const startSharing = async () => {
    if (isMobile) {
      setShareError("Screen sharing is only available on desktop.");
      setTimeout(() => setShareError(""), 3000);
      return;
    }
    try {
      setShareError("");
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          frameRate: { ideal: 30, max: 30 },
        },
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000,
          channelCount: 2,
        },
      });

      stream.getVideoTracks().forEach((track) => {
        if (track.contentHint !== undefined) {
          track.contentHint = "detail";
        }
      });

      localStreamRef.current = stream;
      setIsSharing(true);
      setIsPresenter(true);
      socket.emit("start_screen_share", { room: roomId, userId });

      stream.getVideoTracks()[0].onended = () => stopSharing();
    } catch (err) {
      if (err.name === "NotAllowedError") setShareError("Screen sharing was cancelled.");
      else setShareError("Failed to start screen sharing: " + err.message);
    }
  };

  const handleKickUser = (targetUserId, targetUsername) => {
    if (!isHost) return;
    const confirmKick = window.confirm(`Are you sure you want to remove "${targetUsername}" from the room?`);
    if (!confirmKick) return;

    socket.emit("kick_user", {
      roomId,
      targetUserId,
      requesterUserId: userId,
    });
  };

  const hasStream = isPresenter ? !!localStreamRef.current && isSharing : !!remoteStream;

  return (
    <div className="screen-room-root">
      <Helmet>
        <title>Screen Share Room — WatchParty</title>
        <meta
          name="description"
          content="Join the screen sharing room on WatchParty. Share your screen, video chat, and collaborate with friends in real-time."
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Top Bar */}
      <header className="screen-room-header">
        <div className="header-left">
          <Link
            to="/"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", marginRight: "6px" }}
            title="WatchParty Home"
          >
            <BrandLogo size={26} showText={true} />
          </Link>
          <span className="room-badge">{roomId}</span>

          {/* Members Indicator: Clean info badge for users, Interactive Dropdown ONLY for Host */}
          {!isHost ? (
            <div className="room-badge room-members-indicator" title="Active participants in room">
              <Users size={12} style={{ color: "#94a3b8" }} />
              <span>{memberCount}</span>
            </div>
          ) : (
            <div className="host-members-wrapper" ref={dropdownRef}>
              <button
                className={`room-badge host-members-btn ${showParticipantsDropdown ? "active" : ""}`}
                onClick={() => setShowParticipantsDropdown(!showParticipantsDropdown)}
                title="Room Management (Host only)"
              >
                <Users size={12} style={{ color: "#FF1028" }} />
                <span>{memberCount}</span>
                <span className="host-pill">
                  <Crown size={10} strokeWidth={2.4} />
                  HOST
                </span>
              </button>

              {/* Host-only compact smooth dropdown */}
              <AnimatePresence>
                {showParticipantsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="host-popover"
                  >
                    <div className="host-popover-header">
                      <span className="popover-title">Room Users</span>
                      <span className="popover-badge">{roomUsers.length || memberCount}</span>
                    </div>

                    <div className="host-popover-list">
                      {/* Host first at top */}
                      <div className="popover-user-row host-row">
                        <div className="user-avatar host-avatar">
                          {username.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <span className="user-name">
                            {username}
                            <span className="you-label">(You)</span>
                          </span>
                          <span className="user-role-tag">
                            <Crown size={9} strokeWidth={2.5} />
                            Host
                          </span>
                        </div>
                      </div>

                      {/* Other room users */}
                      {roomUsers
                        .filter((u) => u.userId !== userId && u.userId !== hostId)
                        .map((u) => (
                          <div key={u.userId} className="popover-user-row">
                            <div className="user-avatar">
                              {u.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="user-details">
                              <span className="user-name">{u.username}</span>
                              <span className="user-status-online">
                                <span className="status-dot-sm" />
                                Online
                              </span>
                            </div>
                            <button
                              className="popover-kick-btn"
                              onClick={() => handleKickUser(u.userId, u.username)}
                              title={`Kick ${u.username}`}
                            >
                              <UserMinus size={11} strokeWidth={2.2} />
                              <span>Kick</span>
                            </button>
                          </div>
                        ))}

                      {roomUsers.filter((u) => u.userId !== userId && u.userId !== hostId).length === 0 && (
                        <div className="popover-empty">No other users in room</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <span
            className="room-badge"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#FFFFFF",
              border: "1px solid rgba(255, 16, 40, 0.35)",
              background: "rgba(255, 16, 40, 0.08)",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            {username}
          </span>
          <span className={`status-dot ${connectionStatus}`} />
        </div>

        <div className="header-actions">
          {!isSharing ? (
            <button className="btn-share" onClick={startSharing}>
              <ScreenShare size={15} style={{ color: "#FF1028", flexShrink: 0 }} />
              <span>Share Screen</span>
            </button>
          ) : isPresenter ? (
            <button className="btn-stop" onClick={stopSharing}>
              <ScreenShare size={15} style={{ flexShrink: 0 }} />
              <span>Stop Sharing</span>
            </button>
          ) : null}

          <button
            className={`btn-icon ${showSidebar ? "active" : ""}`}
            onClick={() => setShowSidebar(!showSidebar)}
            title="Toggle Sidebar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="15" y1="3" x2="15" y2="21"></line>
            </svg>
          </button>

          <button
            className="btn-leave"
            onClick={() => {
              stopSharing();
              navigate("/");
            }}
          >
            Leave
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="screen-room-body">
        {/* Main Video Area */}
        <div className="main-content">
          <div className="video-wrapper">
            {isPresenter && localStreamRef.current && (
              <video
                ref={(el) => {
                  if (el && localStreamRef.current && el.srcObject !== localStreamRef.current) {
                    el.srcObject = localStreamRef.current;
                  }
                }}
                autoPlay
                muted
                playsInline
                className="main-video"
              />
            )}
            {!isPresenter && remoteStream && (
              <video
                ref={(el) => {
                  remoteVideoRef.current = el;
                  if (el && remoteStream && el.srcObject !== remoteStream) {
                    el.srcObject = remoteStream;
                  }
                }}
                autoPlay
                playsInline
                className="main-video"
              />
            )}
            {!hasStream && (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <p className="empty-title">No active screen share</p>
                <p className="empty-sub">
                  {isMobile
                    ? "Screen sharing is available on desktop only. You can view shared screens here."
                    : 'Click "Share Screen" to start presenting'}
                </p>
              </div>
            )}
            {isSharing && (
              <div className="live-badge">
                <span className="live-dot" />
                LIVE
              </div>
            )}
          </div>

          {shareError && <div className="error-bar">{shareError}</div>}
        </div>

        {/* Sidebar Panel */}
        <div className="chat-panel" style={{ width: isMobile ? "100%" : "380px", display: showSidebar ? "flex" : "none" }}>
          <div className="sidebar-tabs">
            <button
              className={`sidebar-tab ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              <MessageSquare size={15} style={{ flexShrink: 0 }} />
              <span>Chat</span>
              {unreadCount > 0 && <span className="tab-badge">{unreadCount}</span>}
            </button>
            <div className="tab-divider" />
            <button
              className={`sidebar-tab ${activeTab === "video" ? "active" : ""}`}
              onClick={() => setActiveTab("video")}
            >
              <Video size={15} style={{ flexShrink: 0 }} />
              <span>Video Call</span>
            </button>
          </div>

          <div className="sidebar-content">
            <div style={{ display: activeTab === "chat" ? "flex" : "none", height: "100%", width: "100%", flexDirection: "column" }}>
              <ChatBox socket={socket} room={roomId} username={username} userId={userId} />
            </div>
            <div style={{ display: activeTab === "video" ? "block" : "none", height: "100%", width: "100%" }}>
              <VideoChat socket={socket} roomId={roomId} username={username} />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Toast Notification */}
      <AnimatePresence>
        {chatToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 10, x: 20 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setShowSidebar(true);
              setActiveTab("chat");
              setChatToast(null);
            }}
            className="chat-toast"
          >
            <div className="toast-avatar">
              {chatToast.author?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="toast-author">{chatToast.author}</p>
              <p className="toast-msg">{chatToast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .screen-room-root {
          background: #0c0c0c;
          min-height: 100vh;
          height: 100vh;
          display: flex;
          flex-direction: column;
          color: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
          overflow: hidden;
        }

        /* ===== HEADER ===== */
        .screen-room-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 52px;
          min-height: 52px;
          background: rgba(12,12,12,0.95);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          z-index: 50;
          backdrop-filter: blur(12px);
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .room-badge {
          font-size: 0.72rem;
          font-weight: 600;
          color: #94a3b8;
          background: rgba(255,255,255,0.05);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.2s;
        }
        .room-members-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: default;
        }
        .host-members-wrapper {
          position: relative;
        }
        .host-members-btn {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .host-members-btn:hover, .host-members-btn.active {
          background: rgba(255, 16, 40, 0.12);
          border-color: rgba(255, 16, 40, 0.4);
          color: #fff;
        }
        .host-pill {
          font-size: 0.6rem;
          background: rgba(255, 16, 40, 0.18);
          color: #FF5A78;
          border: 1px solid rgba(255, 16, 40, 0.3);
          padding: 1px 5px;
          border-radius: 4px;
          margin-left: 2px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          letter-spacing: 0.5px;
        }

        /* Host-Only Popover */
        .host-popover {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 260px;
          background: rgba(18, 18, 24, 0.98);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.75);
          z-index: 100;
          overflow: hidden;
        }
        .host-popover-header {
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.02);
        }
        .popover-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #f1f5f9;
        }
        .popover-badge {
          font-size: 0.65rem;
          color: #64748b;
          background: rgba(255, 255, 255, 0.06);
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
        .host-popover-list {
          padding: 6px;
          max-height: 240px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .popover-user-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          transition: background 0.15s;
        }
        .popover-user-row:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .host-row {
          border-color: rgba(255, 16, 40, 0.2);
          background: rgba(255, 16, 40, 0.04);
        }
        .user-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
          font-size: 0.72rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .host-avatar {
          background: linear-gradient(135deg, #FF1028, #A30816);
          color: #fff;
        }
        .user-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .user-name {
          font-size: 0.78rem;
          font-weight: 600;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .you-label {
          font-size: 0.65rem;
          color: #64748b;
          margin-left: 4px;
          font-weight: 400;
        }
        .user-role-tag {
          font-size: 0.62rem;
          color: #FF5A78;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .user-status-online {
          font-size: 0.62rem;
          color: #22c55e;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .status-dot-sm {
          width: 5px; height: 5px; border-radius: 50%;
          background: #22c55e;
        }
        .popover-kick-btn {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          border-radius: 6px;
          padding: 3px 7px;
          font-size: 0.68rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          transition: all 0.15s;
        }
        .popover-kick-btn:hover {
          background: rgba(239, 68, 68, 0.28);
          border-color: rgba(239, 68, 68, 0.6);
          color: #fff;
        }
        .popover-empty {
          padding: 14px 8px;
          text-align: center;
          font-size: 0.72rem;
          color: #64748b;
        }

        .status-dot {
          width: 7px; height: 7px; border-radius: 50%;
        }
        .status-dot.connected { background: #22c55e; box-shadow: 0 0 6px #22c55e; }
        .status-dot.connecting { background: #eab308; }
        .status-dot.disconnected { background: #ef4444; }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-share {
          background: rgba(255, 16, 40, 0.12);
          color: #FFFFFF;
          border: 1px solid rgba(255, 16, 40, 0.38);
          padding: 7px 15px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all 0.15s ease;
        }
        .btn-share:hover {
          background: rgba(255, 16, 40, 0.22);
          border-color: rgba(255, 16, 40, 0.65);
          transform: translateY(-1px);
        }
        .btn-stop {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.35);
          padding: 7px 15px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all 0.15s ease;
        }
        .btn-stop:hover {
          background: rgba(239, 68, 68, 0.25);
          border-color: rgba(239, 68, 68, 0.55);
          color: #ffffff;
        }
        .btn-icon {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .btn-icon:hover { background: rgba(255,255,255,0.08); color: #f1f5f9; }
        .btn-icon.active { background: rgba(255,16,40,0.15); color: #FF1028; border-color: rgba(255,16,40,0.35); }
        .btn-leave {
          background: transparent;
          border: 1px solid rgba(239,68,68,0.25);
          color: #f87171;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-leave:hover { background: rgba(239,68,68,0.1); }

        /* ===== BODY ===== */
        .screen-room-body {
          flex: 1;
          display: flex;
          gap: 0;
          overflow: hidden;
          min-height: 0;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px;
          min-width: 0;
          overflow-y: auto;
        }

        /* ===== VIDEO ===== */
        .video-wrapper {
          flex: 1;
          min-height: 300px;
          background: #111;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .main-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #000;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          padding: 40px;
        }
        .empty-title {
          color: rgba(255,255,255,0.3);
          font-size: 0.9rem;
          font-weight: 500;
        }
        .empty-sub {
          color: rgba(255,255,255,0.15);
          font-size: 0.78rem;
        }
        .live-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.65rem;
          font-weight: 700;
          color: #ef4444;
          letter-spacing: 1px;
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #ef4444;
          animation: livePulse 1.5s infinite;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .error-bar {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.15);
          color: #fca5a5;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.8rem;
        }

        /* ===== CHAT/SIDEBAR PANEL ===== */
        .chat-panel {
          border-left: 1px solid rgba(255,255,255,0.05);
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          min-height: 0;
          background: #0f0f0f;
        }

        .sidebar-tabs {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          gap: 6px;
          flex-shrink: 0;
        }
        .sidebar-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 0;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .sidebar-tab:hover { background: rgba(255,255,255,0.04); color: #f1f5f9; }
        .sidebar-tab.active { background: rgba(255,16,40,0.12); color: #FF1028; border: 1px solid rgba(255,16,40,0.25); }
        .tab-divider { width: 1px; height: 16px; background: rgba(255,255,255,0.08); }
        .tab-badge {
          background: #ef4444; color: #fff; font-size: 0.65rem;
          padding: 2px 6px; border-radius: 10px; font-weight: 700;
        }

        .sidebar-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
        }

        /* ===== CHAT TOAST ===== */
        .chat-toast {
          position: fixed; bottom: 16px; right: 16px; z-index: 200;
          background: rgba(14, 14, 18, 0.95); backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 16, 40, 0.3);
          border-radius: 12px; padding: 10px 14px;
          max-width: 280px; cursor: pointer;
          box-shadow: 0 8px 30px rgba(0,0,0,0.7);
          display: flex; alignItems: center; gap: 10px;
        }
        .toast-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #FF1028, #D4081E);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 700; color: #fff; flex-shrink: 0;
        }
        .toast-author {
          color: #FF5A78; font-size: 0.68rem; font-weight: 600; margin: 0; line-height: 1;
        }
        .toast-msg {
          color: rgba(255,255,255,0.7); font-size: 0.75rem; margin: 3px 0 0 0; line-height: 1.3;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .screen-room-body { flex-direction: column; }
          .chat-panel {
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.05);
            width: 100% !important;
            height: 350px !important;
          }
          .video-wrapper { min-height: 200px; }
        }

        @media (max-width: 600px) {
          .screen-room-header { padding: 0 12px; height: 46px; min-height: 46px; }
          .room-badge { padding: 3px 6px; font-size: 0.68rem; }
          .btn-share, .btn-stop { padding: 5px 12px; font-size: 0.72rem; }
          .btn-leave { padding: 5px 10px; font-size: 0.7rem; }
          .btn-icon { width: 32px; height: 32px; }
          .main-content { padding: 8px; gap: 8px; }
          .chat-panel { height: 300px !important; }
        }

        @media (max-height: 500px) and (orientation: landscape) {
          .screen-room-header { height: 40px; min-height: 40px; }
          .screen-room-body { flex-direction: row; }
          .chat-panel {
            border-left: 1px solid rgba(255,255,255,0.05);
            border-top: none;
            width: 320px !important;
            height: auto !important;
          }
          .main-content { padding: 6px; gap: 6px; }
          .video-wrapper { min-height: 0; }
        }
      `}</style>
    </div>
  );
};

export default ScreenShareRoom;
