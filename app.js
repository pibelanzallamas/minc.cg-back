const express = require("express");
const sequelize = require("./config/db.js");
require("./models");

const users = require("./routes/users.js");
const products = require("./routes/products");
const orders = require("./routes/orders");

const app = express();
app.use(express.json());

app.use("/users", users);
app.use("/products", products);
app.use("/orders", orders);

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("DB sincronizada");
  } catch (error) {
    console.error(error);
  }
})();

app.listen(3000, () =>
  console.log("Ecommerce API running on http://localhost:3000")
);
