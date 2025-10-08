# 🎓 School Payment Frontend

Frontend for the **School Payment Web Application**, built using **React (Vite)**.  
It provides an intuitive interface for students and administrators to manage school fee payments, track transactions, and view receipts — all connected to a secure **Node.js + Express** backend.

---

![Transaction History](https://github.com/Mozuuu02/school-payment/blob/main/school-payments-frontend/src/assets/screenshots/history.png?raw=true)

## 🚀 Tech Stack

- **React (Vite)**
- **Axios** (API handling)
- **React Router DOM**
- **Tailwind CSS**
- **Vercel** (Frontend Deployment)
- **Render** (Backend Deployment)

---

## ⚙️ Project Setup Instructions


```bash
1️⃣ Clone the Repository
git clone https://github.com/Mozuuu02/school-payment.git
cd school-payments-frontend

2️⃣ Install Dependencies
npm install

3️⃣ Create a .env File
In your project root, create a .env file and add:

VITE_API_URL=https://school-payment-pzht.onrender.com
VITE_BASE_URL=http://localhost:5173
Note:

Environment variables in Vite must start with VITE_.

Do not include the .env file in GitHub (make sure it’s in .gitignore).

4️⃣ Run the App Locally
npm run dev
App will run at 👉 http://localhost:5173

🧠 Page Documentation

🔐 Login Page (/)

Allows existing users to log in using email & password.

Sends a POST request to /api/auth/login.

On success → redirects to Dashboard and stores JWT in local storage.

🧾 Register Page (/register)

Creates a new user account via /api/auth/register.

Validates input before sending data to the backend.

Displays success/error messages from the server.

💳 Payment Page (/payments)

Displays fee payment options and integrates with payment gateway.

Sends payment request to /api/payments/initiate.

Uses callback_url → ${import.meta.env.VITE_BASE_URL}/payment-callback.

🔁 Payment Callback (/payment-callback)

Handles payment response after transaction completion.

Updates backend with transaction status.

Shows success/failure UI message to user.


☁️ Deployment on Vercel

Go to Vercel

Import your GitHub repository

Set Environment Variables under Project Settings → Environment Variables:

VITE_API_URL=https://school-payment-pzht.onrender.com

VITE_BASE_URL=https://school-payment-rho.vercel.app

Click Deploy

Your app will be live at:
👉 https://school-payment-rho.vercel.app

🧪 Testing Checklist

✅ Register a new user
✅ Login and receive JWT token
✅ Initiate a payment
✅ Verify callback updates backend
✅ View transaction history
✅ Confirm CORS works between frontend (Vercel) & backend (Render)


📄 License

This project is open-source under the MIT License
.

👨‍💻 Author

Mozammil Khan
GitHub: @Mozuuu02

Email: mozammilk120@gmail.com