# Write Test

Write a Vitest unit test for a given module, following the existing test conventions.

## Steps

1. **Find the most similar existing test** for reference:
   - Backend service tests: `backend/tests/services/`
   - Backend route tests: `backend/tests/routes/`
   - Frontend component tests: `frontend/tests/components/`
   - Frontend hook tests: `frontend/tests/hooks/`

2. **Read the existing test** to understand the pattern:
   - How is the describe/it structure organized?
   - How is the module under test imported?
   - How is test state initialized?

3. **Place the new test** at the mirror path of the source:
   - `backend/src/services/foo.ts` → `backend/tests/services/foo.test.ts`
   - `frontend/src/hooks/useBar.ts` → `frontend/tests/hooks/useBar.test.ts`
   - `frontend/src/components/Baz/Baz.tsx` → `frontend/tests/components/Baz.test.tsx`

4. **For backend service tests**:
   - Import `getDatabase` — the in-memory SQLite is seeded automatically
   - Import the service functions directly
   - Use `beforeEach` to reset state if needed (or rely on the seeded data)
   - Test return values and side effects (subsequent reads)

5. **For frontend component tests**:
   - Use `render` from `@testing-library/react`
   - Wrap in providers if the component uses context (e.g., `CartProvider`)
   - Use `screen.getByText`, `screen.getByRole`, `screen.getByTestId`
   - Use `userEvent.click` for interactions
   - Assert with `expect(...).toBeInTheDocument()` etc.

6. **For frontend hook tests**:
   - Use `renderHook(() => useMyHook())` from `@testing-library/react`
   - Wrap in `act(...)` for state updates
   - Wrap in provider wrappers if the hook uses context

7. **Run the tests** to confirm they pass:
   ```
   npm run test -w backend
   # or
   npm run test -w frontend
   ```