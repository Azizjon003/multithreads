const express = require("express");
const { Worker } = require("node:worker_threads");
const app = express();

const WORKERS_COUNT = 4;
function runWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./five-workers.js", {
      workerData: { count: WORKERS_COUNT },
    });

    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (error) => {
      reject(error);
    });
  });
}
app.get("/non-blocking", (req, res) => {
  res.send("Hello World");
});

app.get("/blocking", async (req, res) => {
  const workerPromises = [];
  for (let i = 0; i < WORKERS_COUNT; i++) {
    workerPromises.push(runWorker());
  }
  const workersResult = await Promise.all(workerPromises);
  const total = workersResult.reduce((prev, curr) => prev + curr, 0);
  res.send(`Counter: ${total}`);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
