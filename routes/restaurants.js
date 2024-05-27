const express = require("express");
const router = express.Router();

//導入資料庫模型
const db = require("../models");
const Restaurant = db.Restaurant;

// display the restaurant list and keyword function
router.get("/", (req, res, next) => {
  const sortOption = req.query.sort || "name_asc"; // dropdown box setting
  const keyword = req.query.search?.trim();
  const page = parseInt(req.query.page) || 1;
  const limit = 9; // 9 items per page

  // 設定排序選項
  let orderOption = [];
  switch (sortOption) {
    case "name_asc":
      orderOption = [
        [db.sequelize.fn("lower", db.sequelize.col("name_en")), "ASC"],
      ];
      break;
    case "name_desc":
      orderOption = [
        [db.sequelize.fn("lower", db.sequelize.col("name_en")), "DESC"],
      ];
      break;
    case "category":
      orderOption = [["category", "ASC"]];
      break;
    case "location":
      orderOption = [["location", "ASC"]];
      break;
    default:
      orderOption = [["id", "ASC"]]; // 默認排序方式
      break;
  }

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
        sortOption, // 傳遞排序選項到前端
        sort1: sortOption === "name_asc",
        sort2: sortOption === "name_desc",
        sort3: sortOption === "category",
        sort4: sortOption === "location",
        prev: page > 1 ? page - 1 : page, // if the current page > 1 , minus 1 ; otherwise, show the current page
        next: page + 1,
        page, // the current page
      });
    })
    .catch((err) => {
      console.errorMessage = "Failed to load";
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

// router.get("Restaurant-List", (req, res) => {
//   if (!req.query.nameEn) {
//     res.redirect("/");
//   }
//   const nameEn = req.query.sort.toLowerCase(); // 將選項轉換為小寫

//   // 定義排序選項
//   let orderOption = [];
//   switch (nameEn) {
//     case "a > z":
//       orderOption = [["name_en", "ASC"]];
//       break;
//     case "z > a":
//       orderOption = [["name_en", "DESC"]];
//       break;
//     // 其他排序方式...
//     default:
//       // 處理未匹配到的情況
//       break;
//   }

//   // 查詢資料庫並根據排序選項返回結果
//   return Restaurant.findAll({
//     attributes: [
//       "id",
//       "name",
//       "name_en",
//       "category",
//       "image",
//       "location",
//       "phone",
//       "google_map",
//       "rating",
//       "description",
//     ],
//     order: orderOption, // 根據排序選項排序
//     raw: true,
//   })
//     .then((restaurants) => {
//       // 渲染頁面或進行其他操作...
//       res.render("index", { restaurants });
//     })
//     .catch((err) => {
//       console.errorMessage = "載入失敗";
//       next(error);
//     });
// });


module.exports = router;