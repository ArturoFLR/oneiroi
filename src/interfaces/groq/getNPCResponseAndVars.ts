import { AIResponseAndVars } from "../../components/aiChat/aiChatTypes";

export async function getNPCResponseAndVars(
  npcBehavior: string,
  userText: string
) {
  try {
    const response = await fetch("/.netlify/functions/groq-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ npcBehavior, userText }),
    });

    const parsedData = await response.json();

    if (
      parsedData.status === 0 ||
      parsedData.status === 500 ||
      parsedData.status === 405
    ) {
      throw new Error(parsedData.errText);
    } else if (parsedData.status === 429) {
      return parsedData.errText as string;
    } else {
      const npcResponseObj = JSON.parse(
        parsedData.npcResponse
      ) as AIResponseAndVars;
      return npcResponseObj;
    }
  } catch (error) {
    throw new Error(
      "Revise su conexión e inténtelo más tarde: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}
