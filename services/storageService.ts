// This file is kept for potential future use (e.g., caching non-critical data)
// but is no longer responsible for user progress or stats persistence.

export function saveToStorage<T>(key: string, value: T): void {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error(`Error saving to localStorage for key "${key}":`, error);
    }
}

export function loadFromStorage<T>(key: string, defaultValue: T | null = null): T | null {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
            return defaultValue;
        }
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error(`Error loading from localStorage for key "${key}":`, error);
        return defaultValue;
    }
}