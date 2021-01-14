const getDate = () => {
  const date = new Date();
  const day = date.getDate(),
    month = 1 + date.getMonth(),
    year = date.getFullYear();

  return `${year}-${month < 10 ? `0${month}` : month}-${day}`;
};

module.exports = { getDate };
