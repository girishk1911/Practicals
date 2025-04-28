const express = require('express');
const app = express();
const products = require('./products.json');
app.use(express.static('public'));
app.get('/api/products', (req, res) => res.json(products));
app.listen(3000, () => console.log('Server running at http://localhost:3000'));
