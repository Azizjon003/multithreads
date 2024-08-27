const express = require("express");
const { Worker } = require("node:worker_threads");
const app = express();

app.get("/non-blocking", (req, res) => {
  res.send("Hello World");
});

app.get("/blocking", (req, res) => {
  const worker = new Worker("./worker.js");

  worker.on("message", (data) => {
    res.send(`Counter: ${data}`);
  });
  worker.on("error", (error) => {
    console.log(error);
    res.send(`Counter: error`);
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
