export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = "__storage_test__";
    const testValue = "text";

    localStorage.setItem(testKey, testValue);
    const storedValue = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);

    const isLocalStorageAvailable = storedValue === testValue;
    return isLocalStorageAvailable;
  } catch {
    return false;
  }
};

export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? (JSON.parse(storedValue) as T) : null;
  } catch (error) {
    console.error(`Error al leer la key "${key}" del localStorage:`, error);
    return null;
  }
};

export const saveToLocalStorage = <T>(key: string, newValue: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(newValue));
  } catch (error) {
    console.error(
      `Error escribiendo en local storage con key: "${key}":`,
      error
    );
  }
};
