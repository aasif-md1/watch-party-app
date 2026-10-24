import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/Home";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import StreamRoom from "./pages/StreamRoom";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load ScreenShareRoom to reduce initial bundle
const ScreenShareRoom = lazy(() => import("./pages/ScreenShareRoom"));

function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/stream/:roomId" element={<StreamRoom />} />
          <Route
            path="/screen/:roomId"
            element={
              <Suspense fallback={<div style={{ background: "#000", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>Loading...</div>}>
                <ScreenShareRoom />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </HelmetProvider>
  );
}

export default App;
