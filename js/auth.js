// // Example backend middleware for token validation
// // This should be implemented on your backend server

// // Express.js middleware example
// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

//   if (!token) {
//     return res.status(401).json({ 
//       message: 'Access token is required' 
//     });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ 
//         message: 'Invalid or expired token' 
//       });
//     }
    
//     req.user = user;
//     next();
//   });
// };

// // Protected route example
// app.post('/api/v1/places', authenticateToken, async (req, res) => {
//   try {
//     // Only authenticated users can create places
//     const { name, description, imageUrls, ...otherData } = req.body;
    
//     // Add user ID to the place data
//     const placeData = {
//       ...req.body,
//       createdBy: req.user.id,
//       createdAt: new Date()
//     };
    
//     // Save to database
//     const newPlace = await Place.create(placeData);
    
//     res.status(201).json({
//       success: true,
//       data: newPlace
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// // File upload should also be protected
// app.post('/api/v1/upload/multiple', authenticateToken, uploadMiddleware, (req, res) => {
//   try {
//     const urls = req.files.map(file => ({
//       uri: `${process.env.BASE_URL}/images/${file.filename}`
//     }));
    
//     res.json({ urls });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Token refresh endpoint
// app.post('/api/v1/auth/refresh', async (req, res) => {
//   const { refreshToken } = req.body;
  
//   if (!refreshToken) {
//     return res.status(401).json({ message: 'Refresh token is required' });
//   }
  
//   try {
//     const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
//     // Generate new access token
//     const newAccessToken = jwt.sign(
//       { id: decoded.id, username: decoded.username },
//       process.env.JWT_SECRET,
//       { expiresIn: '15m' }
//     );
    
//     res.json({
//       accessToken: newAccessToken,
//       refreshToken: refreshToken // or generate new refresh token
//     });
//   } catch (error) {
//     res.status(403).json({ message: 'Invalid refresh token' });
//   }
// });

// module.exports = { authenticateToken };






























// // auth.js - Centralized Authentication System
// class AuthManager {
//   constructor() {
//     this.API_BASE = 'https://tos-der.sokpheng.com/api/v1/auth/login';
//     this.TOKEN_KEY = 'tourism_auth_token';
//     this.USER_KEY = 'tourism_user_data';
//     this.REFRESH_TOKEN_KEY = 'tourism_refresh_token';
    
//     // Auto-refresh token before it expires
//     this.setupTokenRefresh();
//   }

//   // ==============================================================================
//   // TOKEN MANAGEMENT
//   // ==============================================================================
  
//   saveToken(token, refreshToken = null) {
//     localStorage.setItem(this.TOKEN_KEY, token);
//     if (refreshToken) {
//       localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
//     }
//   }

//   getToken() {
//     return localStorage.getItem(this.TOKEN_KEY);
//   }

//   getRefreshToken() {
//     return localStorage.getItem(this.REFRESH_TOKEN_KEY);
//   }

//   removeToken() {
//     localStorage.removeItem(this.TOKEN_KEY);
//     localStorage.removeItem(this.REFRESH_TOKEN_KEY);
//     localStorage.removeItem(this.USER_KEY);
//   }

//   // ==============================================================================
//   // USER DATA MANAGEMENT
//   // ==============================================================================
  
//   saveUserData(userData) {
//     localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
//   }

//   getUserData() {
//     const userData = localStorage.getItem(this.USER_KEY);
//     return userData ? JSON.parse(userData) : null;
//   }
  

//   isLoggedIn() {
//     const token = this.getToken();
//     const userData = this.getUserData();
//     return !!(token && userData);
//   }

//   // ==============================================================================
//   // API METHODS WITH TOKEN HANDLING
//   // ==============================================================================
  
//   async makeAuthenticatedRequest(url, options = {}) {
//     const token = this.getToken();
    
//     if (!token) {
//       throw new Error('No authentication token found. Please log in.');
//     }

//     const headers = {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//       ...options.headers
//     };

//     const config = {
//       ...options,
//       headers
//     };

//     try {
//       const response = await fetch(url, config);
      
//       // If token is expired or invalid
//       if (response.status === 401) {
//         // Try to refresh token
//         const refreshed = await this.refreshToken();
//         if (refreshed) {
//           // Retry the request with new token
//           config.headers['Authorization'] = `Bearer ${this.getToken()}`;
//           return await fetch(url, config);
//         } else {
//           // Refresh failed, redirect to login
//           this.logout();
//           throw new Error('Session expired. Please log in again.');
//         }
//       }

//       return response;
//     } catch (error) {
//       console.error('Authenticated request failed:', error);
//       throw error;
//     }
//   }

//   async refreshToken() {
//     const refreshToken = this.getRefreshToken();
//     if (!refreshToken) {
//       return false;
//     }

//     try {
//       const response = await fetch(`${this.API_BASE}/auth/refresh`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ refreshToken })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         this.saveToken(data.accessToken, data.refreshToken);
//         return true;
//       }
//     } catch (error) {
//       console.error('Token refresh failed:', error);
//     }

//     return false;
//   }

//   setupTokenRefresh() {
//     // Check token validity every 5 minutes
//     setInterval(() => {
//       if (this.isLoggedIn()) {
//         this.refreshToken().catch(console.error);
//       }
//     }, 5 * 60 * 1000);
//   }

//   // ==============================================================================
//   // AUTH METHODS
//   // ==============================================================================
  
//   async login(username, password) {
//     try {
//       const response = await fetch(`${this.API_BASE}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password })
//       });
      

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || 'Login failed');
//       }

//       const data = await response.json();
      
//       // Save authentication data
//       this.saveToken(data.accessToken || data.token, data.refreshToken);
//       this.saveUserData(data.user || data.userData || { username });

//       return { success: true, data };
//     } catch (error) {
//       console.error('Login error:', error);
//       return { success: false, message: error.message };
//     }
//   }

//   async register(userData) {
//     try {
//       const response = await fetch(`${this.API_BASE}/auth/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || 'Registration failed');
//       }

//       const data = await response.json();
//       return { success: true, data };
//     } catch (error) {
//       console.error('Registration error:', error);
//       return { success: false, message: error.message };
//     }
//   }

//   logout() {
//     this.removeToken();
//     // Redirect to home or login page
//     window.location.href = '/index.html';
//   }
  

//   // ==============================================================================
//   // PROTECTED ROUTE CHECKER
//   // ==============================================================================
  
//   requireAuth(redirectUrl = '../html/loginnnn.html') {
//     if (!this.isLoggedIn()) {
//       // Store the current page to redirect back after login
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
//       window.location.href = redirectUrl;
//       return false;
//     }
//     return true;
//   }

//   // ==============================================================================
//   // UI HELPER METHODS
//   // ==============================================================================
  
//   updateNavbar() {
//     const loginButton = document.querySelector('a[href*="loginnnn.html"]');
//     const userData = this.getUserData();
    
//     if (this.isLoggedIn() && loginButton && userData) {
//       // Replace login button with user menu
//       loginButton.innerHTML = userData.username || 'Account';
//       loginButton.href = '#';
      
//       // Add logout functionality
//       loginButton.addEventListener('click', (e) => {
//         e.preventDefault();
//         if (confirm('Are you sure you want to logout?')) {
//           this.logout();
//         }
//       });
//     }
//   }

//   showAuthStatus() {
//     if (this.isLoggedIn()) {
//       const userData = this.getUserData();
//       console.log('Logged in as:', userData.username);
//       return userData;
//     } else {
//       console.log('Not logged in');
//       return null;
//     }
//   }
// }

// // ==============================================================================
// // PAGE-SPECIFIC IMPLEMENTATIONS
// // ==============================================================================

// // Enhanced Login Form Handler
// class LoginFormHandler {
//   constructor(authManager) {
//     this.auth = authManager;
//     this.initializeLoginForm();
//   }

//   initializeLoginForm() {
//     const loginForm = document.getElementById('loginForm');
//     if (!loginForm) return;

//     loginForm.addEventListener('submit', async (e) => {
//       e.preventDefault();
      
//       const username = document.getElementById('loginUsername').value.trim();
//       const password = document.getElementById('loginPassword').value;
      
//       this.setLoading(true);
//       this.clearMessages();

//       const result = await this.auth.login(username, password);
      
//       this.setLoading(false);

//       if (result.success) {
//         this.showSuccess('Login successful! Redirecting...');
        
//         // Check if there's a redirect URL stored
//         const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
//         sessionStorage.removeItem('redirectAfterLogin');
        
//         setTimeout(() => {
//           window.location.href = redirectUrl || '/index.html';
//         }, 1500);
//       } else {
//         this.showError(result.message);
//       }
//     });
//   }

//   setLoading(isLoading) {
//     const submitBtn = document.getElementById('loginBtn');
//     if (isLoading) {
//       submitBtn.disabled = true;
//       submitBtn.textContent = 'Logging in...';
//     } else {
//       submitBtn.disabled = false;
//       submitBtn.textContent = 'ចូលគណនី';
//     }
//   }

//   clearMessages() {
//     document.querySelectorAll('.error-message, .success-message').forEach(el => {
//       el.textContent = '';
//       el.style.display = 'none';
//     });
//   } 

//   showSuccess(message) {
//     const successElement = document.getElementById('loginSuccess');
//     if (successElement) {
//       successElement.textContent = message;
//       successElement.style.display = 'block';
//     }
//   }

//   showError(message) {
//     const errorElement = document.getElementById('loginPasswordError');
//     if (errorElement) {
//       errorElement.textContent = message;
//       errorElement.style.display = 'block';
//     }
//   }
// }


// // Protected Place Creation Handler
// class PlaceCreationHandler {
//   constructor(authManager) {
//     this.auth = authManager;
//     this.API_BASE = authManager.API_BASE;
//     this.selectedFiles = [];
    
//     // Check authentication before initializing
//     if (!this.auth.requireAuth()) {
//       return; // Will redirect to login
//     }
    
//     this.initializePlaceForm();
//   }

//   initializePlaceForm() {
//     const form = document.getElementById('placeForm');
//     if (!form) return;

//     // Show logged-in user info
//     this.showUserInfo();
    
//     form.addEventListener('submit', async (e) => {
//       e.preventDefault();
//       await this.handlePlaceSubmission(e);
//     });

//     // Initialize file upload handling
//     this.initializeFileUpload();
//   }

//   showUserInfo() {
//     const userData = this.auth.getUserData();
//     if (userData) {
//       // Add user info to the page
//       const userInfoDiv = document.createElement('div');
//       userInfoDiv.innerHTML = `
//         <div class="bg-blue-100 p-4 rounded-lg mb-6">
//           <p class="text-blue-800">Logged in as: <strong>${userData.username}</strong></p>
//           <button onclick="authManager.logout()" class="text-blue-600 underline text-sm">Logout</button>
//         </div>
//       `;
//       document.querySelector('.contain').insertBefore(userInfoDiv, document.querySelector('h1').nextSibling);
//     }
//   }

//   async handlePlaceSubmission(e) {
//     const submitBtn = document.getElementById('submitBtn');
    
//     try {
//       submitBtn.disabled = true;
//       this.showStatus('Processing...', 'loading');

//       // Upload images if any
//       let imageUrls = [];
//       if (this.selectedFiles.length > 0) {
//         this.showStatus('Uploading images...', 'loading');
//         imageUrls = await this.uploadImages();
//       }

//       // Prepare place data
//       const formData = new FormData(e.target);
//       const placeData = {
//         name: formData.get('name'),
//         description: formData.get('description'),
//         openHours: formData.get('openHours'),
//         entryFee: parseFloat(formData.get('entryFee')) || 0.0,
//         imageUrls: imageUrls,
//         location: formData.get('location'),
//         latitude: formData.get('latitude'),
//         longitude: formData.get('longitude'),
//         categoryName: formData.get('categoryName'),
//       };

//       this.showStatus('Creating place...', 'loading');
      
//       // Use authenticated request
//       const response = await this.auth.makeAuthenticatedRequest(`${this.API_BASE}/places`, {
//         method: 'POST',
//         body: JSON.stringify(placeData)
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to create place: ${response.status} ${response.statusText}`);
//       }

//       const result = await response.json();
//       this.showStatus('✅ Place created successfully!', 'success');
      
//       // Reset form
//       e.target.reset();
//       this.selectedFiles = [];
//       this.clearImagePreviews();

//     } catch (error) {
//       console.error('Place creation failed:', error);
      
//       if (error.message.includes('No authentication token')) {
//         this.showStatus('❌ Please log in to create places.', 'error');
//         setTimeout(() => {
//           this.auth.requireAuth();
//         }, 2000);
//       } else {
//         this.showStatus(`❌ Error: ${error.message}`, 'error');
//       }
//     } finally {
//       submitBtn.disabled = false;
//     }
//   }

//   async uploadImages() {
//     if (this.selectedFiles.length === 0) return [];

//     const formData = new FormData();
//     this.selectedFiles.forEach(file => {
//       formData.append('files', file);
//     });

//     try {
//       // Use authenticated request for file upload
//       const response = await this.auth.makeAuthenticatedRequest(`${this.API_BASE}/upload/multiple`, {
//         method: 'POST',
//         body: formData,
//         headers: {} // Let browser set Content-Type for FormData
//       });

//       if (!response.ok) {
//         throw new Error(`Upload failed: ${response.status}`);
//       }


//       const result = await response.json();
      
//       // Handle different response structures
//       if (result.urls && Array.isArray(result.urls)) {
//         return result.urls;
//       } else if (Array.isArray(result)) {
//         return result;
//       } else if (result.data && Array.isArray(result.data)) {
//         return result.data;
//       }
      
//       return [];
//     } catch (error) {
//       console.error('Image upload error:', error);
//       throw error;
//     }
//   }

//   initializeFileUpload() {
//     const imageInput = document.getElementById('images');
//     if (imageInput) {
//       imageInput.addEventListener('change', (e) => {
//         this.selectedFiles = Array.from(e.target.files);
//         this.displayImagePreviews();
//       });
//     }
//   }

//   displayImagePreviews() {
//     const preview = document.getElementById('imagePreview');
//     if (!preview) return;

//     preview.innerHTML = '';
//     this.selectedFiles.forEach((file, index) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const div = document.createElement('div');
//         div.className = 'preview-image';
//         div.innerHTML = `
//           <img src="${e.target.result}" alt="Preview ${index + 1}">
//           <button type="button" class="remove-image" onclick="placeHandler.removeImage(${index})">×</button>
//         `;
//         preview.appendChild(div);
//       };
//       reader.readAsDataURL(file);
//     });
//   }

//   removeImage(index) {
//     this.selectedFiles.splice(index, 1);
//     this.displayImagePreviews();
//   }

//   clearImagePreviews() {
//     const preview = document.getElementById('imagePreview');
//     if (preview) preview.innerHTML = '';
//   }

//   showStatus(message, type) {
//     const statusDiv = document.getElementById('status');
//     if (statusDiv) {
//       statusDiv.innerHTML = message;
//       statusDiv.className = `status ${type}`;
//       statusDiv.style.display = 'block';
//     }
//   }
// }

// // ==============================================================================
// // GLOBAL INITIALIZATION
// // ==============================================================================

// // Initialize auth manager globally
// const authManager = new AuthManager();

// // Initialize page-specific handlers
// document.addEventListener('DOMContentLoaded', () => {
//   // Update navbar on all pages
//   authManager.updateNavbar();
  
//   // Page-specific initialization
//   if (document.getElementById('loginForm')) {
//     new LoginFormHandler(authManager);
//   }
  
//   if (document.getElementById('placeForm')) {
//     window.placeHandler = new PlaceCreationHandler(authManager);
//   }
  
//   // Global auth status (for debugging)
//   authManager.showAuthStatus();
// });

// // Export for use in other scripts
// window.authManager = authManager;



