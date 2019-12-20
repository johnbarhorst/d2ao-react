const express = require('express');
require('dotenv').config();

const { PORT } = process.env;

const app = express();


app.get('/', (req, res, next) => {
  res.send('Hello World');
});

app.listen(PORT, err => {
  console.log(`Listening on port:${PORT}`);
  if (err) {
    console.log('Error', err);
  }
});