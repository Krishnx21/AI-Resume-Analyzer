import React from "react";

const DEMO_MISSING_SKILLS = [
  "GraphQL",
  "System design",
  "Mentoring",
  "Public speaking",
];
const DEMO_SUGGESTIONS = [
  {
    title: "Tell a sharper story in your summary",
    body: "Open with one sentence that anchors your role, years of experience, and the type of problems you love solving.",
  },
  {
    title: "Quantify 2–3 more achievements",
    body: "Convert generic responsibilities into outcomes. Mention shipped features, revenue impact, or performance gains.",
  },
  {
    title: "Align skills to the roles you want",
    body: "Group your skills into clear categories and make sure the top 6–8 match the job descriptions you are applying to.",
  },
];

const DEMO_MISTAKES = [
  {
    area: "Keywords",
    issue: "Target keywords aren’t clearly visible in the Skills section.",
    fix: "Add a compact Skills block (8–12 items) and mirror the wording used in job posts (e.g., “React”, “REST APIs”, “Testing”).",
    severity: "high",
  },
  {
    area: "Experience bullets",
    issue: "Several bullets read like responsibilities instead of outcomes.",
    fix: "Rewrite 3–5 bullets using impact + metric (e.g., “Reduced load time by 28%…”, “Improved retention by 12%…”).",
    severity: "medium",
  },
  {
    area: "Relevance",
    issue: "Older or unrelated experience takes too much space.",
    fix: "Compress older roles to 1–2 bullets and prioritize the last 2 roles that match the target job.",
    severity: "low",
  },
];

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

  const hasScore = typeof analysisResult?.score === "number";
  const score = hasScore ? Math.round(analysisResult.score) : 0;
  const missingSkills = analysisResult?.missingSkills?.length
    ? analysisResult.missingSkills
    : DEMO_MISSING_SKILLS;
  const suggestions = analysisResult?.suggestions?.length
    ? analysisResult.suggestions.map((s) => (typeof s === "string" ? { title: "", body: s } : s))
    : DEMO_SUGGESTIONS;
  const mistakes = analysisResult?.mistakes?.length
    ? analysisResult.mistakes
    : DEMO_MISTAKES;

  return (
    <div className="results-shell">
      <div className="results-header">
        <div className="results-label">Analysis snapshot</div>
        <h2 className="results-title">How your resume lands at a glance</h2>
      </div>

      <div className="results-grid">
        <div className="results-card results-card-score">
          <div className="score-ring" aria-label="Resume score">
            <div className="score-ring-track" />
            <div
              className="score-ring-fill"
              style={{ "--score": score }}
            />
            <div className="score-ring-center">
              <span className="score-number">
                {hasScore ? score : "--"}
              </span>
              <span className="score-label">Resume score</span>
            </div>
          </div>
          <p className="score-caption">
            {analysisResult?.rawResponse ? "From OpenRouter (OpenAI-compatible model)." : "Wire in your own API response to calculate this for real resumes."}
          </p>
        </div>

        <div className="results-card results-card-skills">
          <h3 className="results-card-title">Missing skills</h3>
          <div className="badge-row">
            {missingSkills.map((skill) => (
              <span key={skill} className="badge badge-missing">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="results-card results-card-mistakes">
          <h3 className="results-card-title">Resume mistakes</h3>
          <div className="mistake-list">
            {mistakes.map((m, idx) => (
              <article key={`${m.area}-${idx}`} className="mistake-card">
                <div className="mistake-top">
                  <span className="mistake-area">{m.area}</span>
                  <span className={`mistake-pill mistake-pill-${m.severity || "medium"}`}>
                    {m.severity || "medium"}
                  </span>
                </div>
                <div className="mistake-row">
                  <span className="mistake-label">Issue</span>
                  <p className="mistake-text">{m.issue}</p>
                </div>
                <div className="mistake-row">
                  <span className="mistake-label">Fix</span>
                  <p className="mistake-text">{m.fix}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="results-card results-card-suggestions">
          <h3 className="results-card-title">Suggestions</h3>
          <div className="suggestion-list">
            {suggestions.map((item, idx) => (
              <article key={item.title || idx} className="suggestion-card">
                {item.title ? <h4 className="suggestion-title">{item.title}</h4> : null}
                <p className="suggestion-body">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
