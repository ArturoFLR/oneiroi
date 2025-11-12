// Esta función procesa las respuestas de la IA. Devuelve los diálogos separados de las acciones entre paréntesis y les asigna un color de texto diferente. Sólo puede haber una acción en cada texto, pero no sabemos su posición.

export type splitDialoguesAndActionsReturn = {
  text: string;
  color: string;
};

const splitDialoguesAndActions = (
  fullText: string,
  dialogueColor: string,
  actionColor: string
) => {
  // Primero, comprobamos si hay acciones entre paréntesis.
  const actionStartIndex = fullText.indexOf("(");

  // Si no hay acciones, devolvemos el texto completo como diálogo.
  if (actionStartIndex === -1) {
    return [
      {
        text: fullText,
        color: dialogueColor,
      },
    ];
  } else {
    const actionEndIndex = fullText.indexOf(")");

    if (actionStartIndex === 0) {
      return [
        {
          text: fullText.substring(0, actionEndIndex + 1),
          color: actionColor,
        },
        {
          text: fullText.substring(actionEndIndex + 1).trim(),
          color: dialogueColor,
        },
      ];
    } else if (actionEndIndex === fullText.length - 1) {
      return [
        {
          text: fullText.substring(0, actionStartIndex).trim(),
          color: dialogueColor,
        },
        {
          text: fullText.substring(actionStartIndex).trim(),
          color: actionColor,
        },
      ];
    } else {
      return [
        {
          text: fullText.substring(0, actionStartIndex).trim(),
          color: dialogueColor,
        },
        {
          text: fullText.substring(actionStartIndex, actionEndIndex + 1).trim(),
          color: actionColor,
        },
        {
          text: fullText.substring(actionEndIndex + 1).trim(),
          color: dialogueColor,
        },
      ];
    }
  }
};

export default splitDialoguesAndActions;
