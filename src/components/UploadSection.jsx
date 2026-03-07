import React, { useCallback, useRef, useState } from "react";

const ACCEPTED_TYPES = [
  ".pdf",
  ".doc",
  ".docx",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function UploadSection({ selectedFile, onFileSelected, onAnalyze }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(
    (file) => {
      if (!file) return;

      const isAccepted =
        ACCEPTED_TYPES.includes(file.type) ||
        ACCEPTED_TYPES.some((ext) => file.name.toLowerCase().endsWith(ext));

      if (!isAccepted) {
        setError("Please upload a PDF or Word document.");
        onFileSelected(null);
        return;
      }

      setError("");
      onFileSelected(file);
    },
    [onFileSelected],
  );

  const onFileInputChange = (event) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="upload-card">
      <div className="upload-card-header">
        <h2 className="upload-title">Drop your resume into orbit</h2>
        <p className="upload-subtitle">
          We’ll read the PDF, extract the text, and get it ready for your AI
          analysis layer.
        </p>
      </div>

      <div
        className={[
          "dropzone",
          isDragging ? "dropzone-active" : "",
          error ? "dropzone-error" : "",
        ]
          .join(" ")
          .trim()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={openFileDialog}
      >
        <span className="dropzone-glow" />
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={onFileInputChange}
          className="file-input"
        />

        <div className="dropzone-inner">
          <div className="dropzone-orbit">
            <span className="dropzone-orbit-dot" />
          </div>
          <div className="dropzone-copy">
            <p className="dropzone-title">
              Drag &amp; drop a PDF resume
            </p>
            <p className="dropzone-hint">
              or <span className="link-like">choose a file</span> from your
              device
            </p>
          </div>
        </div>

        {selectedFile && !error && (
          <div className="file-pill">
            <span className="file-dot" />
            <span className="file-name">{selectedFile.name}</span>
            <span className="file-meta">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </span>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>

      <button
        type="button"
        className="primary-button"
        disabled={!selectedFile}
        onClick={onAnalyze}
      >
        <span className="primary-button-glow" />
        <span>Analyze resume</span>
      </button>

      <p className="upload-footnote">
        Works best with clean, single‑column resumes. This demo focuses purely
        on UI — plug in your own AI logic behind the button.
      </p>
    </div>
  );
}

