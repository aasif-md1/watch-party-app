import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ContentRow = ({ title, rightElement, children, isMobile }) => {
  const rowRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === "left" ? -480 : 480;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        position: "relative",
        marginBottom: isMobile ? "40px" : "56px",
        padding: isMobile ? "0 20px" : "0 56px"
      }}
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      {/* Row Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px"
        }}
      >
        <h2
          className="font-display"
          style={{
            fontSize: isMobile ? "1.6rem" : "2.1rem",
            fontWeight: "800",
            color: "#FFFFFF",
            letterSpacing: "0.04em",
            margin: 0,
            textTransform: "uppercase"
          }}
        >
          {title}
        </h2>
        {rightElement}
      </div>

      {/* Row Container with Navigation Arrows */}
      <div style={{ position: "relative" }}>
        {/* Left Arrow (desktop) */}
        {!isMobile && showArrows && (
          <button
            type="button"
            onClick={() => scroll("left")}
            style={{
              position: "absolute",
              left: "-36px",
              top: 0,
              bottom: 0,
              width: "40px",
              background: "rgba(0, 0, 0, 0.7)",
              border: "none",
              color: "#FFFFFF",
              cursor: "pointer",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px"
            }}
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Scrollable Row */}
        <div
          ref={rowRef}
          className="no-scrollbar"
          style={{
            display: "flex",
            gap: "18px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingTop: "8px",
            paddingBottom: "16px",
            paddingRight: isMobile ? "24px" : "56px",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth"
          }}
        >
          {children}
          {/* End spacer so last card is completely visible when scrolled */}
          <div
            aria-hidden="true"
            style={{
              flex: isMobile ? "0 0 20px" : "0 0 40px",
              minWidth: isMobile ? "20px" : "40px",
              pointerEvents: "none"
            }}
          />
        </div>

        {/* Right Arrow (desktop) */}
        {!isMobile && showArrows && (
          <button
            type="button"
            onClick={() => scroll("right")}
            style={{
              position: "absolute",
              right: "-36px",
              top: 0,
              bottom: 0,
              width: "40px",
              background: "rgba(0, 0, 0, 0.7)",
              border: "none",
              color: "#FFFFFF",
              cursor: "pointer",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px"
            }}
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </div>
  );
};
