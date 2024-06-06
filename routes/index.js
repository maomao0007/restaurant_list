// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")

const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");

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
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return done(null, false, { message: "Incorrect email or password."});
          }
          return done(null, user);
        })
      })
      .catch((error) => {
        error.errorMessage = "登入失敗";
        done(error);
      });
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "displayName"],
    }, (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value
      const name = profile.displayName
      
      return User.findOne({
      attributes: ["id", "name", "email", "password"],
      where: { email },
      raw: true,
    })
      .then((user) => {
        if (user) return done(null, user)
        
        const randomPwd = Math.random().toString(36).slice(-8)

        return bcrypt.harsh(randomPwd, 10)
          .then((hash) => User.create({ name, email, password:hash }))

          .then((user) => done(null, { id: user.id, name; user.name, email: user.email }))
      })
      .catch((error) => {
        error.errorMessage = "Failed to login.";
        done(error);
      });
  })
);

router.get("/login/facebook", passport.authenticate("facebook", { scope: ["email"]}))
router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', { 
  successRedirect: '/Restaurant-List',
  failureRedirect: 'login',
  failureFlash: true
}))

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
