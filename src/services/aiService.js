/**
 * Calls OpenRouter to analyze resume text (proxying to an OpenAI-compatible model).
 * API key can be set either:
 * 1. In .env: VITE_OPENROUTER_API_KEY=sk-or-...
 * 2. Or paste in the \"API key\" field in the app (no restart needed)
 * Get a key at https://openrouter.ai/keys
 */

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

  const response = await fetch("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", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "X-Title": "AI Resume Analyzer (local)",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            [
              "You are a resume analysis assistant.",
              "Return strict JSON with ONLY these keys:",
              "- score: number (0-100)",
              "- missing_skills: string[]",
              "- suggestions: string[] (actionable rewrite ideas)",
              "- mistakes: { area: string, issue: string, fix: string, severity: \"low\"|\"medium\"|\"high\" }[]",
              "Mistakes should be specific (e.g. keywords not visible, weak bullet wording, irrelevant/old experience, ATS formatting risks).",
              "Do not include any other keys. Do not wrap in markdown.",
            ].join("\n"),
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

  const score = typeof parsed?.score === "number" ? parsed.score : null;
  const missingSkills = Array.isArray(parsed?.missing_skills)
    ? parsed.missing_skills
    : [];
  const suggestions = Array.isArray(parsed?.suggestions)
    ? parsed.suggestions.map((s) => ({ title: "", body: String(s) }))
    : [];
  const mistakes = Array.isArray(parsed?.mistakes)
    ? parsed.mistakes
        .map((m) => ({
          area: typeof m?.area === "string" ? m.area : "Resume",
          issue: typeof m?.issue === "string" ? m.issue : "",
          fix: typeof m?.fix === "string" ? m.fix : "",
          severity:
            m?.severity === "low" || m?.severity === "medium" || m?.severity === "high"
              ? m.severity
              : "medium",
        }))
        .filter((m) => m.issue || m.fix)
    : [];

  return {
    score,
    missingSkills,
    suggestions,
    mistakes,
    rawResponse: data,
  };
}
