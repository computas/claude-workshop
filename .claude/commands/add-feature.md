# Add Feature

Follow these steps to implement a new feature end-to-end, consistent with the project conventions in CLAUDE.md.

## Steps

1. **Read CLAUDE.md** to understand the architecture and conventions before writing any code.

2. **Add types** (if the feature introduces new data shapes):
   - Edit `shared/src/types.ts` to add new interfaces or extend existing ones
   - Run `npm run build -w shared` to compile before other workspaces can use the new types

3. **Add backend service method** in `backend/src/services/`:
   - Business logic lives here, not in routes
   - Use `getDatabase()` for all DB access
   - Follow the same function signature style as existing services

4. **Add backend route** in `backend/src/routes/`:
   - Routes are thin: validate input, call service, return JSON
   - Wrap async handlers if needed, or use `next(err)` for error propagation
   - Mount new router in `backend/src/routes/index.ts` if adding a new route file

5. **Add API client function** in `frontend/src/api/`:
   - Use `apiFetch` from `./client`
   - Match the method and path of the new backend route

6. **Add React hook** in `frontend/src/hooks/` (if the feature needs data fetching):
   - Follow the `useProducts` / `useProduct` pattern
   - Expose `{ data, loading, error, refetch }`

7. **Add React component** in `frontend/src/components/`:
   - Organize by domain: `products/`, `cart/`, `checkout/`, `admin/`
   - Add `data-testid` attributes to interactive elements

8. **Add or update a page** in `frontend/src/pages/` if needed.

9. **Write unit tests**:
   - Backend service: `backend/tests/services/<featureName>.test.ts`
   - Frontend component: `frontend/tests/components/<ComponentName>.test.tsx`
   - Follow the patterns in `/write-test`

10. **Verify everything works**:
    ```
    npm run typecheck
    npm run test
    npm run lint
    ```