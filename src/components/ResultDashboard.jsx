import React from "react";

const DEMO_SCORE = 86;
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

export function ResultDashboard({ hasAnalyzed }) {
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
              style={{ "--score": DEMO_SCORE }}
            />
            <div className="score-ring-center">
              <span className="score-number">{DEMO_SCORE}</span>
              <span className="score-label">Resume score</span>
            </div>
          </div>
          <p className="score-caption">
            Wire in your own API response to calculate this for real resumes.
          </p>
        </div>

        <div className="results-card results-card-skills">
          <h3 className="results-card-title">Missing skills</h3>
          <div className="badge-row">
            {DEMO_MISSING_SKILLS.map((skill) => (
              <span key={skill} className="badge badge-missing">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="results-card results-card-suggestions">
          <h3 className="results-card-title">Suggestions</h3>
          <div className="suggestion-list">
            {DEMO_SUGGESTIONS.map((item) => (
              <article key={item.title} className="suggestion-card">
                <h4 className="suggestion-title">{item.title}</h4>
                <p className="suggestion-body">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
