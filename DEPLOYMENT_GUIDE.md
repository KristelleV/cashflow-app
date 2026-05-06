# Cashflow Forecasting App - Deployment Guide

## Project Structure

```
cashflow-app/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js              # User model with auth
│   ├── Retailer.js          # Retailer projects
│   ├── Payroll.js           # Payroll entries
│   └── Overhead.js          # Overhead expenses
├── routes/
│   ├── auth.js              # Auth endpoints
│   ├── retailers.js         # Retailer endpoints
│   ├── payroll.js           # Payroll endpoints
│   └── overheads.js         # Overhead endpoints
├── middleware/
│   └── auth.js              # JWT authentication
├── server.js                # Main server file
├── package.json             # Backend dependencies
└── client/                  # React frontend
    └── package.json         # Frontend dependencies
```

## Prerequisites

1. **Node.js** - Download from nodejs.org
2. **MongoDB** - Create free account at mongodb.com
3. **Git** - For version control
4. **Vercel or Heroku account** - For hosting

## Local Development Setup

### 1. Backend Setup

```bash
cd cashflow-app
npm install
```

### 2. Environment Variables

Create `.env` file in root:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cashflow-db?retryWrites=true&w=majority
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd client
npm install
```

### 4. Run Locally

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

The app will run at `http://localhost:3000`

---

## Database Setup (MongoDB Atlas)

1. Go to **mongodb.com** → Sign up
2. Create free cluster (AWS recommended)
3. Click "Connect" → "Drivers"
4. Copy connection string
5. Replace in `.env` with your username/password
6. Create database named `cashflow-db`
7. Create these collections:
   - `users`
   - `retailers`
   - `payrolls`
   - `overheads`

---

## Deploy to Vercel (Easiest)

### Backend on Render (Free)

1. Go to **render.com**
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Set Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
6. Deploy!

### Frontend on Vercel

1. Go to **vercel.com**
2. Click "New Project"
3. Import GitHub repo
4. Set root directory to `client/`
5. Add environment variable:
   - `REACT_APP_API_URL=https://your-backend-url.onrender.com`
6. Deploy!

---

## Deploy to Heroku (Alternative)

### Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

### Deploy Backend

```bash
heroku create your-app-name-backend
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

### Deploy Frontend

```bash
cd client
npm run build
heroku create your-app-name-frontend
git push heroku main
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Retailers
- `GET /api/retailers` - Get all projects
- `POST /api/retailers` - Create project
- `PUT /api/retailers/:id` - Update project
- `DELETE /api/retailers/:id` - Delete project
- `GET /api/retailers/stats/dashboard` - Get stats

### Payroll
- `GET /api/payroll` - Get all payroll
- `POST /api/payroll` - Create entry
- `PUT /api/payroll/:id` - Update entry
- `DELETE /api/payroll/:id` - Delete entry

### Overheads
- `GET /api/overheads` - Get all overheads
- `POST /api/overheads` - Create entry
- `PUT /api/overheads/:id` - Update entry
- `DELETE /api/overheads/:id` - Delete entry

---

## Features Included

✅ User authentication (register/login)
✅ Retailer project management
✅ Payroll tracking
✅ Overhead management
✅ Payment status indicators
✅ Payment due reminders
✅ Project timeline
✅ PDF export reports
✅ Dashboard with stats
✅ Responsive design
✅ Data persistence (MongoDB)

---

## Troubleshooting

**MongoDB Connection Error**
- Check connection string in `.env`
- Ensure IP is whitelisted in MongoDB Atlas
- Verify username/password are correct

**Frontend Can't Connect to Backend**
- Update `REACT_APP_API_URL` in frontend `.env`
- Check CORS settings in `server.js`
- Ensure backend is running on correct port

**Port Already in Use**
- Change PORT in `.env` (e.g., PORT=5001)
- Or kill process: `lsof -ti:5000 | xargs kill -9`

---

## Next Steps

1. Set up MongoDB Atlas account
2. Create `.env` file with credentials
3. Run `npm install` in both directories
4. Test locally with `npm run dev` (backend) and `npm start` (client)
5. Deploy to Vercel/Render when ready

For any issues, check server logs or browser console for errors.
