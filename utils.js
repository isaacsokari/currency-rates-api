const getDate = () => {
  const date = new Date();
  const day = date.getDate(),
    month = 1 + date.getMonth(),
    year = date.getFullYear();

  return `${year}-${month < 10 ? `0${month}` : month}-${day}`;
};

const redirectToHttps = (req, res, next) => {
  let isSecure = req.secure;

  // set isSecure for heroku
  if (!isSecure && req.headers['x-forwarded-proto']) {
    isSecure = req.headers['x-forwarded-proto'].substr(0, 5) === 'https';
  }

  // for azure
  if (!isSecure && req.headers['x-arr-ssl']) {
    isSecure = true;
  }

  if (isSecure) {
    next();
  } else {
    // for only get requests
    if (req.method === 'GET' || req.method === 'HEAD') {
      res.redirect(301, `https://${req.headers.host}${req.url}`);
    } else {
      res.status(403).send('Please use https when submitting to this server.');
    }
  }
};

module.exports = { getDate, redirectToHttps };
