import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./Authentication/AuthenticationRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/Authentication", userRoutes);



app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "leiriadetail-api" });
});

const PORT = process.env.API_PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
export default app;