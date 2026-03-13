export async function analyzeResume(resumeText) {
    const response= await fetch(
        AIzaSyCaACt11xq7lrX2314oijdXmcTy9lquNJ4,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: resumeText
            })
        });

        const data = await response.json();

        return data;
}