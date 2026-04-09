import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import morgan from "morgan";
import { db } from "./db/index.js";
import { setupLogger } from "./logger.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import logRoutes from "./routes/logs.js";

const { logger, technicalLogger, businessLogger } = setupLogger();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  
  // Custom morgan format for technical logs
  app.use(morgan('combined', {
    stream: {
      write: (message) => technicalLogger.info(message.trim())
    }
  }));

  // API routes
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/logs", logRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    technicalLogger.info(`Application started on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
