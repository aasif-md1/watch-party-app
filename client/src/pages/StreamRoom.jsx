import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../hooks/useAuth";
import VideoPlayer from "../components/VideoPlayer";
import ChatBox from "../components/ChatBox";
import VideoChat from "../components/VideoChat";
import { BrandLogo } from "../components/BrandLogo";
import { MessageSquare, Video, Users, UserMinus, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

const StreamRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useAuth();
  const playerRef = useRef(null);

  const username = localStorage.getItem("wp_username") || user?.displayName || "Watcher";

  // Dedicated unique participant ID per tab/session to avoid ghost counts and tab collision
  const [userId] = useState(() => {
    const creatorHostId = sessionStorage.getItem(`wp_host_${roomId}`);
    if (creatorHostId && typeof creatorHostId === "string" && creatorHostId.length > 5) {
      return creatorHostId;
    }
    let tabUid = sessionStorage.getItem(`wp_tab_uid_${roomId}`);
    if (!tabUid) {
      const prefix = user?.uid ? `${user.uid.substring(0, 6)}_` : "user_";
      tabUid = `${prefix}${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem(`wp_tab_uid_${roomId}`, tabUid);
    }
    return tabUid;
  });

  const [videoUrl] = useState(localStorage.getItem("wp_videoUrl") || "");
  const [playing, setPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [serverVideoUrl, setServerVideoUrl] = useState(videoUrl);
  const [activeTab, setActiveTab] = useState("chat");
  const [showSidebar, setShowSidebar] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [memberCount, setMemberCount] = useState(1);
  const [roomUsers, setRoomUsers] = useState([]);
  const [hostId, setHostId] = useState("");
  const [showParticipantsDropdown, setShowParticipantsDropdown] = useState(false);
  const [chatToast, setChatToast] = useState(null);

  // Strict Host determination: only host if hostId matches userId or this tab holds creator token
  const isHost = Boolean(
    (hostId && hostId === userId) ||
    (sessionStorage.getItem(`wp_host_${roomId}`) && sessionStorage.getItem(`wp_host_${roomId}`) === userId)
  );

  const chatToastTimer = useRef(null);
  const isHandlingSync = useRef(false);
  const lastSyncSent = useRef(0);
  const isBuffering = useRef(false);
  const dropdownRef = useRef(null);

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
      const isMobileUserAgent =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isSmallScreen = window.innerWidth < 768 && window.innerHeight < 768;
      setIsMobile(isMobileUserAgent || isSmallScreen);
    };
    check();
    window.addEventListener("resize", check);

    // Auto-rotate to landscape & go fullscreen on phone (runs immediately on join/create)
    const triggerLandscapeFullscreen = async () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 0 && Math.min(window.innerWidth, window.innerHeight) < 900);

      if (!isMobileDevice) return;

      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen().catch(() => {});
        }
        if (window.screen?.orientation?.lock) {
          await window.screen.orientation.lock("landscape").catch(() => {});
        }
      } catch (e) {}
    };

    // Auto-rotate immediately on enter — forces landscape even if user was in portrait!
    triggerLandscapeFullscreen();

    // Re-engage on touch or orientation change
    window.addEventListener("touchend", triggerLandscapeFullscreen, { passive: true });
    window.addEventListener("click", triggerLandscapeFullscreen, { passive: true });
    window.addEventListener("orientationchange", triggerLandscapeFullscreen, { passive: true });
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener("change", triggerLandscapeFullscreen);
    }

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("touchend", triggerLandscapeFullscreen);
      window.removeEventListener("click", triggerLandscapeFullscreen);
      window.removeEventListener("orientationchange", triggerLandscapeFullscreen);
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener("change", triggerLandscapeFullscreen);
      }
      try {
        if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
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

  useEffect(() => {
    if (!videoUrl && !serverVideoUrl) {
      navigate("/");
      return;
    }

    const isHostInitial = Boolean(
      sessionStorage.getItem(`wp_host_${roomId}`) &&
      sessionStorage.getItem(`wp_host_${roomId}`) === userId
    );
    const joinPayload = {
      roomId,
      videoUrl,
      roomType: "youtube",
      username,
      userId,
      isHost: isHostInitial,
    };

    const joinRoom = () => socket.emit("join_room", joinPayload);
    joinRoom();

    const handleRoomState = (state) => {
      if (state.hostId) setHostId(state.hostId);
      if (state.videoUrl && state.videoUrl !== serverVideoUrl) setServerVideoUrl(state.videoUrl);
      isHandlingSync.current = true;
      setPlaying(state.playing);
      const currentTime = playerRef.current?.getCurrentTime() || 0;
      if (playerRef.current && Math.abs(currentTime - state.seekTime) > 1.5) {
        playerRef.current.seekTo(state.seekTime);
      }
      setTimeout(() => {
        isHandlingSync.current = false;
      }, 2000);
    };

    const handleVideoStateUpdate = (data) => {
      isHandlingSync.current = true;
      const currentTime = playerRef.current?.getCurrentTime() || 0;
      if (Math.abs(currentTime - data.seekTime) > 1.5) playerRef.current?.seekTo(data.seekTime);
      setPlaying(data.playing);
      setTimeout(() => {
        isHandlingSync.current = false;
      }, 2000);
    };

    const handleVideoSeek = (data) => {
      isHandlingSync.current = true;
      playerRef.current?.seekTo(data.seekTime);
      setPlaying(data.playing);
      setTimeout(() => {
        isHandlingSync.current = false;
      }, 2000);
    };

    const handleRoomUsers = ({ count, users, hostId: hId }) => {
      if (typeof count === "number") setMemberCount(count);
      if (Array.isArray(users)) setRoomUsers(users);
      if (hId) setHostId(hId);
    };

    const handleKicked = (data) => {
      alert(data?.reason || "You were removed from the room by the host.");
      navigate("/");
    };

    socket.on("room_state", handleRoomState);
    socket.on("video_state_update", handleVideoStateUpdate);
    socket.on("video_seek", handleVideoSeek);
    socket.on("room_users_update", handleRoomUsers);
    socket.on("member_count_update", (count) => setMemberCount(count));
    socket.on("kicked_from_room", handleKicked);
    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("room_state", handleRoomState);
      socket.off("video_state_update", handleVideoStateUpdate);
      socket.off("video_seek", handleVideoSeek);
      socket.off("room_users_update", handleRoomUsers);
      socket.off("member_count_update");
      socket.off("kicked_from_room", handleKicked);
    };
  }, [socket, roomId, videoUrl, serverVideoUrl, username, userId, navigate]);

  const handleProgress = useCallback((state) => {
    if (!playing || isBuffering.current || isHandlingSync.current) return;
    const now = Date.now();
    if (now - lastSyncSent.current > 2000) {
      socket.emit("sync_time", { room: roomId, time: state.playedSeconds, playing: true });
      lastSyncSent.current = now;
    }
  }, [playing, socket, roomId]);

  const handleSyncAction = useCallback((isPlaying) => {
    setPlaying(isPlaying);
    socket.emit("video_state_change", {
      room: roomId,
      playing: isPlaying,
      seekTime: playerRef.current?.getCurrentTime() || 0,
    });
  }, [socket, roomId]);

  const handleSeek = useCallback((seconds) => {
    if (isHandlingSync.current) return;
    socket.emit("video_seek", { room: roomId, seekTime: seconds, playing });
  }, [socket, roomId, playing]);

  const handleBuffer = useCallback(() => {
    isBuffering.current = true;
  }, []);

  const handleBufferEnd = useCallback(() => {
    isBuffering.current = false;
  }, []);

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

  return (
    <div className="stream-room-root">
      <Helmet>
        <title>YouTube Watch Party Room — WatchParty</title>
        <meta
          name="description"
          content="Join the YouTube Watch Party room and watch videos together in sync with friends. Live chat and instant video sync."
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Header */}
      <header className="stream-room-header">
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
          <div className="sync-indicator">
            <span className="sync-dot" />
            <span className="sync-text">Synced</span>
          </div>
        </div>
        <div className="header-actions">
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
          <button className="btn-leave" onClick={() => navigate("/")}>
            Leave
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="stream-room-body">
        <div className="main-content">
          <VideoPlayer
            url={serverVideoUrl || videoUrl}
            playing={playing}
            onPlay={() => handleSyncAction(true)}
            onPause={() => handleSyncAction(false)}
            onProgress={handleProgress}
            onSeek={handleSeek}
            onBuffer={handleBuffer}
            onBufferEnd={handleBufferEnd}
            playerRef={playerRef}
          />
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

        .stream-room-root {
          background: #0c0c0c;
          min-height: 100vh;
          min-height: 100dvh;
          height: 100vh;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          color: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
          overflow: hidden;
          width: 100vw;
          position: fixed;
          inset: 0;
        }

        .stream-room-header {
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

        .sync-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .sync-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #ef4444;
          animation: syncPulse 2s infinite;
        }
        .sync-text {
          font-size: 0.68rem;
          color: #64748b;
          font-weight: 500;
        }
        @keyframes syncPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(239,68,68,0); }
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
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

        .stream-room-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        .main-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          min-width: 0;
          background: #000;
        }

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

        @media (max-width: 1024px) {
          .stream-room-body { flex-direction: column; }
          .chat-panel {
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.05);
            width: 100% !important;
            height: 350px !important;
          }
        }

        @media (max-width: 600px) {
          .stream-room-header { padding: 0 12px; height: 46px; min-height: 46px; }
          .room-badge { padding: 3px 6px; font-size: 0.68rem; }
          .btn-leave { padding: 5px 10px; font-size: 0.7rem; }
          .btn-icon { width: 32px; height: 32px; }
          .main-content { padding: 6px; }
          .chat-panel { height: 300px !important; }
        }
      `}</style>
    </div>
  );
};

export default StreamRoom;
