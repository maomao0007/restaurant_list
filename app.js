const express = require("express");
const app = express();
const port = 3000;
const { engine } = require("express-handlebars");
//const restaurants = require("./public/jsons/restaurant.json").results;
const methodOverride = require("method-override");

const db = require("./models");
const Restaurant = db.Restaurant;

//用於解析 POST 請求中的 URL 編碼的表單資料
app.use(express.urlencoded({ extended: true }));
//載入 method-override
app.use(methodOverride("_method"));

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/Restaurant-List");
});

//app.get("/restaurant", (req, res) => {
  //return Restaurant.findAll()
    //.then((restaurant) => res.render("index", { restaurant }))
    //.catch((err) => res.status(422).json(err));
//});

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

app.get("/Restaurant-List/new", (req, res) => {
  res.render("new")
})

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

//app.get("/Restaurant-List/:id", (req, res) => {
//const id = req.params.id;
//const restaurant = restaurants.find((shop)=> shop.id.toString()===id)
//res.render('detail',{ restaurant: restaurant });
//});

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
app.put("/Restaurant-List/:id", (req, res) => {
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
  const id = req.params.id;

  return Restaurant.findByPk(id)
    .then((restaurant) => {
      if (!restaurant) {
        return res.status(404).send("Restaurant not found");
      }

      // 使用解構賦值來更新餐廳屬性
      restaurant.name = name;
      restaurant.name_en = name_en;
      restaurant.category = category;
      restaurant.image = image;
      restaurant.location = location;
      restaurant.phone = phone;
      restaurant.google_map = google_map;
      restaurant.rating = rating;
      restaurant.description = description;

      // 儲存更新後的餐廳
      return restaurant.save()
        .then(() => {
          res.redirect(`/Restaurant-List/${id}`);
        })
        .catch((err) => {
          console.error("Error saving updated restaurant:", err);
          res.status(500).send("Error saving updated restaurant");
        });
    })

    .catch((err) => {
      console.error("Error finding restaurant:", err);
      res.status(500).send("Error finding restaurant");
    });
});


  //另一種方法 
  //return Restaurant.findByPk(id, {
    //attributes: [
      //"id",
      //"name",
      //"name_en",
      //"category",
      //"image",
      //"location",
      //"phone",
      //"google_map",
      //"rating",
      //"description",
    //],
  //})
    //.then((restaurant) => {
        //restaurant.name = body.name;
        //return restaurant.save()
      //.catch((err) => console.log(err));
      //})
      //.then(() => res.redirect(`/Restaurant-List/${id}`));
//})

app.delete("/Restaurant-List/:id", (req, res) => {
  const id = req.params.id
  return Restaurant.destroy({ where: { id } })
    .then(() => res.redirect("/Restaurant-List")
  );
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
