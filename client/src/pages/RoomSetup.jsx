import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import {
  Play,
  Users,
  MonitorPlay,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  CheckCheck,
  Lock,
  X,
} from "lucide-react";

/* ──────────────────── Google Icon (from LoginModal) ──────────────────── */
const GoogleIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

/* ──────────────────────────────────────────────────────────────────────── */
/*  DATA PIXEL ARC — WebGL Background (Originkit)                         */
/* ──────────────────────────────────────────────────────────────────────── */

const MAX_DPR = 2;

const VERT_SRC = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  uRes;
uniform float uTime, uDpr, uCell, uFill, uHover, uReach;
uniform vec2  uPtr;
uniform float uCenter, uDrop, uThick, uFall;
uniform vec3  uBg, uBase, uAccent, uHigh;

void main(){
  float cs = max(uCell, 2.0);
  vec2 ci = floor(gl_FragCoord.xy / cs);
  vec2 cc = (ci + 0.5) * cs;

  float x = cc.x / uDpr;
  float y = (uRes.y - cc.y) / uDpr;
  float w = uRes.x / uDpr;
  float h = uRes.y / uDpr;

  float nx = (x / w) * 2.0 - 1.0;
  float curveY = h * uCenter + pow(abs(nx), 1.8) * (h * uDrop);
  float i = max(0.0, 1.0 - abs(y - curveY) / max(h * uThick, 1.0));

  float probe = (1.0 - smoothstep(0.0, 1.0, distance(vec2(x, y), uPtr) / max(uReach, 1.0))) * uHover;
  i = clamp(i + probe * 0.45, 0.0, 1.2);

  vec3 col = uBg;
  if (i > 0.01) {
    float wave1 = sin(nx * 4.0 - uTime * 1.5) * 0.1;
    float wave2 = cos(y * 0.01 + uTime) * 0.1;
    i = clamp(i + wave1 + wave2, 0.0, 1.0);
    i *= max(0.0, 1.0 - pow(abs(nx), uFall));

    if (i > 0.02) {
      float side = cs * uFill;
      vec2 d = abs(gl_FragCoord.xy - cc);
      float cov = 1.0 - smoothstep(side * 0.5 - 1.0, side * 0.5 + 1.0, max(d.x, d.y));

      float core = i * i * i;
      float mid = pow(i, 1.5);
      vec3 ink = uBase * i * 0.35 + uAccent * mid * 0.95 + uHigh * core * 0.35;
      col = mix(uBg, clamp(ink, 0.0, 1.0), cov * i);
    }
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(gl, type, src) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("DataPixelArc shader:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function parseColor(input, fb) {
  if (!input) return fb;
  const str = String(input).trim();
  if (str.charAt(0) === "#") {
    let hex = str.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b))
        return [r / 255, g / 255, b / 255];
    }
    return fb;
  }
  const m = str.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    return [
      Math.min(255, parseFloat(m[0])) / 255,
      Math.min(255, parseFloat(m[1])) / 255,
      Math.min(255, parseFloat(m[2])) / 255,
    ];
  }
  return fb;
}

function clampN(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

function DataPixelArcBackground() {
  const canvasRef = useRef(null);
  const ptrRef = useRef({ tx: -1, ty: -1, x: -1, y: -1 });

  const preset = {
    background: "#030308",
    baseColor: "#FF1028",
    accentColor: "#D90D24",
    highlight: "#EAFFF0",
    density: 89,
    dotSize: 69,
    speed: 100,
    hover: 46,
    center: 80,
    drop: 0,
    thickness: 44,
    falloff: 600,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
    });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const locs = {};
    const u = (name) => {
      if (!(name in locs)) locs[name] = gl.getUniformLocation(prog, name);
      return locs[name];
    };

    let raf = 0;
    let last = performance.now();
    let clock = 0;
    const PTR_RATE = 9.0;

    const densityVal = Math.round(clampN(preset.density, 24, 260));
    const dotSizeVal = clampN(preset.dotSize, 20, 100) / 100;
    const speedVal = clampN(preset.speed, 0, 100) / 50;
    const hoverVal = clampN(preset.hover, 0, 200) / 100;
    const centerVal = clampN(preset.center, 0, 100) / 100;
    const dropVal = clampN(preset.drop, 0, 300) / 100;
    const thicknessVal = clampN(preset.thickness, 2, 120) / 100;
    const falloffVal = clampN(preset.falloff, 50, 600) / 100;

    const bgC = parseColor(preset.background, [0.012, 0.012, 0.031]);
    const baseC = parseColor(preset.baseColor, [0.118, 0.392, 0.22]);
    const accentC = parseColor(preset.accentColor, [0.133, 0.863, 0.314]);
    const highC = parseColor(preset.highlight, [0.918, 1.0, 0.941]);

    const render = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock = (clock + dt * 1.2 * speedVal) % 6283;

      const ptr = ptrRef.current;
      const k = 1 - Math.exp(-dt * PTR_RATE);
      ptr.x += (ptr.tx - ptr.x) * k;
      ptr.y += (ptr.ty - ptr.y) * k;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const cw = canvas.clientWidth || 1200;
      const ch = canvas.clientHeight || 800;
      const bw = Math.max(1, Math.round(cw * dpr));
      const bh = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      gl.viewport(0, 0, bw, bh);

      const pitchCss = Math.min(bw, bh) / dpr / densityVal;

      gl.uniform2f(u("uRes"), bw, bh);
      gl.uniform1f(u("uTime"), clock);
      gl.uniform1f(u("uDpr"), dpr);
      gl.uniform1f(u("uCell"), Math.max(2, pitchCss * dpr));
      gl.uniform1f(u("uFill"), dotSizeVal);
      gl.uniform1f(u("uCenter"), centerVal);
      gl.uniform1f(u("uDrop"), dropVal);
      gl.uniform1f(u("uThick"), thicknessVal);
      gl.uniform1f(u("uFall"), falloffVal);
      gl.uniform1f(u("uHover"), hoverVal);
      gl.uniform1f(u("uReach"), (Math.min(bw, bh) / dpr) * 0.28);
      gl.uniform2f(u("uPtr"), ptr.x * (bw / dpr), ptr.y * (bh / dpr));
      gl.uniform3f(u("uBg"), bgC[0], bgC[1], bgC[2]);
      gl.uniform3f(u("uBase"), baseC[0], baseC[1], baseC[2]);
      gl.uniform3f(u("uAccent"), accentC[0], accentC[1], accentC[2]);
      gl.uniform3f(u("uHigh"), highC[0], highC[1], highC[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };

    const track = (e) => {
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      ptrRef.current.tx = clampN(
        (e.clientX - r.left) / r.width,
        0,
        1
      );
      ptrRef.current.ty = clampN(
        (e.clientY - r.top) / r.height,
        0,
        1
      );
    };
    const onLeave = () => {
      ptrRef.current.tx = -1;
      ptrRef.current.ty = -1;
    };
    canvas.addEventListener("pointermove", track);
    canvas.addEventListener("pointerenter", track);
    canvas.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", track);
      canvas.removeEventListener("pointerenter", track);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        zIndex: 0,
      }}
    />
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  YOUTUBE VALIDATION                                                     */
/* ──────────────────────────────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────────────────────────────── */
/*  SHARED INPUT STYLES                                                    */
/* ──────────────────────────────────────────────────────────────────────── */

const getInputStyle = (isMobile) => ({
  width: "100%",
  padding: isMobile ? "9px 12px" : "12px 16px",
  background: "rgba(0, 0, 0, 0.5)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRadius: "8px",
  color: "#FFFFFF",
  fontSize: isMobile ? "0.85rem" : "0.92rem",
  outline: "none",
  backdropFilter: "blur(4px)",
  transition: "border-color 0.2s ease",
  boxSizing: "border-box",
});

const labelStyle = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "rgba(255, 255, 255, 0.65)",
  marginBottom: "4px",
};

/* ──────────────────────────────────────────────────────────────────────── */
/*  ROOM SETUP PAGE                                                        */
/* ──────────────────────────────────────────────────────────────────────── */

const RoomSetup = () => {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialTab = searchParams.get("action") === "join" ? "join" : "create";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [roomMode, setRoomMode] = useState("youtube");
  const [username, setUsername] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [linkError, setLinkError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Room created state
  const [generatedRoomId, setGeneratedRoomId] = useState("");
  const [showRoomCreated, setShowRoomCreated] = useState(false);
  const [copied, setCopied] = useState(false);

  // Login state
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const pendingAction = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Post-login auto-continue
  useEffect(() => {
    if (user && pendingAction.current) {
      const action = pendingAction.current;
      pendingAction.current = null;
      setShowLoginOverlay(false);
      setTimeout(() => {
        if (action === "create") executeCreateRoom();
        else if (action === "join") executeJoinRoom();
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
    setShowRoomCreated(true);
  }, []);

  const executeJoinRoom = useCallback(() => {
    localStorage.setItem("wp_username", username.trim());
    if (user?.uid) localStorage.setItem("wp_userId", user.uid);
    else if (!localStorage.getItem("wp_userId")) localStorage.setItem("wp_userId", `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
    localStorage.removeItem(`wp_host_${joinRoomId}`);
    if (roomMode === "youtube") {
      localStorage.setItem("wp_videoUrl", videoUrl);
      localStorage.setItem("wp_roomMode", "youtube");
      navigate(`/stream/${joinRoomId}`);
    } else {
      localStorage.setItem("wp_roomMode", "screenshare");
      navigate(`/screen/${joinRoomId}`);
    }
  }, [roomMode, videoUrl, joinRoomId, navigate, username, user]);

  const handleCreate = () => {
    if (!validateCreateFields()) return;
    if (!user) {
      pendingAction.current = "create";
      setShowLoginOverlay(true);
      return;
    }
    executeCreateRoom();
  };

  const handleJoin = () => {
    if (!validateJoinFields()) return;
    if (!user) {
      pendingAction.current = "join";
      setShowLoginOverlay(true);
      return;
    }
    executeJoinRoom();
  };

  const enterGeneratedRoom = () => {
    localStorage.setItem("wp_username", username.trim());
    if (user?.uid) localStorage.setItem("wp_userId", user.uid);
    else if (!localStorage.getItem("wp_userId")) localStorage.setItem("wp_userId", `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
    localStorage.setItem(`wp_host_${generatedRoomId}`, "true");
    if (roomMode === "youtube") {
      localStorage.setItem("wp_videoUrl", videoUrl);
      localStorage.setItem("wp_roomMode", "youtube");
      navigate(`/stream/${generatedRoomId}`);
    } else {
      localStorage.setItem("wp_roomMode", "screenshare");
      navigate(`/screen/${generatedRoomId}`);
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

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  /* ─── Mode Switcher (shared between tabs) ─── */
  const ModeSwitcher = () => (
    <div style={{ display: "flex", gap: "8px", marginBottom: isMobile ? "12px" : "20px" }}>
      {[
        { key: "youtube", label: "YouTube Party", icon: Play },
        { key: "screenshare", label: "Screen Share", icon: MonitorPlay },
      ].map((m) => {
        const isActive = roomMode === m.key;
        const Icon = m.icon;
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => {
              setRoomMode(m.key);
              setLinkError("");
            }}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: isMobile ? "8px 10px" : "11px",
              borderRadius: "8px",
              background: isActive
                ? "rgba(229, 9, 20, 0.9)"
                : "rgba(255, 255, 255, 0.06)",
              border: isActive
                ? "1px solid #E50914"
                : "1px solid rgba(255, 255, 255, 0.12)",
              color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
              fontSize: isMobile ? "0.78rem" : "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
          >
            <Icon
              size={13}
              fill={isActive && m.key === "youtube" ? "#FFFFFF" : "none"}
            />
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: isMobile ? "100dvh" : "100vh",
        overflowX: "hidden",
        background: "#030308",
      }}
    >
      {/* WebGL Background */}
      <DataPixelArcBackground />

      {/* Back to Home Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: isMobile ? "12px" : "28px",
          left: isMobile ? "12px" : "32px",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: isMobile ? "7px 13px" : "10px 18px",
          borderRadius: "10px",
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: isMobile ? "0.78rem" : "0.88rem",
          fontWeight: "600",
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          transition: "all 0.2s ease",
        }}
        whileHover={{
          background: "rgba(255, 255, 255, 0.12)",
          borderColor: "rgba(255, 255, 255, 0.3)",
        }}
        whileTap={{ scale: 0.97 }}
      >
        <ArrowLeft size={isMobile ? 14 : 16} />
        <span>Back</span>
      </motion.button>

      {/* Content Overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: isMobile ? "100dvh" : "100vh",
          padding: isMobile ? "50px 12px 14px" : "40px 20px",
          boxSizing: "border-box",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "100%",
            maxWidth: "520px",
          }}
        >
          {/* Glass Card */}
          <div
            style={{
              background: "rgba(14, 14, 18, 0.82)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: isMobile ? "16px" : "20px",
              padding: isMobile ? "18px 16px" : "36px 32px",
              backdropFilter: "blur(40px)",
              boxShadow:
                "0 32px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
            }}
          >

            {/* Tab Switcher */}
            <div
              style={{
                display: "flex",
                background: "rgba(255, 255, 255, 0.04)",
                borderRadius: "10px",
                padding: "3px",
                marginBottom: isMobile ? "14px" : "24px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              {[
                { key: "create", label: "Create Room", icon: Play },
                { key: "join", label: "Join Room", icon: Users },
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: isMobile ? "8px 6px" : "12px 8px",
                      borderRadius: "8px",
                      background: isActive
                        ? "rgba(229, 9, 20, 0.85)"
                        : "transparent",
                      border: "none",
                      color: isActive
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.5)",
                      fontSize: isMobile ? "0.82rem" : "0.9rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      boxShadow: isActive
                        ? "0 4px 16px rgba(229, 9, 20, 0.35)"
                        : "none",
                    }}
                  >
                    <Icon
                      size={isMobile ? 13 : 15}
                      fill={
                        isActive && tab.key === "create" ? "#FFFFFF" : "none"
                      }
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ─── Animated Tab Content ─── */}
            <AnimatePresence mode="wait">
              {activeTab === "create" && !showRoomCreated && (
                <motion.div
                  key="create-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Header */}
                  <div style={{ marginBottom: isMobile ? "12px" : "20px" }}>
                    <h2
                      style={{
                        fontSize: isMobile ? "1.18rem" : "1.4rem",
                        fontWeight: "800",
                        color: "#FFFFFF",
                        margin: isMobile ? "0 0 3px 0" : "0 0 6px 0",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Create a Watch Room
                    </h2>
                    <p
                      style={{
                        fontSize: isMobile ? "0.78rem" : "0.84rem",
                        color: "rgba(255, 255, 255, 0.55)",
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      Stream YouTube videos in sync or broadcast your screen in
                      HD with friends.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreate();
                    }}
                  >
                    <ModeSwitcher />

                    {/* Nickname */}
                    <div style={{ marginBottom: isMobile ? "10px" : "16px" }}>
                      <label style={labelStyle}>Your Nickname</label>
                      <input
                        style={getInputStyle(isMobile)}
                        placeholder="e.g. CinemaFan"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#E50914")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor =
                            "rgba(255, 255, 255, 0.18)")
                        }
                      />
                    </div>

                    {/* YouTube URL or Screen Share info */}
                    {roomMode === "youtube" ? (
                      <div style={{ marginBottom: isMobile ? "14px" : "22px" }}>
                        <label style={labelStyle}>YouTube Video Link</label>
                        <input
                          style={{
                            ...getInputStyle(isMobile),
                            borderColor: linkError
                              ? "#E50914"
                              : "rgba(255, 255, 255, 0.18)",
                          }}
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={videoUrl}
                          onChange={handleVideoUrlChange}
                          onFocus={(e) => {
                            if (!linkError)
                              e.target.style.borderColor = "#E50914";
                          }}
                          onBlur={(e) => {
                            if (!linkError)
                              e.target.style.borderColor =
                                "rgba(255, 255, 255, 0.18)";
                          }}
                        />
                        {linkError && (
                          <p
                            style={{
                              color: "#E50914",
                              fontSize: "0.75rem",
                              margin: "5px 0 0 2px",
                            }}
                          >
                            ⚠ {linkError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          borderRadius: "8px",
                          padding: isMobile ? "9px 12px" : "12px 16px",
                          color: "rgba(255, 255, 255, 0.7)",
                          fontSize: isMobile ? "0.78rem" : "0.82rem",
                          lineHeight: 1.45,
                          marginBottom: isMobile ? "14px" : "22px",
                        }}
                      >
                        You can select a browser tab, window, or entire desktop
                        once the room starts.
                      </div>
                    )}

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: "100%",
                        padding: isMobile ? "11px 16px" : "14px 20px",
                        background:
                          "linear-gradient(135deg, #E50914 0%, #B80710 100%)",
                        border: "none",
                        borderRadius: isMobile ? "10px" : "12px",
                        color: "#FFFFFF",
                        fontSize: isMobile ? "0.92rem" : "1rem",
                        fontWeight: "800",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: "0 6px 24px rgba(229, 9, 20, 0.4)",
                        transition: "box-shadow 0.2s ease",
                      }}
                    >
                      <Play size={isMobile ? 14 : 16} fill="#FFFFFF" />
                      <span>Create Watch Room</span>
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {activeTab === "create" && showRoomCreated && (
                <motion.div
                  key="room-created"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{ textAlign: "center" }}
                >
                  {/* Success Icon */}
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "rgba(229, 9, 20, 0.15)",
                      border: "2px solid #E50914",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 18px",
                      color: "#E50914",
                    }}
                  >
                    <Check size={28} strokeWidth={3} />
                  </div>

                  <h3
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: "900",
                      color: "#FFFFFF",
                      margin: "0 0 6px 0",
                      textTransform: "uppercase",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Room Ready!
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255, 255, 255, 0.6)",
                      margin: "0 0 22px 0",
                      lineHeight: 1.5,
                    }}
                  >
                    Share this Room ID with your friends to join the watch party.
                  </p>

                  {/* Room ID display */}
                  <div
                    style={{
                      background: "rgba(0, 0, 0, 0.4)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "10px",
                      padding: "14px 18px",
                      marginBottom: "22px",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255, 255, 255, 0.4)",
                        marginBottom: "6px",
                        fontWeight: "700",
                      }}
                    >
                      Room ID
                    </span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: isMobile ? "1.05rem" : "1.2rem",
                        fontWeight: "800",
                        color: "#E50914",
                        letterSpacing: "0.04em",
                        wordBreak: "break-all",
                      }}
                    >
                      {generatedRoomId}
                    </span>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <button
                      type="button"
                      onClick={copyRoomId}
                      style={{
                        flex: 1,
                        padding: "12px 18px",
                        borderRadius: "10px",
                        background: copied
                          ? "rgba(74, 222, 128, 0.15)"
                          : "rgba(255, 255, 255, 0.08)",
                        border: copied
                          ? "1px solid #4ADE80"
                          : "1px solid rgba(255, 255, 255, 0.15)",
                        color: copied ? "#4ADE80" : "#FFFFFF",
                        fontSize: "0.88rem",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {copied ? (
                        <>
                          <CheckCheck size={16} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span>Copy ID</span>
                        </>
                      )}
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={enterGeneratedRoom}
                      style={{
                        flex: 1,
                        padding: "12px 18px",
                        borderRadius: "10px",
                        background:
                          "linear-gradient(135deg, #E50914 0%, #B80710 100%)",
                        border: "none",
                        color: "#FFFFFF",
                        fontSize: "0.9rem",
                        fontWeight: "800",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: "0 4px 18px rgba(229, 9, 20, 0.4)",
                      }}
                    >
                      <Play size={16} fill="#FFFFFF" />
                      <span>Enter Room</span>
                    </motion.button>
                  </div>

                  {/* Create another */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowRoomCreated(false);
                      setGeneratedRoomId("");
                    }}
                    style={{
                      marginTop: "16px",
                      background: "none",
                      border: "none",
                      color: "rgba(255, 255, 255, 0.45)",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    Create another room
                  </button>
                </motion.div>
              )}

              {activeTab === "join" && (
                <motion.div
                  key="join-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Header */}
                  <div style={{ marginBottom: isMobile ? "12px" : "20px" }}>
                    <h2
                      style={{
                        fontSize: isMobile ? "1.18rem" : "1.4rem",
                        fontWeight: "800",
                        color: "#FFFFFF",
                        margin: isMobile ? "0 0 3px 0" : "0 0 6px 0",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Join with Room ID
                    </h2>
                    <p
                      style={{
                        fontSize: isMobile ? "0.78rem" : "0.84rem",
                        color: "rgba(255, 255, 255, 0.55)",
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      Enter the Room ID shared by your friend to join the
                      synchronized watch session.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleJoin();
                    }}
                  >
                    <ModeSwitcher />

                    {/* Nickname */}
                    <div style={{ marginBottom: isMobile ? "10px" : "16px" }}>
                      <label style={labelStyle}>Your Nickname</label>
                      <input
                        style={getInputStyle(isMobile)}
                        placeholder="e.g. CinemaFan"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#E50914")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor =
                            "rgba(255, 255, 255, 0.18)")
                        }
                      />
                    </div>

                    {/* Room ID */}
                    <div
                      style={{
                        marginBottom:
                          isMobile
                            ? "10px"
                            : roomMode === "youtube"
                            ? "16px"
                            : "22px",
                      }}
                    >
                      <label style={labelStyle}>Room ID</label>
                      <input
                        style={getInputStyle(isMobile)}
                        placeholder="Paste Room ID here..."
                        value={joinRoomId}
                        onChange={(e) => setJoinRoomId(e.target.value)}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#E50914")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor =
                            "rgba(255, 255, 255, 0.18)")
                        }
                      />
                    </div>

                    {/* YouTube Link (if youtube mode) */}
                    {roomMode === "youtube" && (
                      <div style={{ marginBottom: isMobile ? "14px" : "22px" }}>
                        <label style={labelStyle}>YouTube Video Link</label>
                        <input
                          style={{
                            ...getInputStyle(isMobile),
                            borderColor: linkError
                              ? "#E50914"
                              : "rgba(255, 255, 255, 0.18)",
                          }}
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={videoUrl}
                          onChange={handleVideoUrlChange}
                          onFocus={(e) => {
                            if (!linkError)
                              e.target.style.borderColor = "#E50914";
                          }}
                          onBlur={(e) => {
                            if (!linkError)
                              e.target.style.borderColor =
                                "rgba(255, 255, 255, 0.18)";
                          }}
                        />
                        {linkError && (
                          <p
                            style={{
                              color: "#E50914",
                              fontSize: "0.75rem",
                              margin: "5px 0 0 2px",
                            }}
                          >
                            ⚠ {linkError}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: "100%",
                        padding: isMobile ? "11px 16px" : "14px 20px",
                        background:
                          "linear-gradient(135deg, #E50914 0%, #B80710 100%)",
                        border: "none",
                        borderRadius: isMobile ? "10px" : "12px",
                        color: "#FFFFFF",
                        fontSize: isMobile ? "0.92rem" : "1rem",
                        fontWeight: "800",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: "0 6px 24px rgba(229, 9, 20, 0.4)",
                        transition: "box-shadow 0.2s ease",
                      }}
                    >
                      <span>Join Room</span>
                      <ArrowRight size={isMobile ? 14 : 16} />
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>

      {/* ─── Login Overlay ─── */}
      <AnimatePresence>
        {showLoginOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 110,
              background: "rgba(0, 0, 0, 0.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => {
              setShowLoginOverlay(false);
              pendingAction.current = null;
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 14 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "400px",
                background: "rgba(14, 14, 18, 0.92)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "16px",
                padding: isMobile ? "28px 22px" : "36px 32px",
                textAlign: "center",
                boxShadow: "0 32px 80px rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(40px)",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "rgba(229, 9, 20, 0.15)",
                  border: "2px solid #E50914",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                  color: "#E50914",
                }}
              >
                <Lock size={24} />
              </div>

              <h3
                style={{
                  fontSize: isMobile ? "1.4rem" : "1.6rem",
                  fontWeight: "900",
                  color: "#FFFFFF",
                  margin: "0 0 8px 0",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Sign In To Continue
              </h3>
              <p
                style={{
                  fontSize: "0.84rem",
                  color: "rgba(255, 255, 255, 0.6)",
                  margin: "0 0 26px 0",
                  lineHeight: 1.5,
                }}
              >
                Authentication is required to create or join a room securely.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  background: "#FFFFFF",
                  border: "none",
                  borderRadius: "10px",
                  color: "#000000",
                  fontSize: "0.92rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <GoogleIcon size={18} />
                <span>Continue with Google</span>
              </motion.button>

              <div
                style={{
                  marginTop: "18px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  paddingTop: "14px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginOverlay(false);
                    pendingAction.current = null;
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255, 255, 255, 0.4)",
                    fontSize: "0.84rem",
                    cursor: "pointer",
                    padding: "4px 8px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
};

export default RoomSetup;
