//Esta función calcula el tamaño de fuente apropiada según el ancho del contenedor, que habremos guardado con useRef() y pasamos como argumento.
//Cuanto mayor sea textProportion, menor será el tamaño de la fuente. 8 es un valor que da buenos resultados en general.
function calcFontSize(
  container: HTMLDivElement | null,
  textProportion: number,
) {
  const fallbackSize = "16px";

  if (container) {
    const containerWidth = container.offsetWidth;
    const computedSize = `${containerWidth / textProportion}px`;

    return computedSize;
  } else {
    return fallbackSize;
  }
}

export default calcFontSize;
