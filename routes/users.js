const express =require('express')
const router = express.Router()

const db = require("../models")
const User = db.User

router.post('/', (req, res, next) => {
  const { email, name, password, confirmPassword} = req.body

if (!email || !password) {
  req.flash("error", "email and password are required")
  return res.redirect("back")
}

if (password != confirmPassword) {
  req.flash("error", "Password confirmation does not match.")
  return res.redirect("back")
}
  return User.count({ where: { email } })
    .then((rowCount) => {
      if (rowCount > 0) {
        req.flash("error", "Email has already been registered.");
        return res.redirect("back");
      }
      return User.create({ email, name, password });
    })
    .then((user) => {
      if (!user) {
        return res.redirect("back");
      }
      req.flash("success", "Successfully registered.");
      return res.redirect("/login");
    })
    .catch((error) => {
      error.errorMessage = "Failed to register.";
      next(error);
    });
})

module.exports = router;