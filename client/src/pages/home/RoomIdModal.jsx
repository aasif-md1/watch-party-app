import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, CheckCheck, Play } from "lucide-react";

export const RoomIdModal = ({
  showRoomModal,
  setShowRoomModal,
  generatedRoomId,
  copied,
  copyRoomId,
  enterGeneratedRoom,
  isMobile
}) => {
  return (
    <AnimatePresence>
      {showRoomModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setShowRoomModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "440px",
              background: "#181818",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "6px",
              padding: isMobile ? "24px 20px" : "32px 28px",
              textAlign: "center",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.95)"
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(229, 9, 20, 0.15)",
                border: "1px solid #E50914",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                color: "#E50914"
              }}
            >
              <Check size={26} strokeWidth={3} />
            </div>

            <h3
              className="font-display"
              style={{
                fontSize: isMobile ? "1.8rem" : "2.2rem",
                fontWeight: "900",
                color: "#FFFFFF",
                margin: "0 0 6px 0",
                textTransform: "uppercase"
              }}
            >
              Room Ready
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "rgba(255, 255, 255, 0.7)",
                margin: "0 0 20px 0",
                lineHeight: 1.5
              }}
            >
              Share this unique Room ID with your friends to join your watch party.
            </p>

            {/* Room ID Box */}
            <div
              style={{
                background: "#0c0c0c",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "4px",
                padding: "12px 16px",
                marginBottom: "20px"
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.4)",
                  marginBottom: "4px",
                  fontWeight: "700"
                }}
              >
                Room ID
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: isMobile ? "1.1rem" : "1.25rem",
                  fontWeight: "800",
                  color: "#E50914",
                  letterSpacing: "0.06em",
                  wordBreak: "break-all"
                }}
              >
                {generatedRoomId}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px", flexDirection: isMobile ? "column" : "row" }}>
              <button
                type="button"
                onClick={copyRoomId}
                style={{
                  flex: 1,
                  padding: "12px 18px",
                  borderRadius: "4px",
                  background: copied ? "rgba(74, 222, 128, 0.15)" : "rgba(255, 255, 255, 0.1)",
                  border: copied ? "1px solid #4ADE80" : "1px solid rgba(255, 255, 255, 0.2)",
                  color: copied ? "#4ADE80" : "#FFFFFF",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
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
                whileHover={{ scale: 1.02, background: "#F6121D" }}
                whileTap={{ scale: 0.98, background: "#B80710" }}
                onClick={enterGeneratedRoom}
                style={{
                  flex: 1,
                  padding: "12px 18px",
                  borderRadius: "4px",
                  background: "#E50914",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "0.9rem",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <Play size={16} fill="#FFFFFF" />
                <span>Enter Room</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
