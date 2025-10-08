# 🏫 School Payment Backend

Backend service for the **School Payment Web Application**, built using **Node.js**, **Express**, and **MongoDB**.  
It provides authentication, payment handling, and transaction management APIs.

---

## 🚀 Tech Stack

- **Node.js** (Express)
- **MongoDB Atlas**
- **JWT Authentication**
- **CORS**
- **Render** (Backend Deployment)
- **Vercel** (Frontend Deployment)

---

## ⚙️ Setup and Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/your-repo.git
cd backend

2️⃣ Install Dependencies
npm install

3️⃣ Create a .env file in the backend root directory with the following values:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
PAYMENT_GATEWAY_KEY=your_payment_key
PAYMENT_GATEWAY_SECRET=your_payment_secret

▶️ Run the Server
Development
npm run dev

Production
npm start

🔌 API Usage Examples
👤 Authentication
POST /api/auth/register

Registers a new user.

Request Body:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}


Response:

{
  "message": "User registered successfully"
}

POST /api/auth/login

Logs in an existing user and returns a JWT token.

Request Body:

{
  "email": "john@example.com",
  "password": "123456"
}


Response:

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}

💳 Payments
POST /api/payments/initiate

Creates a new payment order.

Request Body:

{
  "amount": 5000,
  "userId": "6704b3c5b8ef56...",
  "callback_url": "https://school-payment-rho.vercel.app/payment-callback"
}


Response:

{
  "orderId": "order_EO4U...",
  "amount": 5000,
  "currency": "INR"
}

📜 Transactions
GET /api/payments/history/:userId

Fetches payment history for a given user.

Response:

[
  {
    "transactionId": "txn_12345",
    "amount": 5000,
    "status": "success",
    "createdAt": "2025-10-08T10:20:30.000Z"
  }
]

🧠 Notes

Ensure .env is added to .gitignore and never pushed to GitHub.

Add all environment variables manually when deploying to Render.

Make sure CORS is properly configured to allow:

http://localhost:5173

https://school-payment-rho.vercel.app

Test all endpoints using Postman before deploying the frontend.

☁️ Deployment on Render

Log in to Render

Create a New Web Service

Connect your GitHub repository

Set:

Root Directory: /backend (if using monorepo)

Build Command: npm install

Start Command: npm start

Add environment variables in Settings → Environment

Click Deploy

Your backend will be live at:
👉 https://school-payment-pzht.onrender.com

🧪 Postman Testing

You can use Postman to test these routes:

Endpoint	Method	Description
/api/auth/register	POST	Register a new user
/api/auth/login	POST	Login user
/api/payments/initiate	POST	Create a payment order
/api/payments/history/:userId	GET	Fetch user’s payment history
📄 License

This project is open source under the MIT License
.

👨‍💻 Author

Mozammil Khan
GitHub: @Mozuuu02
Email: mozammilk1203@gmail.com
