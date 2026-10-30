const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception in Server:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection in Server:", reason);
});

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Watch Party Server is running!");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["websocket", "polling"],
});

// Store room state in memory:
// Map<roomId, {
//   roomType: 'youtube' | 'screenshare',
//   hostId: string,
//   users: Map<userId, { userId, username, socketId, isHost, joinedAt }>,
//   videoUrl: string,
//   playing: boolean,
//   seekTime: number,
//   lastUpdated: number,
//   presenterId: string | null,
//   presenterUserId: string | null,
//   isScreenSharing: boolean,
//   messages: Array<{ id, room, author, message, time, isSystem }>
// }>
const rooms = new Map();

// Map<socketId, { roomId, userId }>
const socketUserMap = new Map();

// Store cleanup timers — rooms are deleted 10 min after the last user leaves
const roomCleanupTimers = new Map();

// Grace period timer for brief presenter disconnects (7 seconds)
const presenterGraceTimers = new Map();

// Helper to broadcast room users and member count accurately
const broadcastRoomUsers = (roomId) => {
  const room = rooms.get(roomId);
  if (!room) return;

  const userList = Array.from(room.users.values()).map((u) => ({
    userId: u.userId,
    username: u.username,
    socketId: u.socketId,
    isHost: u.userId === room.hostId,
  }));

  io.to(roomId).emit("room_users_update", {
    count: userList.length,
    users: userList,
    hostId: room.hostId,
  });

  io.to(roomId).emit("member_count_update", userList.length);
};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // ========================
  // ROOM CREATION
  // ========================

  socket.on("create_room", (data) => {
    try {
      if (!data || !data.roomId || !data.hostUserId) return;
      const { roomId, hostUserId, hostUsername, roomType, videoUrl } = data;
      console.log(`[CREATE_ROOM] Room ${roomId} created by host ${hostUsername} (${hostUserId})`);

      // Cancel any pending cleanup timer for this room
      if (roomCleanupTimers.has(roomId)) {
        clearTimeout(roomCleanupTimers.get(roomId));
        roomCleanupTimers.delete(roomId);
      }

      rooms.set(roomId, {
        roomType: roomType || "youtube",
        hostId: hostUserId,
        hostUsername: hostUsername || "Host",
        users: new Map(),
        videoUrl: videoUrl || "",
        playing: false,
        seekTime: 0,
        lastUpdated: Date.now(),
        presenterId: null,
        presenterUserId: null,
        isScreenSharing: false,
        messages: [],
      });
    } catch (err) {
      console.error("create_room error:", err);
    }
  });

  // ========================
  // ROOM JOIN / LEAVE
  // ========================

  socket.on("join_room", (roomData) => {
    try {
      if (!roomData) return;
      const roomId = typeof roomData === "object" ? roomData.roomId : roomData;
      if (!roomId) return;

      const incomingUrl = typeof roomData === "object" ? roomData.videoUrl : null;
      const roomType = typeof roomData === "object" ? (roomData.roomType || "youtube") : "youtube";
      const username = typeof roomData === "object" ? (roomData.username || "Watcher") : "Watcher";
      const userId = typeof roomData === "object" ? (roomData.userId || socket.id) : socket.id;
      const isHost = typeof roomData === "object" ? !!roomData.isHost : false;

      socket.join(roomId);

      // Cancel any pending 10-minute cleanup timer for this room
      if (roomCleanupTimers.has(roomId)) {
        clearTimeout(roomCleanupTimers.get(roomId));
        roomCleanupTimers.delete(roomId);
        console.log(`Cleanup timer cancelled for room ${roomId} (user joined)`);
      }

      if (!rooms.has(roomId)) {
        // If room does not exist yet: ONLY assign hostId if the joining user is the actual creator!
        // If a friend joins before creator, hostId stays null until the genuine creator joins!
        rooms.set(roomId, {
          roomType,
          hostId: isHost ? userId : null,
          users: new Map(),
          videoUrl: incomingUrl || "",
          playing: false,
          seekTime: 0,
          lastUpdated: Date.now(),
          presenterId: null,
          presenterUserId: null,
          isScreenSharing: false,
          messages: [],
        });
      } else {
        const currentRoom = rooms.get(roomId);
        // If room has no host yet (e.g. friend joined first) and now the creator joins
        if (!currentRoom.hostId && isHost) {
          currentRoom.hostId = userId;
          console.log(`Assigned hostId ${userId} to room ${roomId}`);
        } else if (isHost && currentRoom.hostId === userId) {
          console.log(`Creator ${userId} rejoined their room ${roomId}`);
        }
        if (incomingUrl && currentRoom.videoUrl !== incomingUrl) {
          currentRoom.videoUrl = incomingUrl;
          currentRoom.seekTime = 0;
        }
      }

      const currentRoom = rooms.get(roomId);
      const isUserHost = currentRoom.hostId === userId;

      // Add or update user in room
      currentRoom.users.set(userId, {
        userId,
        username,
        socketId: socket.id,
        isHost: isUserHost,
        joinedAt: Date.now(),
      });
      socketUserMap.set(socket.id, { roomId, userId });

      // If presenter reconnected
      if (currentRoom.presenterUserId === userId) {
        currentRoom.presenterId = socket.id;
        if (presenterGraceTimers.has(roomId)) {
          clearTimeout(presenterGraceTimers.get(roomId));
          presenterGraceTimers.delete(roomId);
          console.log(`Presenter ${userId} reconnected to room ${roomId}. Screen share preserved.`);
        }
      }

      if (!currentRoom.messages) currentRoom.messages = [];

      // Send initial room state
      const publicState = {
        roomType: currentRoom.roomType,
        videoUrl: currentRoom.videoUrl,
        playing: currentRoom.playing,
        seekTime: currentRoom.seekTime,
        lastUpdated: currentRoom.lastUpdated,
        presenterId: currentRoom.presenterId,
        isScreenSharing: currentRoom.isScreenSharing,
        hostId: currentRoom.hostId,
      };

      socket.emit("room_state", publicState);
      socket.emit("chat_history", currentRoom.messages);

      // Broadcast updated member count and user list to everyone
      broadcastRoomUsers(roomId);

      console.log(`User ${username} (${userId}) joined room: ${roomId}. Total unique users: ${currentRoom.users.size}`);
    } catch (err) {
      console.error("join_room error:", err);
    }
  });

  // ========================
  // CHAT MESSAGES
  // ========================

  socket.on("send_message", (data) => {
    try {
      if (!data || !data.room) return;
      const room = rooms.get(data.room);

      const messageData = {
        id: data.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        room: data.room,
        author: data.author || "Watcher",
        message: String(data.message || "").slice(0, 500),
        time: data.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSystem: !!data.isSystem,
        replyTo: data.replyTo
          ? {
              id: data.replyTo.id,
              author: data.replyTo.author,
              message: String(data.replyTo.message || "").slice(0, 100),
            }
          : null,
        reactions: data.reactions || {},
      };

      if (room) {
        if (!room.messages) room.messages = [];
        room.messages.push(messageData);
        // Keep up to 1000 messages in chat history
        if (room.messages.length > 1000) room.messages.shift();
      }

      // Relay to other users in room
      socket.to(data.room).emit("receive_message", messageData);
    } catch (err) {
      console.error("send_message error:", err);
    }
  });

  socket.on("message_reaction", (data) => {
    try {
      if (!data || !data.room || !data.messageId || !data.reaction) return;
      const room = rooms.get(data.room);
      if (room && room.messages) {
        const msg = room.messages.find((m) => m.id === data.messageId);
        if (msg) {
          if (!msg.reactions) msg.reactions = {};
          const userKey = String(data.userId || data.author || socket.id);
          const targetReaction = data.reaction;

          // WhatsApp rule: A user can only have ONE reaction per message
          let previousReaction = null;
          for (const [r, userList] of Object.entries(msg.reactions)) {
            if (Array.isArray(userList) && userList.includes(userKey)) {
              previousReaction = r;
              break;
            }
          }

          let wasAdded = false;

          if (previousReaction === targetReaction) {
            // User clicked the exact same reaction -> toggle off
            msg.reactions[targetReaction] = msg.reactions[targetReaction].filter((u) => u !== userKey);
            if (msg.reactions[targetReaction].length === 0) {
              delete msg.reactions[targetReaction];
            }
          } else {
            // Remove user from previous reaction if they had a different one
            if (previousReaction && msg.reactions[previousReaction]) {
              msg.reactions[previousReaction] = msg.reactions[previousReaction].filter((u) => u !== userKey);
              if (msg.reactions[previousReaction].length === 0) {
                delete msg.reactions[previousReaction];
              }
            }

            // Add new reaction
            if (!msg.reactions[targetReaction]) {
              msg.reactions[targetReaction] = [];
            }
            if (!msg.reactions[targetReaction].includes(userKey)) {
              msg.reactions[targetReaction].push(userKey);
              wasAdded = true;
            }
          }

          io.to(data.room).emit("message_reaction_update", {
            messageId: data.messageId,
            reactions: msg.reactions,
            reactionAdded: wasAdded ? targetReaction : null,
            userId: userKey,
          });
        }
      }
    } catch (err) {
      console.error("message_reaction error:", err);
    }
  });

  // ========================
  // HOST KICK USER
  // ========================

  socket.on("kick_user", (data) => {
    try {
      if (!data || !data.roomId || !data.targetUserId) return;
      const { roomId, targetUserId, requesterUserId } = data;
      const room = rooms.get(roomId);
      if (!room) return;

      // Security check: Only the host can kick users
      const isRequesterHost = room.hostId === requesterUserId;
      if (!isRequesterHost) {
        console.warn(`Unauthorized kick attempt by ${requesterUserId} in room ${roomId}`);
        return;
      }

      // Host cannot kick themselves
      if (targetUserId === room.hostId) return;

      const targetUser = room.users.get(targetUserId);
      if (!targetUser) return;

      console.log(`Host ${requesterUserId} kicked user ${targetUser.username} (${targetUserId}) from room ${roomId}`);

      // If target user was screen sharing, stop it
      if (room.presenterId === targetUser.socketId || room.presenterUserId === targetUserId) {
        room.presenterId = null;
        room.presenterUserId = null;
        room.isScreenSharing = false;
        io.to(roomId).emit("screen_share_stopped", { presenterId: targetUser.socketId });
      }

      // Send kick notification to target user socket
      io.to(targetUser.socketId).emit("kicked_from_room", {
        reason: "You were removed from the room by the host.",
      });

      // Target socket leaves room
      const targetSocket = io.sockets.sockets.get(targetUser.socketId);
      if (targetSocket) {
        targetSocket.leave(roomId);
      }

      // Remove from room state
      room.users.delete(targetUserId);
      socketUserMap.delete(targetUser.socketId);

      // Post system announcement to chat
      const sysMsg = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        room: roomId,
        author: "System",
        message: `${targetUser.username} was removed by the host.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSystem: true,
      };
      if (!room.messages) room.messages = [];
      room.messages.push(sysMsg);
      io.to(roomId).emit("receive_message", sysMsg);

      // Broadcast updated user list and member count
      broadcastRoomUsers(roomId);
    } catch (err) {
      console.error("kick_user error:", err);
    }
  });

  // ========================
  // YOUTUBE VIDEO STATE SYNC
  // ========================

  socket.on("video_state_change", (data) => {
    try {
      if (!data || !data.room) return;
      if (rooms.has(data.room)) {
        const roomState = rooms.get(data.room);
        roomState.playing = data.playing;
        roomState.seekTime = data.seekTime;
        roomState.lastUpdated = Date.now();
      }
      socket.to(data.room).emit("video_state_update", data);
    } catch (err) {
      console.error("video_state_change error:", err);
    }
  });

  socket.on("sync_time", (data) => {
    try {
      if (!data || !data.room) return;
      if (rooms.has(data.room)) {
        const roomState = rooms.get(data.room);
        roomState.seekTime = data.time;
        roomState.playing = data.playing;
        roomState.lastUpdated = Date.now();
      }
    } catch (err) {
      console.error("sync_time error:", err);
    }
  });

  socket.on("video_seek", (data) => {
    try {
      if (!data || !data.room) return;
      if (rooms.has(data.room)) {
        const roomState = rooms.get(data.room);
        roomState.seekTime = data.seekTime;
        roomState.playing = data.playing;
        roomState.lastUpdated = Date.now();
      }
      socket.to(data.room).emit("video_seek", data);
    } catch (err) {
      console.error("video_seek error:", err);
    }
  });

  // ========================
  // SCREEN SHARE SIGNALING
  // ========================

  socket.on("start_screen_share", (data) => {
    try {
      if (!data || !data.room) return;
      const { room, userId } = data;
      if (rooms.has(room)) {
        const roomState = rooms.get(room);
        roomState.presenterId = socket.id;
        roomState.presenterUserId = userId || null;
        roomState.isScreenSharing = true;
        if (presenterGraceTimers.has(room)) {
          clearTimeout(presenterGraceTimers.get(room));
          presenterGraceTimers.delete(room);
        }
      }
      socket.to(room).emit("screen_share_started", { presenterId: socket.id });
      console.log(`Screen share started by socket ${socket.id} (user ${userId}) in room ${room}`);
    } catch (err) {
      console.error("start_screen_share error:", err);
    }
  });

  socket.on("stop_screen_share", (data) => {
    try {
      if (!data || !data.room) return;
      const { room } = data;
      if (rooms.has(room)) {
        const roomState = rooms.get(room);
        roomState.presenterId = null;
        roomState.presenterUserId = null;
        roomState.isScreenSharing = false;
        if (presenterGraceTimers.has(room)) {
          clearTimeout(presenterGraceTimers.get(room));
          presenterGraceTimers.delete(room);
        }
      }
      socket.to(room).emit("screen_share_stopped", { presenterId: socket.id });
      console.log(`Screen share stopped by ${socket.id} in room ${room}`);
    } catch (err) {
      console.error("stop_screen_share error:", err);
    }
  });

  socket.on("screen_share_offer", (data) => {
    try {
      if (!data || !data.to) return;
      const { to, offer, room } = data;
      io.to(to).emit("screen_share_offer", { from: socket.id, offer, room });
    } catch (err) {
      console.error("screen_share_offer error:", err);
    }
  });

  socket.on("screen_share_answer", (data) => {
    try {
      if (!data || !data.to) return;
      const { to, answer, room } = data;
      io.to(to).emit("screen_share_answer", { from: socket.id, answer, room });
    } catch (err) {
      console.error("screen_share_answer error:", err);
    }
  });

  socket.on("screen_ice_candidate", (data) => {
    try {
      if (!data || !data.to) return;
      const { to, candidate, room } = data;
      io.to(to).emit("screen_ice_candidate", { from: socket.id, candidate, room });
    } catch (err) {
      console.error("screen_ice_candidate error:", err);
    }
  });

  socket.on("request_screen_share", (data) => {
    try {
      if (!data || !data.room) return;
      const { room } = data;
      if (rooms.has(room)) {
        const roomState = rooms.get(room);
        if (roomState.presenterId && roomState.isScreenSharing) {
          io.to(roomState.presenterId).emit("viewer_joined", { viewerId: socket.id, room });
        }
      }
    } catch (err) {
      console.error("request_screen_share error:", err);
    }
  });

  // ========================
  // VIDEO CHAT SIGNALING
  // ========================

  socket.on("video_chat_offer", (data) => {
    try {
      if (!data || !data.to) return;
      const { to, offer, room, username } = data;
      io.to(to).emit("video_chat_offer", { from: socket.id, offer, room, username });
    } catch (err) {
      console.error("video_chat_offer error:", err);
    }
  });

  socket.on("video_chat_answer", (data) => {
    try {
      if (!data || !data.to) return;
      const { to, answer, room, username } = data;
      io.to(to).emit("video_chat_answer", { from: socket.id, answer, room, username });
    } catch (err) {
      console.error("video_chat_answer error:", err);
    }
  });

  socket.on("video_chat_ice", (data) => {
    try {
      if (!data || !data.to) return;
      const { to, candidate, room } = data;
      io.to(to).emit("video_chat_ice", { from: socket.id, candidate, room });
    } catch (err) {
      console.error("video_chat_ice error:", err);
    }
  });

  socket.on("video_chat_enabled", (data) => {
    try {
      if (!data || !data.room) return;
      socket.to(data.room).emit("peer_video_chat_enabled", {
        peerId: socket.id,
        username: data.username,
      });
    } catch (err) {
      console.error("video_chat_enabled error:", err);
    }
  });

  socket.on("video_chat_disabled", (data) => {
    try {
      if (!data || !data.room) return;
      socket.to(data.room).emit("peer_video_chat_disabled", {
        peerId: socket.id,
      });
    } catch (err) {
      console.error("video_chat_disabled error:", err);
    }
  });

  socket.on("video_chat_effect", (data) => {
    try {
      if (!data || !data.room) return;
      socket.to(data.room).emit("video_chat_effect", {
        from: socket.id,
        filter: data.filter,
      });
    } catch (err) {
      console.error("video_chat_effect error:", err);
    }
  });

  socket.on("video_live_reaction", (data) => {
    try {
      if (!data || !data.room || !data.reaction) return;
      socket.to(data.room).emit("video_live_reaction", {
        from: socket.id,
        reaction: data.reaction,
      });
    } catch (err) {
      console.error("video_live_reaction error:", err);
    }
  });

  // ========================
  // DISCONNECT & CLEANUP
  // ========================

  socket.on("disconnect", (reason) => {
    try {
      console.log(`User Disconnected: ${socket.id}, reason: ${reason}`);

      const mapping = socketUserMap.get(socket.id);
      if (mapping) {
        const { roomId, userId } = mapping;
        socketUserMap.delete(socket.id);

        const room = rooms.get(roomId);
        if (room) {
          // Remove user from room users map if it matches this socket
          const existingUser = room.users.get(userId);
          if (existingUser && existingUser.socketId === socket.id) {
            room.users.delete(userId);
          }

          // If presenter disconnected, start 7-second grace timer
          if (room.presenterId === socket.id) {
            console.log(`Presenter socket ${socket.id} disconnected. Setting 7s grace period before stopping screen share.`);
            if (presenterGraceTimers.has(roomId)) {
              clearTimeout(presenterGraceTimers.get(roomId));
            }
            const pTimer = setTimeout(() => {
              const currentRoom = rooms.get(roomId);
              if (currentRoom && currentRoom.presenterId === socket.id) {
                currentRoom.presenterId = null;
                currentRoom.presenterUserId = null;
                currentRoom.isScreenSharing = false;
                io.to(roomId).emit("screen_share_stopped", { presenterId: socket.id });
                console.log(`Screen share auto-stopped in room ${roomId} (presenter did not reconnect).`);
              }
              presenterGraceTimers.delete(roomId);
            }, 7000);
            presenterGraceTimers.set(roomId, pTimer);
          }

          // Broadcast updated user list and accurate member count
          broadcastRoomUsers(roomId);

          // If room is now empty (0 unique users), schedule 10-minute cleanup timer
          if (room.users.size === 0) {
            const CLEANUP_DELAY = 10 * 60 * 1000; // 10 minutes
            console.log(`Room ${roomId} has 0 users. Scheduling deletion in 10 minutes.`);
            if (roomCleanupTimers.has(roomId)) {
              clearTimeout(roomCleanupTimers.get(roomId));
            }
            const timer = setTimeout(() => {
              const checkRoom = rooms.get(roomId);
              if (checkRoom && checkRoom.users.size === 0) {
                rooms.delete(roomId);
                roomCleanupTimers.delete(roomId);
                console.log(`Room ${roomId} and its messages cleaned up after 10-minute timeout.`);
              } else {
                roomCleanupTimers.delete(roomId);
                console.log(`Room ${roomId} cleanup cancelled — users rejoined.`);
              }
            }, CLEANUP_DELAY);
            roomCleanupTimers.set(roomId, timer);
          }
        }
      }
    } catch (err) {
      console.error("disconnect error:", err);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
