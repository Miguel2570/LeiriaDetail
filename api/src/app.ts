import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware base
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "API a funcionar 🚀",
  });
});

// Example route
app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "João" },
    { id: 2, name: "Maria" },
  ]);
});

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

export default app;