const path = require('path');

const express = require('express');
const cors = require('cors');

const app = express();
// app.use(cors());

const port = 8001;

app.get('/api/products', cors(), (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'products.json'));
});

app.post('/api/test', (req, res) => {
  res.send({data: 'Success'});
});

app.listen(port, () => {
  console.log(`[products] API listening on port ${port}.`);
});
