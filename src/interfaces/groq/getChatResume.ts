export async function getChatResume(textToResume: string) {
  try {
    const response = await fetch("/.netlify/functions/groq-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ textToResume }),
    });

    const data = await response.json();
    const responseText = data.summary;

    if (responseText) {
      return responseText;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching summary:", error);
    return;
  }
}
