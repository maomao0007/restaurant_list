const express = require("express");
const app = express();
const port = 3000;
const { engine } = require("express-handlebars");
//const restaurants = require("./public/jsons/restaurant.json").results;
const methodOverride = require("method-override");

//導入資料庫模型
const db = require("./models");
const Restaurant = db.Restaurant;

//用於解析 POST 請求中的 URL 編碼的表單資料
app.use(express.urlencoded({ extended: true }));
//載入 method-override
app.use(methodOverride("_method"));

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

// 解析在 public 檔案裡的靜態文件目錄
app.use(express.static("public"));

// redirect to the home page of the restaurant list
app.get("/", (req, res) => {
  res.redirect("/Restaurant-List");
});

// display the restaurant list and keyword function
app.get("/Restaurant-List", (req, res) => {
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
      });
    })
    .catch((err) => {
      console.error("Error fetching restaurants:", err);
      res.status(500).send("Error fetching restaurants");
    });
});

// display the add restaurant page
app.get("/Restaurant-List/new", (req, res) => {
  res.render("new")
})

// add a new restaurant
app.post("/Restaurant-List", (req, res) => {
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
    .then(() => res.redirect("/Restaurant-List"))
    .catch((error) => console.log(error));
});

// display the details of the restaurant
app.get("/Restaurant-List/:id", (req, res) => {
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
  }).then((restaurant) => res.render("detail", { restaurant }));
});

// display the edit restaurant page
app.get("/Restaurant-List/:id/edit", (req, res) => {
  const id = req.params.id
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
    .catch((err) => console.log(err));
})

// edit the restaurant
app.put("/Restaurant-List/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;
  return Restaurant.update( body, { where: { id } })
    .then(() => res.redirect(`/Restaurant-List/${id}`))
    .catch((err) => {
      console.error("Error updating restaurant:", err);
      res.status(500).send("Error updating restaurant");
    });
});

// delete the restaurant
app.delete("/Restaurant-List/:id", (req, res) => {
  const id = req.params.id
  return Restaurant.destroy({ where: { id } })
    .then(() => res.redirect("/Restaurant-List")
  );
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
