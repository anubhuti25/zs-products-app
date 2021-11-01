const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const productsRoutes = require('./routes/products');

const app = express();

mongoose.connect("mongodb+srv://"+ process.env.DB_USER +":" + process.env.DB_PASSWORD + "@cluster0.vfm1t.mongodb.net/dravya-app?retryWrites=true&w=majority")
.then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log(error);
    console.log("Connection failed!");
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, 'images')));
app.use("/", express.static(path.join(__dirname, 'angular')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/products', productsRoutes);
app.use('/api/user', userRoutes);

app.use('', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'angular', 'index.html'));
});

module.exports = app;
