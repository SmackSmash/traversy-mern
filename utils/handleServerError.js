module.exports = error => {
  console.error(error);
  res.status(500).send('Internal server error');
};
