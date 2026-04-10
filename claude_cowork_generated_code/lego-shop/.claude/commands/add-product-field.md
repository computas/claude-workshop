A new field needs to be added to the product model. The field name and type will be specified by the user — ask for them if not already provided.

Walk through and implement all the required changes in order:

1. **`server/data/seed.sql`** — add the column to the `CREATE TABLE products` statement with an appropriate default value.

2. **`server/routes/products.js`** — add the field to:
   - The destructuring in `POST /` (create)
   - The `INSERT INTO` statement and its values
   - The destructuring in `PUT /:id` (update)
   - The `UPDATE SET` statement

3. **`client/src/pages/AdminProducts.jsx`** — add the field to:
   - The `formData` initial state
   - The form JSX (label + input)

4. **`client/src/pages/ProductDetail.jsx`** — display the new field in the product detail view if it is customer-facing.

5. **`client/src/pages/ProductCatalog.jsx`** — display the field in the product card if relevant.

After making all changes, summarise what was changed and remind the user that **the server must be restarted** for the seed.sql changes to take effect (the DB is re-created from the seed file on every startup).
