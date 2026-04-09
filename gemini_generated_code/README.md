# BrickStore: Lego Shopping Example

This is a full-stack Lego shopping website example built for a course. It features a React frontend and a Node.js (Express) backend with an in-memory SQLite database.

## Project Structure

- `src/`: React frontend source code (Pages, Components, Hooks, i18n).
- `server.ts`: Express backend entry point.
- `routes/`: Backend API routes (Products, Orders, Logs).
- `db/`: Database initialization and seeding logic.
- `logger.ts`: Winston-based logging system (Technical & Business logs).

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Installation

1. Clone the repository or extract the files.
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

The application is configured as a full-stack app where the Express server serves the React frontend via Vite middleware in development.

### Development Mode

To start the full-stack application in development mode:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production Mode

1. Build the frontend:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm start
   ```
The server will serve the static files from the `dist/` directory.

## Features

- **Product Catalog:** Filter by category and price.
- **Shopping Cart:** Persistent cart using LocalStorage.
- **Checkout:** Simulated payment and order placement.
- **Admin Dashboard:** Order status management, product inventory view, and detailed log viewer.
- **Multi-language:** Supports English, Norwegian, and Italian.
- **Logging:** Separate technical and business logs stored in the `logs/` directory.

## Testing

Run the test suite (Vitest):
```bash
npm test
```
This runs both backend integration tests and frontend utility tests.
