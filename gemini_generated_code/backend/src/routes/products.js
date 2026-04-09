const express = require('express');
const { getDb } = require('../utils/db');
const { technicalLogger } = require('../utils/logger');

const router = express.Router();

// GET /products - with filtering and sorting
router.get('/', (req, res) => {
  const db = getDb();
  const { category, sortBy, order = 'asc' } = req.query;

  let sql = 'SELECT * FROM products';
  const params = [];

  if (category) {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  if (sortBy) {
    const validSortBy = ['name', 'price', 'category'];
    if (validSortBy.includes(sortBy)) {
      sql += ` ORDER BY ${sortBy} ${order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
    }
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      technicalLogger.error('Error fetching products:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

// GET /products/:id
router.get('/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      technicalLogger.error(`Error fetching product with id ${id}:`, err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });
});

module.exports = router;
