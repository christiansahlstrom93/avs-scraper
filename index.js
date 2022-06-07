const express = require("express");
const { startScrape, contentCache } = require("./scraper/index.js");

const app = express();

app.get("/", (req, res) => {
  res.send("ping");
});

app.get("/latest", async (req, res) => {
  res.send(contentCache);
});

startScrape();

setInterval(async () => {
  await startScrape();
}, 1000 * 60 * 60);

app.listen(process.env.PORT || 3005);
