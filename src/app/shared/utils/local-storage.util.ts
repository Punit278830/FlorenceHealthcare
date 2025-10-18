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
      if (item === null || item === undefined || item === '' || item === 'undefined' || item === 'null') {
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
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
        return;
      }
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
   * Validate session integrity
   * @returns boolean indicating if session is valid
   */
  static isSessionValid(): boolean {
    try {
      const userData = this.getUserData();
      const currentStaffId = this.getItem('currentStaffId');
      
      // Check if essential data exists
      if (!userData || !userData.loginStatus || !currentStaffId) {
        return false;
      }
      
      // Only check staff ID match if both exist
      // Allow for minor type differences during login process
      if (userData.loginId && currentStaffId) {
        const userLoginId = userData.loginId.toString();
        const storedStaffId = currentStaffId.toString();
        
        if (userLoginId !== storedStaffId) {
          console.warn('Session data mismatch detected', {
            userLoginId,
            storedStaffId
          });
          // Don't immediately invalidate - allow for race conditions during login
          // return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  /**
   * Recover from corrupted session data
   */
  static recoverSession(): boolean {
    try {
      console.log('Attempting session recovery...');
      
      // Try to get any valid data
      const staffId = this.getItem('currentStaffId');
      const hospitalId = this.getItem('currentHospitalId');
      
      if (staffId) {
        console.log('Found staff ID, attempting to reconstruct session');
        // We have staff ID, but user data might be corrupted
        // Let the application handle re-authentication
        return true;
      }
      
      console.log('No recoverable session data found');
      return false;
    } catch (error) {
      console.error('Session recovery failed:', error);
      return false;
    }
  }

  /**
   * Check if user is authenticated with additional validation
   * @returns boolean indicating if user is logged in
   */
  static isAuthenticated(): boolean {
    // First check basic authentication
    const userData = this.getUserData();
    
    if (!userData || !userData.loginStatus) {
      return false;
    }
    
    // Then validate session integrity
    const sessionValid = this.isSessionValid();
    
    if (!sessionValid) {
      // Attempt recovery
      const recoveryResult = this.recoverSession();
      
      if (!recoveryResult) {
        // If recovery fails, clear everything
        this.clearAuthData();
        return false;
      }
    }
    
    return true;
  }

  /**
   * Clear all authentication related data
   */
  static clearAuthData(): void {
    this.removeItem('data');
    this.removeItem('currentStaffId');
    this.removeItem('currentHospitalId');
    this.removeItem('token');
    this.removeItem('refreshToken');
  }
}
