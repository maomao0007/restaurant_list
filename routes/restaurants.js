const express = require("express");
const router = express.Router();

//導入資料庫模型
const db = require("../models");
const Restaurant = db.Restaurant;

// display the restaurant list and keyword function
router.get("/", (req, res, next) => {
  const keyword = req.query.search?.trim();
  const page = parseInt(req.query.page) || 1
  const limit = 9 // 9 items per page
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
    offset: (page - 1) * limit, // the number of skipped items
    limit,
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
        prev: page > 1 ? page - 1 : page, // if the current page > 1 , minus 1 ; otherwise, show the current page
        next: page + 1,
        page, // the current page
      });
    })
    .catch((err) => {
      console.errorMessage = "Failed to load"
      next(error)
    });
});

// display the add restaurant page
router.get("/new", (req, res) => {
  res.render("new")
});

// add a new restaurant
router.post("/", (req, res, next) => {
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
      error.errorMessage = "Failed to add"
      next(error)
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
  }).then((restaurant) => res.render("detail", { restaurant }))
    .catch((error) => {
			error.errorMessage = 'Failed to load'
			next(error)
		})
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
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((error) => {
      error.errorMessage = "Failed to load";
      next(error);
    });
});

// edit the restaurant
router.put("/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;
  return Restaurant.update(body, { where: { id } })
    .then(() => {
      req.flash("success", "Edited successfully");
      res.redirect(`/Restaurant-List/${id}`);
    })
    .catch((error) => {
      error.errorMessage = "Failed to edit";
      next(error);
    });
});

// delete the restaurant
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.destroy({ where: { id } })
    .then(() => {
      req.flash("success", "Deleted successfully");
      res.redirect("/Restaurant-List");
    })
    .catch((error) => {
      error.errorMessage = "Failed to edit";
      next(error);
    });
});

module.exports = router;