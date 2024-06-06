'use strict';
const restaurantData = require("../public/jsons/restaurant.json").results;
const bcrypt = require("bcryptjs")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction

    try {
      transaction = await queryInterface.sequelize.transaction();

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
     
      await queryInterface.bulkInsert("Restaurants",
        restaurantData.map((restaurant, i) => {
          if ( 0 <= i && i <= 4 ) {
          return {...restaurant, userID: 1, createdAt: new Date(), updatedAt: new Date()}
        }
          if ( 5 <= i && i <= 8 ) {
          return {...restaurant, userID: 2, createdAt: new Date(), updatedAt: new Date()}
        }
      }),
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback()
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Restaurants', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
}