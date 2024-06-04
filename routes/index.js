// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();

const passport = require("passport");
const LocalStrategy = require("passport-local");

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

passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    return User.findOne({
      attributes: ["id", "name", "email", "password"],
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        if (!user || user.password !== password) {
          return done(null, false, { message: "email 或密碼錯誤" });
        }
        return done(null, user);
      })
      .catch((error) => {
        error.errorMessage = "登入失敗";
        done(error);
      });
  })
);

passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  return done(null, { id, name, email });
});

passport.deserializeUser((user, done) => {
  done(null, { id: user.id });
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
