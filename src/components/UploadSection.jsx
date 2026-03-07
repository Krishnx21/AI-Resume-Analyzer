import React, { useCallback, useRef, useState } from "react";

const ACCEPTED_TYPES = [
  ".pdf",
  ".doc",
  ".docx",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function UploadSection({
  selectedFile,
  onFileSelected,
  onAnalyze,
  isAnalyzing,
}) {
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
    <div className="stack gap-lg">
      <div>
        <h2 className="section-title">Upload resume</h2>
        <p className="section-subtitle">
          Drag &amp; drop your resume or select a file. We currently support{" "}
          <strong>PDF</strong> and <strong>Word</strong> documents.
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
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={onFileInputChange}
          className="file-input"
        />
        <div className="dropzone-icon">⬆</div>
        <p className="dropzone-title">
          Drop your resume here or <span className="link-like">browse</span>
        </p>
        <p className="dropzone-hint">Max 5 MB. PDF or DOCX recommended.</p>

        {selectedFile && !error && (
          <div className="file-pill">
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
        disabled={!selectedFile || isAnalyzing}
        onClick={onAnalyze}
      >
        {isAnalyzing ? "Analyzing…" : "Analyze resume"}
      </button>
    </div>
  );
}

