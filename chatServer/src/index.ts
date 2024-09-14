import express from "express";

const app = express();
const PORT = 3001;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err);
  });
