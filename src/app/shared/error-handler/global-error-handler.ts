import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Check if it's a localStorage/JSON parsing error
    if (error && error.message && error.message.includes('Unexpected end of JSON input')) {
      console.warn('JSON parsing error detected, clearing localStorage data');
      // Clear potentially corrupted localStorage data
      localStorage.removeItem('data');
      localStorage.removeItem('currentStaffId');
      localStorage.removeItem('currentHospitalId');
      
      // Redirect to login
      window.location.href = '/login';
      return;
    }
    
    // For other errors, use the default behavior
    console.error('Global error:', error);
  }
}
