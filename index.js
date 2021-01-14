const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const { getDate } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/rates', (req, res) => {
  const { base, currency } = req.query;
  const results = {
    base,
    date: getDate(),
    rates: {
      currency,
    },
  };

  fetch(
    `https://api.exchangeratesapi.io/latest?base=${base}&symbols=${currency}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      res.json({
        results: {
          base,
          date: getDate(),
          rates: data.rates,
          error: data.error,
        },
      });
    });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
