const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  'https://car-management-app-fronted.onrender.com',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

// Serve the Postman docs JSON
app.get('/api/docs', (req, res) => {
  const docsPath = path.join(__dirname, 'docs', 'CarManagementApp.postman_collection.json');
  res.sendFile(docsPath);
});

mongoose.connect(mongoUri).then(()=>console.log("connected DB"));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

app.listen(port, () => console.log('Server is running on port 5000'));
