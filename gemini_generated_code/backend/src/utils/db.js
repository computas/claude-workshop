const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { technicalLogger } = require('./logger');

const dbPath = path.join(__dirname, '../../data', 'lego_shop.db');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

let db;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        technicalLogger.error('Error connecting to database:', err.message);
        reject(err);
      } else {
        technicalLogger.info('Connected to the SQLite database.');
        db.serialize(() => {
          // Create products table
          db.run(`CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            imageUrl TEXT,
            category TEXT,
            stock INTEGER NOT NULL DEFAULT 0
          )`, (err) => {
            if (err) {
              technicalLogger.error('Error creating products table:', err.message);
              reject(err);
            } else {
              technicalLogger.info('Products table ensured.');
            }
          });

          // Create orders table
          db.run(`CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            customerName TEXT NOT NULL,
            customerEmail TEXT NOT NULL,
            shippingAddress TEXT NOT NULL,
            billingAddress TEXT NOT NULL,
            totalAmount REAL NOT NULL,
            status TEXT NOT NULL,
            orderDate TEXT NOT NULL
          )`, (err) => {
            if (err) {
              technicalLogger.error('Error creating orders table:', err.message);
              reject(err);
            } else {
              technicalLogger.info('Orders table ensured.');
            }
          });

          // Create order_items table
          db.run(`CREATE TABLE IF NOT EXISTS order_items (
            orderId TEXT NOT NULL,
            productId TEXT NOT NULL,
            productName TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            PRIMARY KEY (orderId, productId),
            FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (productId) REFERENCES products(id)
          )`, (err) => {
            if (err) {
              technicalLogger.error('Error creating order_items table:', err.message);
              reject(err);
            } else {
              technicalLogger.info('Order_items table ensured.');
              resolve();
            }
          });
        });
      }
    });
  });
}

function getDb() {
  if (!db) {
    technicalLogger.error('Database not initialized. Call initializeDatabase() first.');
    throw new Error('Database not initialized.');
  }
  return db;
}

module.exports = {
  initializeDatabase,
  getDb
};
