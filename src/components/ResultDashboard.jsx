import React from "react";

function StatCard({ label, value, helper }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}%</div>
      {helper && <div className="stat-helper">{helper}</div>}
    </div>
  );
}

export function ResultDashboard({ analysisResult, hasFile, isAnalyzing }) {
  if (!analysisResult) {
    return (
      <div className="empty-state">
        <h2 className="section-title">Analysis dashboard</h2>
        <p className="section-subtitle">
          {isAnalyzing
            ? "Running AI analysis on your resume. This typically takes just a few seconds."
            : hasFile
              ? "You're ready to analyze. Click “Analyze resume” to generate insights."
              : "Once you upload a resume and run the analysis, your results will appear here."}
        </p>
      </div>
    );
  }

  const {
    overallScore,
    matchScore,
    atsScore,
    readability,
    strengths,
    improvements,
    keywordsMatched,
    keywordsMissing,
    sections,
  } = analysisResult;

  return (
    <div className="stack gap-lg">
      <div>
        <h2 className="section-title">Analysis dashboard</h2>
        <p className="section-subtitle">
          Here is how your resume scores and where you can improve.
        </p>
      </div>

      <div className="stats-grid">
        <StatCard label="Overall strength" value={overallScore} />
        <StatCard label="Role match" value={matchScore} />
        <StatCard
          label="ATS friendliness"
          value={atsScore}
          helper="Formatting & keyword structure"
        />
        <StatCard
          label="Readability"
          value={readability}
          helper="Clarity & scannability"
        />
      </div>

      <div className="columns">
        <div className="card">
          <h3 className="card-title">Strengths</h3>
          <ul className="list">
            {strengths.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="card-title">Opportunities</h3>
          <ul className="list">
            {improvements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="columns">
        <div className="card">
          <h3 className="card-title">Keyword alignment</h3>
          <div className="pill-group">
            {keywordsMatched.map((kw) => (
              <span key={kw} className="pill pill-positive">
                {kw}
              </span>
            ))}
          </div>
          {keywordsMissing.length > 0 && (
            <>
              <p className="card-subtitle">Consider adding where relevant:</p>
              <div className="pill-group">
                {keywordsMissing.map((kw) => (
                  <span key={kw} className="pill pill-warning">
                    {kw}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="card">
          <h3 className="card-title">AI notes</h3>
          <div className="notes-stack">
            {sections.map((section) => (
              <div key={section.title} className="note-block">
                <div className="note-title">{section.title}</div>
                <p className="note-body">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

