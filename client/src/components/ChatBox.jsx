import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import { Reply, Smile, X, Send } from "lucide-react";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

const isOnlyEmojis = (text) => {
  if (!text) return false;
  const clean = text.trim();
  if (clean.length === 0 || clean.length > 10) return false;
  const withoutEmojis = clean.replace(/(\p{Extended_Pictographic}|\p{Emoji_Presentation}|\uFE0F|\u200D|\u20E3|\s)/gu, "");
  return withoutEmojis.length === 0;
};

const isHeartEmoji = (text) => {
  if (!text) return false;
  return /^(❤️|💖|💗|💓|💞|💘|💝)+$/u.test(text.trim());
};

const ChatBox = ({ socket, room, username, userId }) => {
  const currentUserId = userId || username;
  const [currentMessage, setCurrentMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [activeReactionMenu, setActiveReactionMenu] = useState(null); // { id: messageId, placement: 'top' | 'bottom' }
  const [floatingParticles, setFloatingParticles] = useState([]); // [{ id, emoji, x, y }]
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnterMsg = (id) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredMsgId(id);
  };

  const handleMouseLeaveMsg = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMsgId(null);
    }, 300);
  };

  const [messageList, setMessageList] = useState(() => {
    try {
      const saved = localStorage.getItem(`wp_chat_${room}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const messageRefs = useRef(new Map());

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom("smooth");
    try {
      localStorage.setItem(`wp_chat_${room}`, JSON.stringify(messageList));
    } catch {}
  }, [messageList, room]);

  const sendMessage = () => {
    const trimmedMsg = currentMessage.trim();
    if (trimmedMsg !== "" && trimmedMsg.length <= 500) {
      const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const messageData = {
        id: messageId,
        room,
        author: username,
        message: trimmedMsg,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSystem: false,
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              author: replyingTo.author,
              message: replyingTo.message.slice(0, 120),
            }
          : null,
        reactions: {},
      };

      socket.emit("send_message", messageData);

      messageData.message = DOMPurify.sanitize(messageData.message);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      setReplyingTo(null);

      // Focus input back
      inputRef.current?.focus();
    }
  };

  const handleStartReply = (msg) => {
    setReplyingTo({
      id: msg.id,
      author: msg.author,
      message: msg.message,
    });
    setActiveReactionMenu(null);
    inputRef.current?.focus();
  };

  const toggleReactionMenu = (msgId, index) => {
    if (activeReactionMenu?.id === msgId) {
      setActiveReactionMenu(null);
      return;
    }

    let placement = "top";
    const el = messageRefs.current.get(msgId);
    const container = messagesContainerRef.current;

    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      // If the message bubble is within 70px of the container's top edge, place below!
      if (elRect.top - containerRect.top < 70) {
        placement = "bottom";
      }
    } else if (index === 0) {
      placement = "bottom";
    }

    setActiveReactionMenu({ id: msgId, placement });
  };

  // Close reaction menu when clicking outside
  useEffect(() => {
    if (!activeReactionMenu) return;
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".reaction-popover") &&
        !e.target.closest(".btn-action-react")
      ) {
        setActiveReactionMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeReactionMenu]);

  const handleSelectReaction = (messageId, reaction) => {
    socket.emit("message_reaction", {
      room,
      messageId,
      reaction,
      author: username,
      userId: currentUserId,
    });
    setActiveReactionMenu(null);
    setHoveredMsgId(null);

    // Optimistically update strictly enforcing max 1 reaction per user
    setMessageList((list) =>
      list.map((m) => {
        if (m.id !== messageId) return m;
        const newReactions = {};
        let hadSameReaction = false;

        // Strip current user from all existing reactions on this message
        for (const [r, users] of Object.entries(m.reactions || {})) {
          if (!Array.isArray(users)) continue;
          if (r === reaction && users.includes(currentUserId)) {
            hadSameReaction = true;
          }
          const filtered = users.filter((u) => u !== currentUserId);
          if (filtered.length > 0) {
            newReactions[r] = filtered;
          }
        }

        // If user didn't already have this reaction, add it (switching or adding new)
        if (!hadSameReaction) {
          newReactions[reaction] = [...(newReactions[reaction] || []), currentUserId];
          spawnBurst(messageId, reaction);
        }

        return { ...m, reactions: newReactions };
      })
    );
  };

  const spawnBurst = (messageId, emoji) => {
    const el = messageRefs.current.get(messageId);
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    if (el) {
      const rect = el.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
    const particleId = Date.now() + Math.random();
    setFloatingParticles((prev) => [...prev, { id: particleId, emoji, x, y }]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== particleId));
    }, 1200);
  };

  const scrollToQuotedMessage = (targetId) => {
    const el = messageRefs.current.get(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("msg-highlight");
      setTimeout(() => el.classList.remove("msg-highlight"), 1500);
    }
  };

  useEffect(() => {
    const handler = (data) => {
      const sanitizedData = {
        ...data,
        id: data.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message: DOMPurify.sanitize(data.message),
      };
      setMessageList((list) => {
        if (list.some((m) => m.id === sanitizedData.id)) return list;
        return [...list, sanitizedData];
      });
    };

    const historyHandler = (history) => {
      if (Array.isArray(history) && history.length > 0) {
        const sanitizedHistory = history.map((msg) => ({
          ...msg,
          id: msg.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message: DOMPurify.sanitize(msg.message),
        }));
        setMessageList(sanitizedHistory);
      }
    };

    const reactionHandler = ({ messageId, reactions, reactionAdded, userId: reactorId }) => {
      setMessageList((list) =>
        list.map((m) => (m.id === messageId ? { ...m, reactions } : m))
      );
      if (reactionAdded && reactorId !== currentUserId) {
        spawnBurst(messageId, reactionAdded);
      }
    };

    socket.on("receive_message", handler);
    socket.on("chat_history", historyHandler);
    socket.on("message_reaction_update", reactionHandler);

    return () => {
      socket.off("receive_message", handler);
      socket.off("chat_history", historyHandler);
      socket.off("message_reaction_update", reactionHandler);
    };
  }, [socket, currentUserId]);

  return (
    <div className="chatbox-root">
      {/* Header */}
      <div className="chatbox-header">
        <div className="chatbox-header-left">
          <span className="chatbox-dot" />
          <span className="chatbox-title">Room Chat</span>
        </div>
        <span className="chatbox-count">{messageList.length}</span>
      </div>

      {/* Messages */}
      <div
        className="chatbox-messages"
        ref={messagesContainerRef}
        onScroll={() => activeReactionMenu && setActiveReactionMenu(null)}
      >
        {messageList.length === 0 && (
          <div className="chatbox-empty">
            <p>No messages yet. Say hello!</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messageList.map((content, index) => {
            if (content.isSystem) {
              return (
                <div key={content.id || `sys-${index}`} className="msg-system">
                  <span>{content.message}</span>
                </div>
              );
            }

            const isMe = content.author === username;
            const emojiOnly = isOnlyEmojis(content.message);
            const isHeart = isHeartEmoji(content.message);
            const reactionsMap = content.reactions || {};
            const activeReactions = Object.entries(reactionsMap).filter(
              ([, users]) => Array.isArray(users) && users.length > 0
            );
            const isHovered =
              hoveredMsgId === content.id || activeReactionMenu?.id === content.id;

            return (
              <motion.div
                key={content.id || `msg-${index}`}
                ref={(el) => {
                  if (el) messageRefs.current.set(content.id, el);
                  else messageRefs.current.delete(content.id);
                }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => handleMouseEnterMsg(content.id)}
                onMouseLeave={handleMouseLeaveMsg}
                className={`msg-row ${isMe ? "msg-mine" : "msg-other"} ${
                  emojiOnly ? "msg-emoji-only" : ""
                } ${isHovered ? "is-hovered" : ""}`}
              >
                {!isMe && <span className="msg-author">{content.author}</span>}

                <div className="msg-bubble-container">
                  {/* Floating Action Bar (Reply & React) */}
                  <div
                    className={`msg-actions ${isMe ? "actions-left" : "actions-right"} ${
                      isHovered ? "actions-visible" : ""
                    }`}
                    onMouseEnter={() => handleMouseEnterMsg(content.id)}
                    onMouseLeave={handleMouseLeaveMsg}
                  >
                    <button
                      type="button"
                      className="msg-action-btn btn-action-reply"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartReply(content);
                      }}
                      title="Reply"
                    >
                      <Reply size={13} />
                    </button>
                    <button
                      type="button"
                      className="msg-action-btn btn-action-react"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReactionMenu(content.id, index);
                      }}
                      title="React"
                    >
                      <Smile size={13} />
                    </button>
                  </div>

                  {/* Reaction Popover Menu */}
                  <AnimatePresence>
                    {activeReactionMenu?.id === content.id && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                          y: activeReactionMenu.placement === "bottom" ? -4 : 4,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: activeReactionMenu.placement === "bottom" ? 4 : -4,
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.12 }}
                        className={`reaction-popover ${
                          isMe ? "popover-right" : "popover-left"
                        } ${
                          activeReactionMenu.placement === "bottom"
                            ? "popover-bottom"
                            : "popover-top"
                        }`}
                      >
                        {QUICK_REACTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            className="reaction-opt"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectReaction(content.id, emoji);
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Main Bubble */}
                  <div
                    className={`msg-bubble ${
                      emojiOnly
                        ? "bubble-emoji-transparent"
                        : isMe
                        ? "bubble-mine"
                        : "bubble-other"
                    }`}
                  >
                    {/* Reply quote banner inside message */}
                    {content.replyTo && (
                      <div
                        className="msg-quote-preview"
                        onClick={() => scrollToQuotedMessage(content.replyTo.id)}
                      >
                        <span className="quote-author">{content.replyTo.author}</span>
                        <p className="quote-snippet">{content.replyTo.message}</p>
                      </div>
                    )}

                    {/* Message Body */}
                    {emojiOnly ? (
                      <div className={`big-emoji-display ${isHeart ? "heartbeat-anim" : "emoji-pop-anim"}`}>
                        {content.message}
                      </div>
                    ) : (
                      <p className="msg-text">{content.message}</p>
                    )}
                  </div>
                </div>

                {/* Reaction Badges below bubble */}
                {activeReactions.length > 0 && (
                  <div className="msg-reactions-row">
                    {activeReactions.map(([emoji, users]) => {
                      const userHasReacted = users.includes(currentUserId);
                      return (
                        <button
                          key={emoji}
                          className={`reaction-badge ${userHasReacted ? "reacted-by-me" : ""}`}
                          onClick={() => handleSelectReaction(content.id, emoji)}
                          title={`${users.length} reaction${users.length > 1 ? "s" : ""}`}
                        >
                          <span className="reaction-emoji">{emoji}</span>
                          {users.length > 1 && (
                            <span className="reaction-count">{users.length}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                <span className="msg-time">{content.time}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Replying Banner Above Input */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="reply-bar"
          >
            <div className="reply-bar-accent" />
            <div className="reply-bar-content">
              <span className="reply-bar-author">Replying to {replyingTo.author}</span>
              <p className="reply-bar-snippet">{replyingTo.message}</p>
            </div>
            <button className="reply-bar-close" onClick={() => setReplyingTo(null)}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="chatbox-input-area">
        <div className="chatbox-input-wrap">
          <input
            ref={inputRef}
            type="text"
            value={currentMessage}
            placeholder={replyingTo ? `Reply to ${replyingTo.author}...` : "Message..."}
            maxLength={500}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="chatbox-input"
          />
          <span
            className="chatbox-counter"
            style={{ color: currentMessage.length > 400 ? "#ef4444" : "#64748b" }}
          >
            {currentMessage.length}/500
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            className="chatbox-send"
            disabled={!currentMessage.trim() || currentMessage.trim().length > 500}
            title="Send"
          >
            <Send size={15} />
          </motion.button>
        </div>
      </div>

      {/* Floating Reaction Bursts (WhatsApp style) */}
      {floatingParticles.map((p) => (
        <div
          key={p.id}
          className="floating-reaction-particle"
          style={{ left: `${p.x}px`, top: `${p.y}px` }}
        >
          {p.emoji}
        </div>
      ))}

      <style>{`
        .chatbox-root {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #0d0d11;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .chatbox-header {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(18, 18, 22, 0.7);
          backdrop-filter: blur(8px);
          flex-shrink: 0;
        }
        .chatbox-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .chatbox-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #FF1028;
          box-shadow: 0 0 8px rgba(255, 16, 40, 0.6);
        }
        .chatbox-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: #f1f5f9;
        }
        .chatbox-count {
          font-size: 0.68rem;
          color: #64748b;
          background: rgba(255,255,255,0.05);
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 600;
        }

        .chatbox-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 14px 14px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
        .chatbox-messages::-webkit-scrollbar { width: 4px; }
        .chatbox-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .chatbox-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chatbox-empty p {
          color: #475569;
          font-size: 0.8rem;
        }

        .msg-system {
          align-self: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 3px 12px;
          margin: 4px 0;
          font-size: 0.72rem;
          color: #94a3b8;
          text-align: center;
        }

        .msg-row {
          display: flex;
          flex-direction: column;
          max-width: 82%;
          position: relative;
          transition: background 0.3s;
        }
        .msg-mine { align-self: flex-end; align-items: flex-end; }
        .msg-other { align-self: flex-start; align-items: flex-start; }

        .msg-highlight {
          animation: highlightFlash 1.5s ease-out;
        }
        @keyframes highlightFlash {
          0%, 100% { background: transparent; }
          30% { background: rgba(255, 16, 40, 0.2); border-radius: 8px; }
        }

        .msg-author {
          font-size: 0.65rem;
          color: #71717a;
          margin-bottom: 3px;
          padding-left: 4px;
          font-weight: 500;
        }

        .msg-bubble-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        /* Hover Action Bar */
        .msg-actions {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 2px;
          background: rgba(24, 24, 30, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 2px 4px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
          z-index: 25;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease;
        }

        /* Seamless hover bridge: placed BEHIND buttons with z-index: -1 so buttons receive all clicks */
        .msg-actions::before {
          content: "";
          position: absolute;
          top: -12px;
          bottom: -12px;
          z-index: -1;
        }
        .actions-right::before {
          left: -18px;
          right: -8px;
        }
        .actions-left::before {
          right: -18px;
          left: -8px;
        }

        .actions-left { right: calc(100% + 4px); }
        .actions-right { left: calc(100% + 4px); }

        .msg-row:hover .msg-actions,
        .msg-row.is-hovered .msg-actions,
        .msg-actions.actions-visible {
          opacity: 1;
          pointer-events: auto;
        }

        .msg-action-btn {
          position: relative;
          z-index: 2;
          background: transparent;
          border: none;
          color: #94a3b8;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.12s ease;
        }
        .msg-action-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.14);
          transform: scale(1.1);
        }
        .msg-action-btn:active {
          transform: scale(0.92);
        }
        .msg-action-btn * {
          pointer-events: none;
        }

        /* Reaction Popover Bar */
        .reaction-popover {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(20, 20, 26, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 24px;
          padding: 4px 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
          z-index: 50;
          white-space: nowrap;
        }
        .popover-top {
          bottom: calc(100% + 6px);
        }
        .popover-bottom {
          top: calc(100% + 6px);
        }
        .popover-right { right: 0; }
        .popover-left { left: 0; }
        .reaction-opt {
          background: transparent;
          border: none;
          font-size: 1.15rem;
          cursor: pointer;
          padding: 2px 3px;
          border-radius: 6px;
          transition: transform 0.15s;
        }
        .reaction-opt:hover {
          transform: scale(1.35);
        }

        /* Bubbles */
        .msg-bubble {
          padding: 8px 12px;
          border-radius: 14px;
          word-break: break-word;
          position: relative;
        }
        .bubble-mine {
          background: linear-gradient(135deg, #FF1028 0%, #D4081E 100%);
          border-bottom-right-radius: 3px;
          box-shadow: 0 2px 8px rgba(255, 16, 40, 0.25);
        }
        .bubble-other {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom-left-radius: 3px;
        }
        .bubble-emoji-transparent {
          background: transparent !important;
          border: none !important;
          padding: 2px 4px !important;
          box-shadow: none !important;
        }

        .msg-text {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.45;
          color: #f8fafc;
        }

        /* Quoted Reply inside message bubble */
        .msg-quote-preview {
          background: rgba(0, 0, 0, 0.25);
          border-left: 3px solid #FF5A78;
          border-radius: 4px;
          padding: 4px 8px;
          margin-bottom: 6px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .msg-quote-preview:hover {
          background: rgba(0, 0, 0, 0.4);
        }
        .quote-author {
          font-size: 0.68rem;
          font-weight: 700;
          color: #FF8FA3;
          display: block;
        }
        .quote-snippet {
          font-size: 0.74rem;
          color: rgba(255, 255, 255, 0.85);
          margin: 1px 0 0 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* WhatsApp-like Big Emoji Display */
        .big-emoji-display {
          font-size: 2.7rem;
          line-height: 1.15;
          display: inline-block;
        }
        .heartbeat-anim {
          display: inline-block;
          animation: pulseHeart 1.4s infinite ease-in-out;
          transform-origin: center;
        }
        @keyframes pulseHeart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
        .emoji-pop-anim {
          display: inline-block;
          animation: emojiPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes emojiPop {
          0% { transform: scale(0.3); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Reaction Badges row */
        .msg-reactions-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
        }
        .reaction-badge {
          background: rgba(24, 24, 30, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2px 6px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          transition: all 0.12s;
        }
        .reaction-badge:hover {
          background: rgba(255, 255, 255, 0.12);
        }
        .reaction-badge.reacted-by-me {
          border-color: rgba(255, 16, 40, 0.5);
          background: rgba(255, 16, 40, 0.12);
        }
        .reaction-emoji {
          font-size: 0.8rem;
          line-height: 1;
        }
        .reaction-count {
          font-size: 0.65rem;
          font-weight: 700;
          color: #e2e8f0;
        }

        .msg-time {
          font-size: 0.58rem;
          color: #52525b;
          margin-top: 3px;
          padding: 0 2px;
        }

        /* Reply Preview Bar above input */
        .reply-bar {
          background: rgba(20, 20, 26, 0.98);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
        }
        .reply-bar-accent {
          width: 3px;
          height: 100%;
          min-height: 28px;
          background: #FF1028;
          border-radius: 2px;
        }
        .reply-bar-content {
          flex: 1;
          min-width: 0;
        }
        .reply-bar-author {
          font-size: 0.72rem;
          font-weight: 700;
          color: #FF5A78;
          display: block;
        }
        .reply-bar-snippet {
          font-size: 0.76rem;
          color: #94a3b8;
          margin: 2px 0 0 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .reply-bar-close {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s;
        }
        .reply-bar-close:hover { color: #fff; }

        /* Input Area */
        .chatbox-input-area {
          padding: 10px 14px;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(15, 15, 19, 0.85);
          flex-shrink: 0;
        }
        .chatbox-input-wrap {
          display: flex;
          gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 3px 4px 3px 12px;
          align-items: center;
          transition: border-color 0.2s;
        }
        .chatbox-input-wrap:focus-within {
          border-color: rgba(255, 16, 40, 0.45);
          background: rgba(255, 16, 40, 0.03);
        }
        .chatbox-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #f1f5f9;
          font-size: 0.85rem;
          outline: none;
          padding: 8px 0;
          font-family: inherit;
        }
        .chatbox-input::placeholder { color: #475569; }

        .chatbox-counter {
          font-size: 0.65rem;
          margin-right: 4px;
          min-width: 38px;
          text-align: right;
        }
        .chatbox-send {
          width: 34px; height: 34px;
          border-radius: 8px;
          background: linear-gradient(135deg, #FF1028 0%, #D4081E 100%);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .chatbox-send:disabled {
          opacity: 0.3;
          cursor: default;
        }
        .chatbox-send:hover:not(:disabled) {
          transform: scale(1.04);
        }

        /* Floating burst reaction animation */
        .floating-reaction-particle {
          position: fixed;
          font-size: 2rem;
          pointer-events: none;
          z-index: 1000;
          animation: floatUpBurst 1.2s cubic-bezier(0.12, 0, 0.39, 0) forwards;
          transform: translate(-50%, -50%);
        }
        @keyframes floatUpBurst {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.6);
          }
          40% {
            transform: translate(-50%, -90px) scale(1.4);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -170px) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBox;
