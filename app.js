const express = require("express");
const app = express();
const port = 3000;
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");

const flash = require("connect-flash");
const session = require("express-session");
// 引用路由器
const router = require("./routes");
const messageHandler = require("./middlewares/message-handler");
const errorHandler = require("./middlewares/error-handler");

// 引用 handlebars-helpers
const helpers = require("handlebars-helpers")();

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: helpers,
  })
);
app.set("view engine", "handlebars");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

console.log("SESSION_SECRET:", process.env.SESSION_SECRET);

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

app.use(messageHandler);

app.use(router); // 將 request 導入路由器

app.use(errorHandler);

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
