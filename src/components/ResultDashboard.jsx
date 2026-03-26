import React from "react";

export function ResultDashboard({ hasAnalyzed, analysisResult, error: analysisError }) {
  if (!hasAnalyzed) {
    return (
      <div className="results-shell results-shell-empty">
        <div className="results-label">Preview</div>
        <h2 className="results-title">Your future score lives here</h2>
        <p className="results-subtitle">
          Once you drop in a resume and tap <span>Analyze resume</span>, this
          space will light up with a score, missing skills, and a short,
          readable plan of attack.
        </p>
      </div>
    );
  }

  if (analysisError) {
    return (
      <div className="results-shell results-shell-empty">
        <div className="results-label">Analysis error</div>
        <h2 className="results-title">Something went wrong</h2>
        <p className="results-subtitle" style={{ color: "var(--danger, #f97373)" }}>
          {analysisError}
        </p>
        <p className="results-subtitle" style={{ marginTop: 8, fontSize: "0.8rem" }}>
          Make sure an OpenRouter key is provided — either paste it into the field above, or set{" "}
          <code>VITE_OPENROUTER_API_KEY</code> in your <code>.env</code> file. You can manage keys at{" "}
          <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="link-like">
            openrouter.ai/keys
          </a>.
        </p>
      </div>
    );
  }

  const {
    overallScore,
    candidateName,
    targetRole,
    summary,
    scores,
    strengths,
    weaknesses,
    improvements,
    keywordsFound,
    keywordsMissing,
    atsTips,
    verdict,
    verdictReason,
  } = analysisResult || {};

  const hasScore = typeof overallScore === "number";
  const score = hasScore ? Math.round(overallScore) : 0;

  const getVerdictClass = (v) => {
    if (v === "Shortlist") return "verdict-shortlist";
    if (v === "Reject") return "verdict-reject";
    return "verdict-maybe";
  };

  const getPriorityClass = (p) => {
    if (p === "High") return "priority-high";
    if (p === "Low") return "priority-low";
    return "priority-medium";
  };

  const scoreCategories = scores ? [
    { label: "Formatting", value: scores.formatting },
    { label: "Content Quality", value: scores.content_quality },
    { label: "Skills Relevance", value: scores.skills_relevance },
    { label: "Experience Depth", value: scores.experience_depth },
    { label: "Achievements", value: scores.achievements },
    { label: "ATS Compatibility", value: scores.ats_compatibility },
  ] : [];

  return (
    <div className="results-shell">
      {/* Header with Candidate Info and Verdict */}
      <div className="results-header-row">
        <div className="results-header">
          <div className="results-label">Analysis snapshot</div>
          <h2 className="results-title">
            {candidateName && candidateName !== "Unknown" ? candidateName : "Resume Analysis"}
          </h2>
          {targetRole && targetRole !== "Not specified" && (
            <p className="results-target-role">Target Role: {targetRole}</p>
          )}
        </div>
        {verdict && (
          <div className={`verdict-badge ${getVerdictClass(verdict)}`}>
            <span className="verdict-label">{verdict}</span>
            {verdictReason && <span className="verdict-reason">{verdictReason}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="summary-card">
          <p className="summary-text">{summary}</p>
        </div>
      )}

      <div className="results-grid">
        {/* Overall Score Card */}
        <div className="results-card results-card-score">
          <div className="score-ring" aria-label="Resume score">
            <div className="score-ring-track" />
            <div className="score-ring-fill" style={{ "--score": score }} />
            <div className="score-ring-center">
              <span className="score-number">{hasScore ? score : "--"}</span>
              <span className="score-label">Overall Score</span>
            </div>
          </div>
          <p className="score-caption">
            {analysisResult?.rawResponse ? "Comprehensive AI analysis" : "No analysis available"}
          </p>
        </div>

        {/* Category Scores */}
        {scores && (
          <div className="results-card results-card-categories">
            <h3 className="results-card-title">Score Breakdown</h3>
            <div className="category-scores">
              {scoreCategories.map((cat) => (
                <div key={cat.label} className="category-row">
                  <span className="category-label">{cat.label}</span>
                  <div className="category-bar-container">
                    <div
                      className="category-bar-fill"
                      style={{ "--cat-score": cat.value }}
                    />
                  </div>
                  <span className="category-value">{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths & Weaknesses */}
        {(strengths?.length > 0 || weaknesses?.length > 0) && (
          <div className="results-card results-card-strengths-weaknesses">
            <div className="sw-grid">
              {strengths?.length > 0 && (
                <div className="sw-column">
                  <h3 className="results-card-title sw-title-strengths">Strengths</h3>
                  <ul className="sw-list">
                    {strengths.map((s, idx) => (
                      <li key={idx} className="sw-item sw-item-strength">
                        <span className="sw-icon sw-icon-strength">+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {weaknesses?.length > 0 && (
                <div className="sw-column">
                  <h3 className="results-card-title sw-title-weaknesses">Weaknesses</h3>
                  <ul className="sw-list">
                    {weaknesses.map((w, idx) => (
                      <li key={idx} className="sw-item sw-item-weakness">
                        <span className="sw-icon sw-icon-weakness">-</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Keywords */}
        {(keywordsFound?.length > 0 || keywordsMissing?.length > 0) && (
          <div className="results-card results-card-keywords">
            <h3 className="results-card-title">Keywords Analysis</h3>
            <div className="keywords-grid">
              {keywordsFound?.length > 0 && (
                <div className="keywords-section">
                  <span className="keywords-label keywords-label-found">Found</span>
                  <div className="badge-row">
                    {keywordsFound.map((kw, idx) => (
                      <span key={idx} className="badge badge-found">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
              {keywordsMissing?.length > 0 && (
                <div className="keywords-section">
                  <span className="keywords-label keywords-label-missing">Missing</span>
                  <div className="badge-row">
                    {keywordsMissing.map((kw, idx) => (
                      <span key={idx} className="badge badge-missing">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Improvements */}
        {improvements?.length > 0 && (
          <div className="results-card results-card-improvements">
            <h3 className="results-card-title">Recommended Improvements</h3>
            <div className="improvements-list">
              {improvements.map((imp, idx) => (
                <article key={idx} className="improvement-card">
                  <div className="improvement-top">
                    <span className="improvement-section">{imp.section}</span>
                    <span className={`priority-pill ${getPriorityClass(imp.priority)}`}>
                      {imp.priority}
                    </span>
                  </div>
                  <div className="improvement-row">
                    <span className="improvement-label">Issue</span>
                    <p className="improvement-text">{imp.issue}</p>
                  </div>
                  <div className="improvement-row">
                    <span className="improvement-label">Fix</span>
                    <p className="improvement-text">{imp.fix}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ATS Tips */}
        {atsTips?.length > 0 && (
          <div className="results-card results-card-ats">
            <h3 className="results-card-title">ATS Optimization Tips</h3>
            <ul className="ats-tips-list">
              {atsTips.map((tip, idx) => (
                <li key={idx} className="ats-tip-item">
                  <span className="ats-tip-icon">*</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
