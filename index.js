require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const express = require('express');
const path = require('path');
const { homeRouter } = require('./routes/home.js');
const uploadPinRouter = require('./routes/uploadPin');

const app = express();
app.use(
  cors({
    origin: 'http://localhost',
  })
);
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
  })
);

const start = async () => {
  try {
    app.listen(3002, () => {});
  } catch (e) {
    console.error(e);
  }
};
start().then(() => {
  console.log('success');
});

app.use('/', homeRouter);
app.use('/pinupload', uploadPinRouter);
