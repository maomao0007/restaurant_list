'use strict';
// 讀取文件系統中的文件
const fs = require("fs");
// 處理和轉換文件路徑
const path = require("path");
const bcrypt = require("bcryptjs")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction

    try {
      transaction = await queryInterface.sequelize.transaction();

      // 讀取餐廳資料
      const restaurantFilePath = path.join(
        __dirname,
        "../public/jsons/restaurant.json"
      );
      const restaurantData = JSON.parse(
        fs.readFileSync(restaurantFilePath, "utf8")
      );
      const hash = await bcrypt.hash("12345678", 10);

      await queryInterface.bulkInsert(
        "Users",
        [
          {
            id: 1,
            name: "user1",
            email: "user1@example.com",
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            name: "user2",
            email: "user2@example.com",
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );
      // 將前 4 家餐廳分配給第一位使用者
      const restaurantsForUser1 = restaurantData.slice(0, 4).map((restaurant) => ({
          ...restaurant,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

      // 將第 5 到第 8 家餐廳分配給第二位使用者
      const restaurantsForUser2 = restaurantData.slice(4, 8).map((restaurant) => ({
          ...restaurant,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

      // 插入餐廳資料
      await queryInterface.bulkInsert("Restaurants",
        [...restaurantsForUser1, ...restaurantsForUser2],
        { transaction }
      );

      // // 或寫成以下這個
      // await queryInterface.bulkInsert(
      //   "Restaurants",
      //   restaurantData.map((restaurant, index) => ({
      //     ...restaurant,
      //     userId: index < 4 ? 1 : 2,
      //     createdAt: new Date(),
      //     updatedAt: new Date(),
      //   })),
      //   { transaction }
      // );

      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback()
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Restaurants', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    } 
};
