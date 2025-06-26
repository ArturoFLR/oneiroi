import getAITextWithoutVars from "../../utils/aiChat/getAITextWithoutVars";
import getVarsFromAIText from "../../utils/aiChat/getVarsFromAIText";

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

    const data = await response.json();
    const chatCompletion = data.npcResponse;

    if (chatCompletion) {
      return {
        text: getAITextWithoutVars(chatCompletion),
        newVars: getVarsFromAIText(chatCompletion),
      };
    } else {
      return {
        text: null,
        newVars: null,
      };
    }
  } catch {
    return false;
  }
}
