import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

router.get("/technical", (req, res) => {
  const logPath = path.join(process.cwd(), "logs", "technical.log");
  if (!fs.existsSync(logPath)) return res.json([]);
  const content = fs.readFileSync(logPath, "utf-8");
  const logs = content.split("\n").filter(Boolean).map(line => JSON.parse(line));
  res.json(logs);
});

router.get("/business", (req, res) => {
  const logPath = path.join(process.cwd(), "logs", "business.log");
  if (!fs.existsSync(logPath)) return res.json([]);
  const content = fs.readFileSync(logPath, "utf-8");
  const logs = content.split("\n").filter(Boolean);
  res.json(logs);
});

router.get("/order/:id", (req, res) => {
  const orderId = req.params.id;
  const businessLogPath = path.join(process.cwd(), "logs", "business.log");
  const technicalLogPath = path.join(process.cwd(), "logs", "technical.log");

  let businessLogs: any[] = [];
  if (fs.existsSync(businessLogPath)) {
    const content = fs.readFileSync(businessLogPath, "utf-8");
    businessLogs = content.split("\n")
      .filter(line => line.includes(`[Order: ${orderId}]`))
      .map(line => ({ type: "business", message: line }));
  }

  let technicalLogs: any[] = [];
  if (fs.existsSync(technicalLogPath)) {
    const content = fs.readFileSync(technicalLogPath, "utf-8");
    technicalLogs = content.split("\n")
      .filter(Boolean)
      .map(line => JSON.parse(line))
      .filter(log => log.message && log.message.includes(`/api/orders/${orderId}`))
      .map(log => ({ type: "technical", ...log }));
  }

  const combined = [...businessLogs, ...technicalLogs].sort((a, b) => {
    const timeA = new Date(a.timestamp || a.message.split(" ")[0]).getTime();
    const timeB = new Date(b.timestamp || b.message.split(" ")[0]).getTime();
    return timeA - timeB;
  });

  res.json(combined);
});

export default router;
