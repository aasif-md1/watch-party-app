import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";

export const GoogleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export const LoginModal = ({
  showLoginModal,
  setShowLoginModal,
  pendingAction,
  handleGoogleLogin,
  isMobile
}) => {
  return (
    <AnimatePresence>
      {showLoginModal && (
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => {
            setShowLoginModal(false);
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
              <Lock size={22} />
            </div>

            <h3
              className="font-display"
              style={{
                fontSize: isMobile ? "1.6rem" : "2rem",
                fontWeight: "900",
                color: "#FFFFFF",
                margin: "0 0 6px 0",
                textTransform: "uppercase"
              }}
            >
              Sign In To Continue
            </h3>
            <p
              style={{
                fontSize: "0.84rem",
                color: "rgba(255, 255, 255, 0.7)",
                margin: "0 0 24px 0",
                lineHeight: 1.5
              }}
            >
              Authentication is required to create or join a room securely.
            </p>

            {/* Google Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              style={{
                width: "100%",
                padding: "12px 20px",
                background: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                color: "#000000",
                fontSize: "0.9rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              <GoogleIcon size={18} />
              <span>Continue with Google</span>
            </motion.button>

            <div style={{ marginTop: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "12px" }}>
              <button
                type="button"
                onClick={() => {
                  setShowLoginModal(false);
                  pendingAction.current = null;
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  padding: "4px 8px"
                }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
