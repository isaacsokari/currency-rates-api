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
    let isSecure = req.secure;

    // set isSecure for heroku
    if (!isSecure && req.headers['x-forwarded-proto']) {
      isSecure = req.headers['x-forwarded-proto'].substr(0, 5) === 'https';
    }

    if (isSecure) {
      next();
    } else {
      // for only get requests
      if (req.method === 'GET' || req.method === 'HEAD') {
        res.redirect(301, `https://${req.headers.host}${req.url}`);
      } else {
        res
          .status(403)
          .send('Please use https when submitting to this server.');
      }
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
