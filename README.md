# Cashflow Forecasting App

A professional full-stack web application for tracking retailer sales, payroll, overheads, and generating cashflow forecasts.

## Features

- 🔐 **User Authentication** - Secure login/registration
- 💰 **Project Management** - Track retailer projects with revenue and expenses
- 👥 **Payroll Tracking** - Manage employee payments
- 💳 **Overhead Management** - Track business expenses
- 📊 **Dashboard** - Real-time financial insights
- ⚠️ **Payment Reminders** - Automatic due date alerts
- 📈 **Project Timeline** - Visual milestone tracking
- 📄 **PDF Export** - Generate detailed project reports
- 🎯 **Profit Analysis** - Detailed expense breakdowns
- ☁️ **Cloud Database** - Data synced across devices

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (free)
- Git

### Local Setup (5 minutes)

1. **Clone/Download this folder**

2. **Set up Backend**
   ```bash
   cd cashflow-app
   npm install
   ```

3. **Create `.env` file** in cashflow-app folder:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cashflow-db?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

4. **Set up Frontend**
   ```bash
   cd client
   npm install
   ```

5. **Run Backend** (Terminal 1)
   ```bash
   cd .. (go back to cashflow-app)
   npm run dev
   ```

6. **Run Frontend** (Terminal 2)
   ```bash
   cd client
   npm start
   ```

App opens at `http://localhost:3000`

---

## Get MongoDB (Free)

1. Go to **mongodb.com**
2. Click "Sign Up"
3. Create cluster (choose AWS, US)
4. Click "Connect" → "Drivers"
5. Copy connection string
6. Paste in `.env` file (replace username and password)

---

## Deploy to Production (Free)

### Option 1: Vercel + Render (Recommended)

**Backend (Render):**
1. Go to render.com
2. New Web Service
3. Connect GitHub repo
4. Set PORT=5000
5. Add MONGODB_URI and JWT_SECRET
6. Deploy!

**Frontend (Vercel):**
1. Go to vercel.com
2. Import GitHub repo
3. Set root directory to `client/`
4. Deploy!

### Option 2: Heroku (Older but works)

```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your-uri
git push heroku main
```

---

## Project Structure

```
cashflow-app/
├── server.js              # Main server
├── models/                # Database models
├── routes/                # API endpoints
├── middleware/            # Authentication
├── config/                # Database config
└── client/                # React frontend
```

---

## API Routes

**Auth:**
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

**Retailers:**
- GET/POST `/api/retailers`
- PUT/DELETE `/api/retailers/:id`

**Payroll:**
- GET/POST `/api/payroll`
- PUT/DELETE `/api/payroll/:id`

**Overheads:**
- GET/POST `/api/overheads`
- PUT/DELETE `/api/overheads/:id`

---

## Technology Stack

**Backend:**
- Node.js + Express
- MongoDB (Atlas)
- JWT Authentication
- CORS

**Frontend:**
- React 18
- Tailwind CSS
- Axios
- React Router

---

## Support

See `DEPLOYMENT_GUIDE.md` for detailed instructions on:
- Local development
- Database setup
- Production deployment
- Troubleshooting

---

## License

MIT - Feel free to use and modify

---

## Next Steps

1. ✅ Set up MongoDB free account
2. ✅ Create `.env` file
3. ✅ Install dependencies
4. ✅ Run locally
5. ✅ Test all features
6. ✅ Deploy to production

**Questions?** Check DEPLOYMENT_GUIDE.md for detailed setup instructions.
