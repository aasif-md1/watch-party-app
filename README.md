<div align="center">

  <img src="client/public/og-image.png" alt="WatchParty Social Banner" width="100%" />

  # WatchParty
  ### 🎬 Watch Movies, Shows &amp; YouTube Together in True Frame-Locked Sync

  [![Live Platform](https://img.shields.io/badge/Live%20Platform-watchparty.website-FF1028?style=for-the-badge&logo=google-chrome&logoColor=white)](https://watchparty.website/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
  [![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-4.7-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
  [![WebRTC](https://img.shields.io/badge/WebRTC-Peer--to--Peer-333333?style=for-the-badge&logo=webrtc&logoColor=white)](https://webrtc.org/)

  <p align="center">
    <b>WatchParty</b> is a modern, zero-install virtual cinema and synchronized video streaming platform that lets friends, couples, and communities watch movies, OTT streams, anime, and YouTube together with sub-second sync, live sidecar chat, and crystal-clear video calls.
  </p>

  **[🌐 Visit Official Platform](https://watchparty.website/)** • **[Report Bug](https://github.com/aasif-md1/watch-party-app/issues)** • **[Request Feature](https://github.com/aasif-md1/watch-party-app/issues)**

</div>

---

## 📸 The Live Cinema Experience

<div align="center">
  <img src="client/public/images/cinematic-room-preview.png" alt="WatchParty Live Movie Screening with Synchronized Chat" width="94%" style="border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.8);" />
  <p><i>Live screening room showing synchronized 1080p playback on the left with live sidecar banter on the right.</i></p>
</div>

---

## 💡 How It Works

WatchParty brings the magic of co-watching to the web without needing third-party browser extensions or desktop downloads. Everything runs natively in modern web browsers:

```
[ Room Host ]
      │
      ├── Play / Pause / Seek Actions ──► [ WebSocket Sync Engine ] ──► [ All Viewers ]
      │                                             │                     (Frame-Locked)
      └── WebRTC HD Screen Stream ──────────────────┼─────────────────► [ Direct P2P Video ]
                                                    │                     (Netflix / Anime / YouTube)
[ Live Sidecar Chat & Audio Calls ] ────────────────┴─────────────────► [ Noise-Gated Audio Bus ]
```

### 1. Frame-Locked Video Synchronization Engine
* **Millisecond Precision**: Whenever the host plays, pauses, or scrubs the timeline, playback timestamps are broadcasted via Socket.io to all room participants.
* **Continuous Drift Monitor**: A background heartbeat checks viewer timestamps against the host. If network lag causes a client to drift more than 1.5 seconds, the engine smoothly seeks the viewer back to the exact current frame without buffering.

### 2. Zero-Download Screen Sharing
* **1080p 60fps Pipeline**: Users can screen-share any browser tab, desktop window, or application with crystal-clear system audio.
* **Universal OTT Support**: Stream Netflix, Crunchyroll, Disney+, Prime Video, HBO Max, YouTube, or local video files seamlessly.

### 3. WebRTC Peer-to-Peer Voice & Video
* **Direct Mesh Networking**: Video and voice streams travel directly between participants with ultra-low latency.
* **Web Audio API Noise Gate**: High-pass filtering and adaptive audio compression automatically eliminate mechanical keyboard clicks and room echoes.

---

## ✨ Key Features

- **⚡ Sub-Second Frame-Locked Sync**: Real-time state coordination so everyone reacts to plot twists at the exact same moment.
- **🖥️ Full HD Screen Sharing**: Low-latency screen streaming with full system audio pass-through.
- **💬 Live Sidecar Chat**: Unobtrusive side panel chat with live emoji reactions, timestamps, and sound toggles.
- **🎙️ WebRTC Video Calling**: Built-in webcam tiles with drag-and-drop video filters (neon, vintage, B&W).
- **🛡️ Enterprise Sanitization**: Chat messages are sanitized with DOMPurify to prevent XSS vulnerabilities.
- **🔐 Secure Google Authentication**: Optional 1-click Google OAuth for saving personal room names and custom profiles.
- **📱 Responsive OLED Theater Interface**: Obsidian dark theme with cinematic glow effects engineered for mobile, tablet, and desktop screens.
- **🌐 English & Hinglish Toggle**: Dual-language support built into the interface.

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite | High-performance SPA with instant reactive UI updates |
| **Styling** | Custom CSS, Tailwind | Cinema-dark glassmorphism, OLED theater aesthetics |
| **Real-Time Sync** | Socket.IO | Low-latency state synchronization & bidirectional messaging |
| **Audio / Video** | WebRTC, Web Audio API | Peer-to-peer screen sharing & noise-gated voice calling |
| **Security** | DOMPurify, Firebase Auth | Strict input sanitization & Google OAuth session management |
| **Room Management**| nanoid | Cryptographically secure unique room identifiers |

---

## 🔒 Privacy & Security

* **No Extension Permissions**: Runs entirely in sandboxed browser tabs without requiring intrusive browser extension access.
* **Private Screening Rooms**: Rooms use unguessable cryptographic IDs; only individuals with the direct link can join.
* **Direct P2P Media**: Video and audio calls stream directly between peers rather than passing through centralized recording servers.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full details.

---

## 👤 Author & Maintainer

**Md Aasif**
- **Platform**: [watchparty.website](https://watchparty.website/)
- **GitHub**: [@aasif-md1](https://github.com/aasif-md1)
- **Email**: [mdaasif18092003@gmail.com](mailto:mdaasif18092003@gmail.com)

---

<div align="center">
  <sub>Designed &amp; engineered for synchronized shared movie nights.</sub>
</div>
