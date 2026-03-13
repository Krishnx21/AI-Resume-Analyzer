
  export async function analyzeResume(resumeText) {

  console.log("Sending text to AI:", resumeText.slice(0,200));

  const API_KEY = "AIzaSyCaACt11xq7lrX2314oijdXmcTy9lquNJ4";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
Analyze this resume and provide:

1. Resume score out of 100
2. Missing skills
3. Improvement suggestions

Resume:
${resumeText}
`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();

  console.log("Raw AI Response:", data);

  return data;
}