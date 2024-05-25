const express = require("express");
const router = express.Router();

//導入資料庫模型
const db = require("../models");
const Restaurant = db.Restaurant;

// display the restaurant list and keyword function
router.get("/", (req, res) => {
  const keyword = req.query.search?.trim();
  // 使用 findAll 方法從資料庫中查詢所有餐廳
  return Restaurant.findAll({
    attributes: [
      "id",
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
    ],
    raw: true,
  })
    .then((restaurants) => {
      // 如果有關鍵字，則過濾匹配的餐廳
      const matchedRestaurants = keyword
        ? restaurants.filter((restaurant) =>
            Object.values(restaurant).some((property) => {
              if (typeof property === "string") {
                return property.toLowerCase().includes(keyword.toLowerCase());
              }
              return false;
            })
          )
        : restaurants;

      res.render("index", {
        restaurants: matchedRestaurants,
        keyword: keyword,
        message: req.flash("success"),
        error: req.flash("error"),
      });
    })
    .catch((err) => {
      console.error("Error fetching restaurants:", err);
      res.status(500).send("Error fetching restaurants");
    });
});

// display the add restaurant page
router.get("/new", (req, res) => {
  res.render("new", {error: req.flash("error")})
});

// add a new restaurant
router.post("/", (req, res) => {
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body;

  return Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  })
    .then(() => {
      req.flash("success", "Added successfully");
      res.redirect("/Restaurant-List");
    })
    .catch((error) => {
      console.error(error);
      req.flash("error", "Failed to add")
      return res.redirect("back")
    })
});

// display the details of the restaurant
router.get("/:id", (req, res) => {
  const id = req.params.id;

  return Restaurant.findByPk(id, {
    attributes: [
      "id",
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
    ],
    raw: true,
  }).then((restaurant) => res.render("detail", { restaurant, message: req.flash("success") }));
});

// display the edit restaurant page
router.get("/:id/edit", (req, res) => {
  const id = req.params.id;
  return Restaurant.findByPk(id, {
    attributes: [
      "id",
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
    ],
    raw: true,
  })
    .then((restaurant) => res.render("edit", { restaurant, error: req.flash("error") }))
    .catch((err) => console.log(err));
});

// edit the restaurant
router.put("/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;
  return Restaurant.update(body, { where: { id } })
    .then(() => {
      req.flash("success", "Edited successfully");
      res.redirect(`/Restaurant-List/${id}`)
    })
    .catch((error) => {
      console.error(error);
      req.flash("error", "Failed to edit");
      return res.redirect("back");
    });
});

// delete the restaurant
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.destroy({ where: { id } })
  .then(() => {
    req.flash("success", "Deleted successfully")
    res.redirect("/Restaurant-List")
  })
  .catch((error) => {
      console.error(error);
      req.flash("error", "Failed to delete");
      return res.redirect("back");
    });
});

module.exports = router;