import { ChatResumeReturn } from "../../components/aiChat/aiChatTypes";

export async function getChatResume(
  textToResume: string,
  NPCName: string,
  keyTopics: string
) {
  try {
    const response = await fetch("/.netlify/functions/groq-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ textToResume, NPCName, keyTopics }),
    });

    const parsedData = await response.json();

    if (
      parsedData.errCode === 0 ||
      parsedData.errCode === 500 ||
      parsedData.errCode === 405
    ) {
      throw new Error(parsedData.errText);
    } else if (parsedData.errCode === 429) {
      return parsedData.retryTime as string;
    } else if (parsedData.summary) {
      const summaryObj = {
        summary: parsedData.summary,
      };
      return summaryObj as ChatResumeReturn;
    }
  } catch (error) {
    throw new Error(
      "Revise su conexión e inténtelo más tarde: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}
