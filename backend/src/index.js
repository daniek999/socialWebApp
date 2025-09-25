require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express()
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 4000;

const listEndpoints = require('express-list-endpoints');
console.log(listEndpoints(app));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log('Server listening on', PORT));
  })
  .catch(err => {
    console.error('Error conectando MongoDB:', err.message);
  });