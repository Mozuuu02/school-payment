const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');

const app = express();
app.use(cors());
app.use(express.json());

// 

app.use('/api/auth', authRoutes);
app.use("/api/payments", require("./routes/payment"));
app.use('/api/webhook', webhookRoutes);

// DB connect & server start
mongoose.connect(process.env.MONGO_URI, {
})
.then(()=>{
  console.log('MongoDB connected');
  app.listen(process.env.PORT, ()=>console.log(`Server running on port ${process.env.PORT}`));
})
.catch(err=>console.log(err));
 