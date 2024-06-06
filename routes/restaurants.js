const express = require("express");
const router = express.Router();

//導入資料庫模型
const db = require("../models");
const Restaurant = db.Restaurant;

// display the restaurant list and keyword function
router.get("/", (req, res, next) => {
  const keyword = req.query.search?.trim();
  const page = parseInt(req.query.page) || 1;
  const limit = 9; // 9 items per page
  const userId = req.user.id;

  let sortAttribute = req.query.sortAttribute || "name_en";
  let sortMethod = req.query.sortMethod?.toLowerCase() || "asc";
  
  // dropdown box setting
  const sortOptions = {
    name_en_asc: [["name_en", "ASC"]],
    name_en_desc: [["name_en", "DESC"]],
    category_asc: [["category", "ASC"]],
    category_desc: [["category", "DESC"]],
    location_asc: [["location", "ASC"]],
    location_desc: [["location", "DESC"]],
  };

  //根據 sortAttribute 從映射中獲取排序選項，如果找不到對應的排序選項，則默認使用 [sortAttribute, sortMethod]
  const orderOption = sortOptions[sortAttribute] || [
    [sortAttribute, sortMethod],
  ];

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
    order: orderOption, // 根據排序選項排序
    where: { userId },
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
        sortAttribute, // 傳遞排序屬性到前端
        sortMethod, // 傳遞排序方法到前端
        prev: page > 1 ? page - 1 : page, // if the current page > 1 , minus 1 ; otherwise, show the current page
        next: page + 1,
        page, // the current page
      });
    })
    .catch((error) => {
      error.errorMessage = "Failed to load";
      next(error);
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
  const userId = req.user.id;

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
    userId,
  })
    .then(() => {
      req.flash("success", "Added successfully");
      res.redirect("/Restaurant-List");
    })
    .catch((error) => {
      error.errorMessage = "Failed to add";
      next(error);
    });
});

// display the details of the restaurant
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.user.id

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
      'userId'
    ],
    raw: true,
  }).then((restaurant) => {
      if (!restaurant) {  
				req.flash('error', 'Data not found') 
				return res.redirect('/Restaurant-List')
			}
			if (restaurant.userId !== userId) { 
				req.flash('error', 'Unauthorized access')
				return res.redirect('/Restaurant-List')
			}
    res.render("detail", { restaurant })
    })
    .catch((error) => {
		  error.errorMessage = 'Failed to load'
		  next(error)
	  })
});

// display the edit restaurant page
router.get("/:id/edit", (req, res) => {
  const id = req.params.id;
  const userId = req.user.id

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
      'userId'
    ],
    raw: true,
	})
		.then((restaurant) => {
			if (!restaurant) {
				req.flash('error', 'Data not found')
				return res.redirect('/Restaurant-List')
			}
			if (restaurant.userId !== userId) { 
				req.flash('error', 'Unauthorized access')
				return res.redirect('/Restaurant-List')
			}
     res.render("edit", { restaurant })
    })
    .catch((error) => {
      error.errorMessage = "Failed to load";
      next(error);
    });
});

// edit the restaurant
router.put("/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const userId = req.user.id

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
      'userId'
    ],
	})
		.then((restaurant) => {
			if (!restaurant) {
				req.flash('error', 'Data not found')
				return res.redirect('/Restaurant-List')
			}
			if (restaurant.userId !== userId) { 
				req.flash('error', 'Unauthorized access')
				return res.redirect('/Restaurant-List')
			}

  return restaurant.update(body)
    .then(() => {
      req.flash("success", "Edited successfully");
      res.redirect(`/Restaurant-List/${id}`);
    })
    .catch((error) => {
      error.errorMessage = "Failed to edit";
      next(error);
    });
});
})

// delete the restaurant
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.user.id

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
      'userId'
    ],
	})
		.then((restaurant) => {
			if (!restaurant) {
				req.flash('error', 'Data not found')
				return res.redirect('/Restaurant-List')
			}
			if (restaurant.userId !== userId) { 
				req.flash('error', 'Unauthorized access')
				return res.redirect('/Restaurant-List')
			}

  return restaurant.destroy()
    .then(() => {
      req.flash("success", "Deleted successfully");
      res.redirect("/Restaurant-List");
    })
    .catch((error) => {
      error.errorMessage = "Failed to edit";
      next(error);
    });
});
})

module.exports = router;