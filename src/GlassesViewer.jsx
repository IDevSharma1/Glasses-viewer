import React, { Suspense, useState } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html, useProgress } from "@react-three/drei";

// 🌀 Loader Component — shows progress %
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "150px",
            height: "8px",
            background: "#ddd",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "8px"
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#007bff",
              transition: "width 0.2s ease"
            }}
          ></div>
        </div>
        <p style={{ color: "#333", fontWeight: "bold" }}>{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

// 👓 Glasses model loader
function GlassesModel() {
  const { scene } = useGLTF("/models/glasses.glb"); // Path relative to public/
  // Increase Y scale for more height
  return <primitive object={scene} scale={[1.5, 2.2, 1.5]} />;
}

export default function GlassesViewer() {
  const [env, setEnv] = useState("studio");

  return (
    <div className="viewer-root">
      <div className="viewer-center">
        <Canvas className="viewer-canvas" camera={{ position: [0, 0, 3], fov: 45 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[2, 2, 2]} intensity={1.5} />
          <Suspense fallback={<Loader />}>
            <GlassesModel />
            <Environment preset={env} background />
          </Suspense>
          <OrbitControls enableZoom={true} enablePan={false} />
        </Canvas>
        <div className="viewer-btnbar">
          <button
            className={`viewer-btn ${env === "studio" ? "active" : ""}`}
            onClick={() => setEnv("studio")}
          >
            Studio
          </button>
          <button
            className={`viewer-btn ${env === "city" ? "active" : ""}`}
            onClick={() => setEnv("city")}
          >
            City
          </button>
          <button
            className={`viewer-btn ${env === "sunset" ? "active" : ""}`}
            onClick={() => setEnv("sunset")}
          >
            Sunset
          </button>
        </div>
      </div>
    </div>
  );
}
