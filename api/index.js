import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "API OK 🚀" });
});

app.listen(4001, () => {
  console.log("API running on http://localhost:4001");
});