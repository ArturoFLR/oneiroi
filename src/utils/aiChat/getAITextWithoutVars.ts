export default function getAITextWithoutVars(text: string): string {
  const variablesFirstIndex = text.indexOf("*");

  // Si hay "*", extraemos el texto antes de las variables
  if (variablesFirstIndex !== -1) {
    return text.substring(0, variablesFirstIndex).trim();
  }

  // Si no hay "*", devolvemos el texto original
  return text;
}
