---
name: add-feature
description: >
  Helps users implement new features, fix bugs, or extend existing functionality correctly and safely.
  Use this skill whenever the user wants to add something to their codebase, fix a bug, or implement
  a specific piece of functionality — whether they phrase it as "legg til", "lag", "fix", "implement",
  "add feature", "fiks", "endre", "utvid", or any similar request in Norwegian or English.
  Always use this skill when the user says /add-feature, /fix, or /implement, or describes a concrete
  change they want made to their code. Prioritize this skill even for small, seemingly simple changes —
  reading existing code first prevents mistakes.
---

# Add Feature / Fix Bug

Your job is to implement the user's requested change correctly, following the patterns already in the codebase — not your own defaults.

## The core principle

Before writing a single line, read the code. The biggest source of bugs in workshops and real projects alike is writing code that *looks* right but conflicts with how the existing system works. Reading first is not optional — it's the whole job.

## Step-by-step process

### 1. Understand the request

If the user's request is vague ("legg til login", "fix the cart", "make it faster"), ask one focused clarifying question before touching anything:
- What specific behavior should change?
- What currently happens vs. what should happen?

Don't ask multiple questions at once. Ask the most important one.

### 2. Locate the relevant code

Before implementing, find where the change belongs:
- Use `Grep` to search for relevant function names, component names, or keywords
- Use `Glob` to find the right files (e.g., `**/*.ts`, `**/api/*.ts`)
- Read the files that are directly involved

Don't guess — verify. If you're unsure where something lives, search for it.

### 3. Understand the existing patterns

Before writing code, notice:
- How are similar things done nearby? (naming conventions, error handling style, how state is managed)
- What imports are already in use?
- What types or interfaces are already defined?

Your implementation should look like it belongs — not like it was pasted from a different codebase.

### 4. Implement

Make the change. Keep it minimal:
- Only change what's needed for the request
- Don't refactor surrounding code unless it's blocking you
- Don't add features that weren't asked for
- Don't add comments explaining obvious things

If the change is larger than expected, tell the user before proceeding: "This requires touching X, Y, and Z — should I continue?"

### 5. Verify

After editing, check if the project has tests or linting configured:
- Look for `package.json` scripts (test, lint, typecheck)
- If they exist, run the relevant ones
- If tests fail, fix them before reporting success

### 6. Report what changed

End with a brief summary:
- Which files were changed
- What the change does (one sentence)
- Any side effects or things the user should know about

Example: "Added `removeFromCart` function in `cart.ts:45` and wired it to the remove button in `CartItem.tsx`. Deletes the item by ID from the cart state."

## What to avoid

- **Don't over-engineer**: A simple bug fix doesn't need a new abstraction layer
- **Don't add error handling for impossible cases**: Trust the existing system
- **Don't add console.log statements** (unless debugging is explicitly requested)
- **Don't rewrite things that work**: If only one function is broken, fix that function
- **Don't introduce new dependencies** without asking first

## When the change is unclear mid-implementation

Stop, describe what you found, and ask before continuing. "The cart state is managed in two different places — a Redux store and local component state. Which should I update?" is a good question to ask. Guessing wrong here means the user has to undo your work.

## Workshop context note

If this is being done in a learning context, you can briefly note *why* you're doing something a certain way — but keep it to one sentence. The user is here to build, not to read a lecture.
