# LEGO Shop - Course Example Application

A full-stack LEGO shopping website built as a course example application. This project demonstrates modern web development practices with a React frontend, Express.js backend, and SQLite database.

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Express.js
- **Database**: SQLite
- **Logging**: Winston
- **Styling**: CSS3
- **Package Manager**: npm

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher

## Quick Start

### 1. Install Root Dependencies
```bash
npm install
```

### 2. Install Server and Client Dependencies
```bash
npm run install:all
```

### 3. Start Development Servers
```bash
npm run dev
```

This command starts both the server and client in development mode using concurrent processes.

### 4. Open in Browser
Navigate to `http://localhost:5173` to view the application.

## Running Individual Services

- **Server only**: `npm run server` - Runs on http://localhost:3000
- **Client only**: `npm run client` - Runs on http://localhost:5173

## Testing

- **Run tests**: `npm test`
- **Watch mode**: `npm run test:watch`

## Project Structure

```
lego-shop/
├── client/                 # React frontend application
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Express.js backend application
│   ├── src/
│   ├── tests/
│   └── package.json
├── package.json           # Root package configuration
└── README.md
```

## Features

- Full LEGO product catalog with images and descriptions
- Shopping cart functionality
- Checkout process with simulated payment
- Multi-language support (English, Norwegian, Italian)
- Admin section for product management
- Comprehensive logging system
- Responsive design

## API Endpoints Summary

The backend provides RESTful APIs for:
- Product listing and search
- Cart management
- Order processing
- User preferences
- Admin operations

Detailed API documentation can be found in the server directory.

## Multi-Language Support

The application supports three languages:
- **EN** - English
- **NO** - Norwegian (Norsk)
- **IT** - Italian (Italiano)

Language selection is available in the user interface.

## Admin Section

The admin section allows authorized users to:
- View and manage product inventory
- Update product information
- View order history
- Monitor system logs

Access the admin panel through the application interface.

## Logging System

The application uses Winston for comprehensive logging:
- Logs are written to `logs/` directory
- Separate files for different log levels
- Includes request logging, error tracking, and application events
- Configurable log levels for different environments

## Important Notes

This is a course example application designed for educational purposes:

- **Payment**: All payment processing is simulated. No real transactions occur.
- **Authentication**: This demo version does not require authentication. In a production environment, proper authentication and authorization would be implemented.
- **Data**: Sample product data is included in the database.

## Development

For development work:

1. The frontend and backend run simultaneously with `npm run dev`
2. Frontend changes hot-reload automatically
3. Backend may require manual restart for some changes
4. Check logs in the `logs/` directory for debugging

## License

This is a course example application.
