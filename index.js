const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const { getDate } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// redirect to https on production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.protocol == 'https') {
      next();
    } else {
      res.redirect(`https://${req.headers.host}${req.url}`);
    }
  });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/api/rates', (req, res) => {
  const { base, currency } = req.query;

  try {
    fetch(
      `https://api.exchangeratesapi.io/latest?base=${base}&symbols=${currency}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          res.status(400);
          res.json({ error: data.error });
        }
        res.status(200);
        res.json({
          results: {
            base,
            date: getDate(),
            rates: data.rates,
          },
        });
      });
  } catch (error) {
    res.status(500);
    res.json({ error });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
