// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();
// 導入路由模組
const restaurants = require("./restaurants");
// 使用路由模組
router.use("/Restaurant-List", restaurants);

router.get("/", (req, res) => {
  res.redirect("/Restaurant-List");
});

// 匯出路由器
module.exports = router;
