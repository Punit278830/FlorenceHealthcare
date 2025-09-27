export class LocalStorageUtil {
  
  /**
   * Safely parse JSON data from localStorage
   * @param key - The localStorage key
   * @param defaultValue - Default value to return if key doesn't exist or parsing fails
   * @returns Parsed object or default value
   */
  static getItem<T>(key: string, defaultValue: T = null as T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error parsing localStorage item "${key}":`, error);
      // Clear corrupted data
      localStorage.removeItem(key);
      return defaultValue;
    }
  }

  /**
   * Safely set JSON data to localStorage
   * @param key - The localStorage key
   * @param value - The value to store
   */
  static setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage item "${key}":`, error);
    }
  }

  /**
   * Remove item from localStorage
   * @param key - The localStorage key
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item "${key}":`, error);
    }
  }

  /**
   * Get user data safely
   * @returns User data object or empty object if not found
   */
  static getUserData(): any {
    return this.getItem('data', {});
  }

  /**
   * Check if user is authenticated
   * @returns boolean indicating if user is logged in
   */
  static isAuthenticated(): boolean {
    const userData = this.getUserData();
    return userData && userData.loginStatus === true;
  }
}
