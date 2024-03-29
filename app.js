const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/Restaurant-List");
});

app.get("/Restaurant-List", (req, res) => {
  res.send('listing restaurants');
});

app.get("/Restaurant-List/:id", (req, res) => {
  const id = req.params.id;
  res.send(`read restaurant list: ${id}`);
});
app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
