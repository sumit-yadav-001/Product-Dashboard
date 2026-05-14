# 🔐 Backend API Integration Guide

## Complete Guide to Connect Your Backend API

This guide will help you integrate your backend authentication API with the frontend application.

---

## 🚀 Quick Setup

### Step 1: Update Environment Variables

Edit `Admin/.env` file:

```env
# YOUR BACKEND API URL
VITE_API_BASE_URL=http://localhost:5000/api
VITE_BACKEND_API_URL=http://localhost:5000/api

# Or for production
# VITE_API_BASE_URL=https://api.yourdomain.com/api
# VITE_BACKEND_API_URL=https://api.yourdomain.com/api
```

### Step 2: Restart Development Server

```bash
npm run dev
```

**That's it! Your backend is now connected!** 🎉

---

## 📋 Backend API Requirements

### Required Endpoints

Your backend should have these endpoints:

#### 1. **Login** ✅
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

**Alternative Response Format (also supported):**
```json
{
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "admin"
    }
  }
}
```

---

#### 2. **Register** ✅
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

#### 3. **Logout** ✅
```
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### 4. **Get Current User** (Optional)
```
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

---

#### 5. **Refresh Token** (Optional)
```
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "new_jwt_token_here",
  "refreshToken": "new_refresh_token_here"
}
```

---

#### 6. **Forgot Password** (Optional)
```
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

## 🔧 Customizing API Integration

### If Your API Has Different Response Format

Edit `Admin/src/store/api/authApi.ts`:

```typescript
// Example: If your API returns data in a different format
transformResponse: (response: any) => {
  return {
    success: true,
    message: response.message || 'Login successful',
    data: {
      user: response.data.user,  // Adjust this path
      token: response.data.token, // Adjust this path
      refreshToken: response.data.refreshToken, // Adjust this path
    },
  };
},
```

### If Your API Uses Different Endpoints

Edit `Admin/src/store/api/authApi.ts`:

```typescript
// Change endpoint URLs
login: builder.mutation({
  query: (credentials) => ({
    url: `${BACKEND_API_URL}/auth/signin`,  // Change this
    method: 'POST',
    body: credentials,
  }),
  // ...
}),
```

### If Your API Uses Different Token Header

Edit `Admin/src/store/api/apiSlice.ts`:

```typescript
prepareHeaders: (headers, { getState }) => {
  const token = (getState() as RootState).auth.accessToken;
  
  if (token) {
    // Change header format if needed
    headers.set('authorization', `Bearer ${token}`);
    // Or: headers.set('x-auth-token', token);
    // Or: headers.set('token', token);
  }
  
  return headers;
},
```

---

## 🎯 Testing Your Backend Integration

### 1. Test Login

1. Start your backend server
2. Start frontend: `npm run dev`
3. Go to: `http://localhost:3000/login`
4. Enter credentials
5. Check browser console for API calls
6. Check Network tab in DevTools

### 2. Test Registration

1. Go to: `http://localhost:3000/register`
2. Fill the form
3. Submit
4. Check if user is created in your database

### 3. Test Logout

1. Login first
2. Click user menu → Logout
3. Check if redirected to login page
4. Check if token is cleared

---

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors in console:

**Backend (Express.js):**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Backend (Node.js):**
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
```

### 401 Unauthorized

Check:
1. Token is being sent in headers
2. Token format is correct
3. Token is not expired
4. Backend is validating token correctly

### Network Error

Check:
1. Backend server is running
2. Backend URL in `.env` is correct
3. No firewall blocking requests
4. Backend port is correct

### Token Not Persisting

Check:
1. localStorage is enabled in browser
2. Token is being saved in Redux
3. Token is being loaded on app start

---

## 📊 API Response Formats Supported

The frontend automatically handles these response formats:

### Format 1 (Recommended):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token",
  "user": { ... }
}
```

### Format 2:
```json
{
  "data": {
    "token": "jwt_token",
    "user": { ... }
  }
}
```

### Format 3:
```json
{
  "accessToken": "jwt_token",
  "user": { ... }
}
```

### Error Format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "email": ["Email is required"],
    "password": ["Password is too short"]
  }
}
```

---

## 🔐 Security Best Practices

### 1. Use HTTPS in Production
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### 2. Implement Token Refresh
Your backend should:
- Issue short-lived access tokens (15 min)
- Issue long-lived refresh tokens (7 days)
- Have refresh endpoint

### 3. Validate Tokens
Backend should:
- Verify JWT signature
- Check token expiration
- Validate user exists
- Check user permissions

### 4. Secure Storage
Frontend already:
- Stores tokens in localStorage
- Clears tokens on logout
- Validates tokens before use

---

## 📝 Example Backend (Express.js)

```javascript
// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate credentials
    const user = await User.findOne({ email });
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Send response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10)
    });
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Send response
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Logout endpoint
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // Optional: Add token to blacklist
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid token'
      });
    }
    req.user = user;
    next();
  });
}
```

---

## ✅ Checklist

Before going to production:

- [ ] Backend API is deployed
- [ ] HTTPS is enabled
- [ ] CORS is configured
- [ ] Environment variables are set
- [ ] Token expiration is configured
- [ ] Error handling is implemented
- [ ] Input validation is added
- [ ] Rate limiting is enabled
- [ ] Logging is configured
- [ ] Database is secured

---

## 🎉 You're Ready!

Your authentication system is now fully integrated with your backend API!

### Next Steps:
1. Update `.env` with your backend URL
2. Test login/register/logout
3. Deploy to production
4. Monitor API calls
5. Collect user feedback

---

## 📞 Need Help?

If you face any issues:
1. Check browser console for errors
2. Check Network tab for API calls
3. Check backend logs
4. Verify environment variables
5. Test API endpoints with Postman

---

**Happy Coding! 🚀**
