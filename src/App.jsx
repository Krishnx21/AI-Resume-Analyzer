import React, { useState } from "react";
import { UploadSection } from "./components/UploadSection.jsx";
import { ResultDashboard } from "./components/ResultDashboard.jsx";
import 

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (!selectedFile) return;
    setHasAnalyzed(true);
  };

  const text = await extractText(selectedFile);

  return (
    <div className="shell">
      <div className="shell-gradient" />

      <header className="shell-header">
        <div className="brand-mark">
          <span className="brand-orbit" />
          <span className="brand-initials">AI</span>
        </div>
        <div className="brand-copy">
          <h1 className="hero-title">AI Resume Analyzer</h1>
          <p className="hero-subtitle">
            A calm, focused space to stress‑test your resume with AI before it
            meets a real recruiter.
          </p>
        </div>
      </header>

      <main className="shell-main">
        <section className="hero-layout">
          <div className="hero-column">
            <div className="hero-pill">Built for modern job searches</div>
            <h2 className="hero-heading">
              Upload a resume.{" "}
              <span className="hero-gradient-text">Leave with a plan.</span>
            </h2>
            <p className="hero-body">
              AI Resume Analyzer surfaces missing skills, rewrites suggestions,
              and a score you can actually improve against — all in a single,
              minimal view.
            </p>
            <ul className="hero-list">
              <li>Glassmorphism interface that keeps the focus on your content.</li>
              <li>Soft micro‑interactions instead of noisy charts.</li>
              <li>Designed to feel like a polished SaaS product.</li>
            </ul>
          </div>

          <div className="hero-card-column">
            <div className="upload-shell">
              <UploadSection
                selectedFile={selectedFile}
                onFileSelected={setSelectedFile}
                onAnalyze={handleAnalyze}
              />
            </div>
          </div>
        </section>

        <section className="results-layout">
          <ResultDashboard hasAnalyzed={hasAnalyzed} />
        </section>
      </main>

      <footer className="shell-footer">
        <span className="shell-footer-text">
          No data is sent anywhere in this demo — this UI is ready for you to
          plug in your own AI logic.
        </span>
      </footer>
    </div>
  );
}

