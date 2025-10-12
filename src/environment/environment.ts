//online DB with api hosting on local IIS
//export const api_Url="http://localhost:8082/api/";
// export const api_Url="http://localhost:5020/api/";
//local running form visual studio code and local DB
//export const api_Url ="https://localhost:44320/api/";
//below ai on dedicated servr

// Environment detection for deployment
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const api_Url = isProduction 
  ? "http://97.74.84.4/api/" 
  : "http://localhost:5020/api/";

// Debug logging
console.log('Environment detected:', isProduction ? 'Production' : 'Development');
console.log('API URL:', api_Url);

// export const api_Url="https://florenceApi.kulhadchaiwala.in/api/";
//export const api_Url = "http://localhost:5020/api/";