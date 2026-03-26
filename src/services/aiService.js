/**
 * Calls OpenRouter to analyze resume text (proxying to an OpenAI-compatible model).
 * API key can be set either:
 * 1. In .env: VITE_OPENROUTER_API_KEY=sk-or-...
 * 2. Or paste in the "API key" field in the app (no restart needed)
 * Get a key at https://openrouter.ai/keys
 */

const SYSTEM_PROMPT = `You are an expert HR consultant and resume analyst with 15+ years of experience 
in talent acquisition across tech, finance, healthcare, and creative industries.

Your job is to analyze resumes and provide structured, actionable feedback.

When given a resume, return ONLY a valid JSON object (no markdown, no backticks) 
with this exact structure:

{
  "overall_score": <number 0-100>,
  "candidate_name": "<extracted name or 'Unknown'>",
  "target_role": "<inferred target role>",
  "summary": "<2-3 sentence executive summary of the candidate>",
  
  "scores": {
    "formatting": <0-100>,
    "content_quality": <0-100>,
    "skills_relevance": <0-100>,
    "experience_depth": <0-100>,
    "achievements": <0-100>,
    "ats_compatibility": <0-100>
  },

  "strengths": [
    "<specific strength 1>",
    "<specific strength 2>",
    "<specific strength 3>"
  ],

  "weaknesses": [
    "<specific weakness 1>",
    "<specific weakness 2>",
    "<specific weakness 3>"
  ],

  "improvements": [
    {
      "section": "<e.g. Work Experience / Skills / Summary>",
      "issue": "<what's wrong>",
      "fix": "<exact actionable fix>",
      "priority": "<High | Medium | Low>"
    }
  ],

  "keywords_found": ["<keyword1>", "<keyword2>"],
  "keywords_missing": ["<keyword1>", "<keyword2>"],

  "ats_tips": [
    "<ATS optimization tip 1>",
    "<ATS optimization tip 2>"
  ],

  "verdict": "<Shortlist | Maybe | Reject>",
  "verdict_reason": "<One sentence explanation>"
}`;

function getApiKey(passedKey) {
  const fromEnv =
    import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;
  const key = passedKey?.trim() || (typeof fromEnv === "string" && fromEnv.trim()) || "";
  if (!key) {
    throw new Error(
      "Missing OpenRouter API key. Paste your key in the field above, or add it to a .env file as VITE_OPENROUTER_API_KEY=your_key and restart the dev server. Get a key at https://openrouter.ai/keys"
    );
  }
  return key.trim();
}

export async function analyzeResume(resumeText, options = {}) {
  const API_KEY = getApiKey(options.apiKey);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "X-Title": "AI Resume Analyzer",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Analyze this resume and respond with JSON only.

Resume:
${resumeText}`,
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const msg =
      data?.error?.message ||
      response.statusText ||
      "Request to OpenRouter failed. Check your API key, model name, and usage limits.";
    if (response.status === 401 || /api key|invalid api key/i.test(msg)) {
      throw new Error(
        "Invalid OpenRouter API key. Visit https://openrouter.ai/keys, create a new key, and paste it into the field above."
      );
    }
    if (response.status === 429) {
      throw new Error(
        "OpenRouter rate limit or quota exceeded. Try again later or check your usage limits."
      );
    }
    throw new Error(msg);
  }

  if (data.error) {
    const msg = data.error.message || "OpenRouter API returned an error";
    throw new Error(msg);
  }

  const content = data?.choices?.[0]?.message?.content;
  let parsed;
  try {
    parsed = content && JSON.parse(content);
  } catch {
    throw new Error("Unexpected response format. Make sure JSON output is enabled for the model.");
  }

  // Parse the new comprehensive response format
  const overallScore = typeof parsed?.overall_score === "number" ? parsed.overall_score : null;
  const candidateName = typeof parsed?.candidate_name === "string" ? parsed.candidate_name : "Unknown";
  const targetRole = typeof parsed?.target_role === "string" ? parsed.target_role : "Not specified";
  const summary = typeof parsed?.summary === "string" ? parsed.summary : "";

  const scores = parsed?.scores && typeof parsed.scores === "object" ? {
    formatting: typeof parsed.scores.formatting === "number" ? parsed.scores.formatting : 0,
    content_quality: typeof parsed.scores.content_quality === "number" ? parsed.scores.content_quality : 0,
    skills_relevance: typeof parsed.scores.skills_relevance === "number" ? parsed.scores.skills_relevance : 0,
    experience_depth: typeof parsed.scores.experience_depth === "number" ? parsed.scores.experience_depth : 0,
    achievements: typeof parsed.scores.achievements === "number" ? parsed.scores.achievements : 0,
    ats_compatibility: typeof parsed.scores.ats_compatibility === "number" ? parsed.scores.ats_compatibility : 0,
  } : null;

  const strengths = Array.isArray(parsed?.strengths) ? parsed.strengths : [];
  const weaknesses = Array.isArray(parsed?.weaknesses) ? parsed.weaknesses : [];

  const improvements = Array.isArray(parsed?.improvements)
    ? parsed.improvements.map((imp) => ({
        section: typeof imp?.section === "string" ? imp.section : "General",
        issue: typeof imp?.issue === "string" ? imp.issue : "",
        fix: typeof imp?.fix === "string" ? imp.fix : "",
        priority: ["High", "Medium", "Low"].includes(imp?.priority) ? imp.priority : "Medium",
      })).filter((imp) => imp.issue || imp.fix)
    : [];

  const keywordsFound = Array.isArray(parsed?.keywords_found) ? parsed.keywords_found : [];
  const keywordsMissing = Array.isArray(parsed?.keywords_missing) ? parsed.keywords_missing : [];

  const atsTips = Array.isArray(parsed?.ats_tips) ? parsed.ats_tips : [];

  const verdict = ["Shortlist", "Maybe", "Reject"].includes(parsed?.verdict) ? parsed.verdict : "Maybe";
  const verdictReason = typeof parsed?.verdict_reason === "string" ? parsed.verdict_reason : "";

  return {
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
    rawResponse: data,
  };
}
