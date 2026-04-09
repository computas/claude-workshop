import { Router } from "express";
import { db } from "../db/index.js";

const router = Router();

router.get("/", (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  let query = "SELECT * FROM products WHERE 1=1";
  const params: any[] = [];

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }
  if (minPrice) {
    query += " AND price >= ?";
    params.push(minPrice);
  }
  if (maxPrice) {
    query += " AND price <= ?";
    params.push(maxPrice);
  }

  const products = db.prepare(query).all(...params);
  res.json(products);
});

router.get("/categories", (req, res) => {
  const categories = db.prepare("SELECT DISTINCT category FROM products").all();
  res.json(categories.map((c: any) => c.category));
});

router.get("/:id", (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

export default router;
