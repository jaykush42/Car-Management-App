const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;



mongoose.connect(mongoUri).then(()=>console.log("connected DB"));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

app.listen(port, () => console.log('Server is running on port 5000'));
