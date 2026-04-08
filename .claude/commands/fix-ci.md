# Fix CI

Use the `gh` CLI to diagnose and fix a failing CI run on the current branch.

## Steps

1. Check the current branch and find the most recent failing CI run:
   ```
   gh run list --branch $(git branch --show-current) --limit 5
   ```

2. View the failed job logs (replace RUN_ID with the actual run id):
   ```
   gh run view RUN_ID --log-failed
   ```

3. Read the error carefully. Common failure patterns:
   - **TypeScript type error**: Look for `error TS` in the typecheck job. Find the file and line, fix the type mismatch.
   - **Lint error**: Look for ESLint rule violations. Fix the flagged code.
   - **Test failure**: Look for failing `it(...)` or `expect(...)` assertions. Read the test and the code it's testing.

4. Fix the root cause in the source file. Follow the conventions in CLAUDE.md.

5. Verify the fix locally before committing:
   - For typecheck failures: `npm run typecheck`
   - For lint failures: `npm run lint`
   - For test failures: `npm run test`

6. Commit and push the fix:
   ```
   git add <changed files>
   git commit -m "fix: <description of what was fixed>"
   git push
   ```

7. Watch the new CI run:
   ```
   gh run watch
   ```