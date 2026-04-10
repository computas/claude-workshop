A new order status needs to be added to the system. Ask the user for: the status name (snake_case), which existing statuses can transition TO this new status, and which statuses this new status can transition to.

Implement all required changes:

1. **`server/data/seed.sql`** — add the new status to the `CHECK` constraint on the `orders.status` column.

2. **`server/routes/orders.js`** — add the new status and its transitions to the `validTransitions` object.

3. **`client/src/pages/AdminOrderDetail.jsx`** — add the new status to:
   - The available status options in the status update dropdown
   - The `getStatusBadgeClass` function (or equivalent) so it displays with an appropriate colour
   - Any transition logic that conditionally shows/hides actions (e.g. refund button)

4. **`client/src/pages/AdminOrders.jsx`** — add the new status to the filter dropdown and badge styling.

After implementing, remind the user to restart the server so the updated seed.sql schema takes effect.
