//Esta función calcula el tamaño de fuente apropiada según el ancho del contenedor, que habremos guardado con useRef() y pasamos como argumento.
//Cuanto mayor sea textProportion, menor será el tamaño de la fuente. 8 es un valor que da buenos resultados en general.
// Por defecto nunca devuelve un tamaño inferior a 12px, por seguridad y legibiilidad, pero se puede especificar otro valor.
function calcFontSize(
  container: HTMLDivElement | null,
  textProportion: number,
  minSize: number = 12 // El tamaño mínimo que devolverá la función, en píxeles.
) {
  // Cuando no se ha detectado contenedor se devuelve este valor, por seguridad
  const fallbackSize = "16px";

  if (container) {
    const containerWidth = container.offsetWidth;
    const computedSize = containerWidth / textProportion;

    return computedSize >= minSize ? `${computedSize}px` : `${minSize}px`;
  } else {
    return fallbackSize;
  }
}

export default calcFontSize;
