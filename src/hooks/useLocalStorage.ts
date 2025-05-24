import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Estado interno que sincroniza con localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Efecto que actualiza localStorage cuando la key o el valor cambian
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(
        `Error escribiendo en local storage con key: "${key}":`,
        error
      );
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
