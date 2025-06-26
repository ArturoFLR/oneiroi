//Esta función extrae las variables (si las hay) del texto que manda la IA como respuesta. La IA está instruida para enviarlas al final entre astericos, así: *variable=valor,variable=valor...*

export default function getVarsFromAIText(
  text: string,
): Record<string, number> | null {
  // Buscamos el índice del primer "*"
  const variablesFirstIndex = text.indexOf("*");

  // Si no hay "*", devolvemos null
  if (variablesFirstIndex === -1) {
    return null;
  }

  // Extraemos la parte de la cadena que contiene las variables, sin los "*"
  const variablesStringFull = text.substring(
    variablesFirstIndex + 1,
    text.lastIndexOf("*"),
  );

  // Obtenemos un array con el formato ["clave=valor", "clave=valor"...1]
  const variablesArray = variablesStringFull.split(" ").join("").split(",");

  // Usamos reduce para construir el objeto que vamos a devolver con las variables.
  const result = variablesArray.reduce<Record<string, number>>(
    (acc, element) => {
      const [key, value] = element.split("=");

      // Validamos que el elemento tenga el formato correcto
      if (key && value) {
        acc[key] = Number(value);
      }

      return acc;
    },
    {},
  );

  return result;
}
