# Restaurant List

## Introduction

Welcome to my restaurant directory! Register or log in, including via Facebook, to create personalized restaurant forms with detailed information. Explore a variety of restaurants, view details, and manage establishments by adding, updating, or deleting entries. Utilize search and dropdown filters for easy navigation and enjoy seamless browsing with pagination.

## Features

- After registering or logging in, users can also sign in through third-party authentication via Facebook to create their own restaurant lists.
- Restaurant List: Browse through a comprehensive list of restaurants.
- Restaurant Details: View detailed information about each restaurant.
- Add, Update, Delete: Users can add new restaurants, update existing ones, and delete items.
- Access restaurant locations via Google Maps integration.
- Search Functionality: Utilize the search feature by name, category, or description to find restaurants based on keywords.
- Dropdown Box Filters: Filter restaurants by alphabetical order (A-Z), location, and category.
- Pagination: Navigate through the data more conveniently with pagination feature.
- Status Notifications: Receive notifications for successful or failed data operations (add, update, delete).
- Prevent accidental data loss: Clicking the delete button will prompt an alert to reconfirm.

## Environment Setup
This project requires the following software to be installed:
- Node.js v18
- MySQL v8

## How to Use

1. Open your terminal and clone the repository:
   ```shell
   git clone https://github.com/maomao0007/restaurant_list.git
   
2. Navigate to the project directory:
   ```shell
   cd restaurant.list
   
3. Install the necessary dependencies:
   ```shell
   npm install
   
4. Set up the MySQL database to match the configuration in config/config.json.
   
5. Create database:
   ```shell
   Create database Restaurant;
   
6. Create a table:
   ```shell
   npx sequelize db:migrate
   
7. Set seed data:
   ```shell
   npx sequelize-cli db:seed:all
   
8. Setting Environment Variables ( If using MAC / Linux, kindly ignore this step. )
- Set up Development Environment
  ```shell
  export NODE_ENV=development
   
9. Once the installation is complete, start the application:
   ```shell
   npm run dev
   
10. If you see the following message, the server is running successfully:

- express server is running on http://localhost:3000

- Open your web browser and navigate to http://localhost:3000 to view the application.

11. To stop the server, you can exit the terminal by typing:
    ```shell
    ctrl + c

- If you'd like to use Facebook to log in, please configure FACEBOOK_CLIENT_ID, and FACEBOOK_CLIENT_SECRET.

  If you don't have a Facebook Client Id/Secret, please obtain one as Facebook login won't work without it.

- Here are two sets of username and password for use:

  1. Username: user1@example.com

     Password: 12345678

  2. Username: user2@example.com

     Password: 12345678

## Development Tools
- bcryptjs 2.4.3
- bootstrap 5.1.3
- connect-flash 0.1.1
- dotenv 16.4.5
- express 4.19.2
- express-handlebars 7.1.2
- express-session 1.18.0
- handlebars-helpers 0.10.0
- method-override 3.0.0
- mysql2 3.9.7
- nodemon 3.1.0
- npm 9.5.0
- passport 0.7.0
- passport-facebook 3.0.0 
- passport-local 1.0.0
- sequelize 6.37.3
- sequelize-cli 6.6.2

## Screenshots
![screencapture-localhost-3000 ( login page )](https://github.com/maomao0007/restaurant_list/assets/164178703/17c02cae-22bf-4ea4-9636-81e7f92300ea)
![screencapture-Restaurant_List  ( homepage )](https://github.com/maomao0007/restaurant_list/assets/164178703/2ea93ce3-2808-4e62-9ea3-843f7494d2f7)
![screencapture-localhost-3000-Restaurant-List-new ( adding page ) ](https://github.com/maomao0007/restaurant_list/assets/164178703/40086186-6f0d-4f0a-a6b6-acc155de18d8)
![screencapture-localhost-3000-Restaurant-List-3-edit ( editing page )](https://github.com/maomao0007/restaurant_list/assets/164178703/81b344ce-e884-428d-aae0-26bab66be8e1)
