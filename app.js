const express = require("express");
const app = express();
const port = 3000;
const { engine } = require("express-handlebars");
//const restaurants = require("./public/jsons/restaurant.json").results;
const methodOverride = require("method-override");

const flash = require("connect-flash");
const session = require("express-session");
// 引用路由器
const router = require("./routes");

app.use(
  session({
    secret: "ThisIsSecret",
    resave: false,
    saveUninitialized: false,
  })
);

//用於解析 POST 請求中的 URL 編碼的表單資料
app.use(express.urlencoded({ extended: true }));
//載入 method-override
app.use(methodOverride("_method"));

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

// 解析在 public 檔案裡的靜態文件目錄
app.use(express.static("public"));

app.use(flash());

app.use(router) // 將 request 導入路由器

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
