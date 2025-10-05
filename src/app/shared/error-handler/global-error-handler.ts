import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global error caught:', error);
    
    // Check if it's a localStorage/JSON parsing error
    if (error && error.message && (
        error.message.includes('Unexpected end of JSON input') ||
        error.message.includes('Unexpected token') ||
        error.message.includes('Cannot read property') ||
        error.message.includes('localStorage')
      )) {
      console.warn('Storage or JSON parsing error detected, clearing localStorage data');
      
      try {
        // Clear potentially corrupted localStorage data
        localStorage.removeItem('data');
        localStorage.removeItem('currentStaffId');
        localStorage.removeItem('currentHospitalId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userRoleData');
        localStorage.removeItem('userPermissions');
        localStorage.removeItem('authenticated');
        
        // Show user-friendly message
        console.warn('Authentication data was corrupted and has been cleared. Redirecting to login.');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      } catch (clearError) {
        console.error('Error clearing localStorage:', clearError);
        // Force redirect anyway
        window.location.href = '/login';
      }
      return;
    }
    
    // Check for network-related errors
    if (error && (
        error.message && error.message.includes('NetworkError') ||
        error.message && error.message.includes('fetch') ||
        error.name === 'HttpErrorResponse'
      )) {
      console.warn('Network error detected:', error);
      // Don't redirect for network errors, just log them
      return;
    }
    
    // For other errors, use the default behavior
    console.error('Unhandled global error:', error);
  }
}
