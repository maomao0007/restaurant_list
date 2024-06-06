// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();
const passport = require("passport");

// 導入路由模組
const restaurants = require("./restaurants");
const users = require("./users");

const authHandler = require("../middlewares/auth-handler");
// 使用路由模組
router.use("/Restaurant-List", authHandler, restaurants);
router.use("/users", users);

router.get("/", (req, res) => {
  res.redirect("/Restaurant-List");
});


router.get("/register", (req, res) => {
  return res.render("register");
});

router.get("/login", (req, res) => {
  return res.render("login")
})

router.post("/register", (req, res) => {
  return res.send(req.body);
});

router.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/Restaurant-List",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      next(error);
    }

    return res.redirect("/login");
  });
});

// 匯出路由器
module.exports = router;
