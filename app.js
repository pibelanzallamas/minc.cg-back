const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db.js");
require("./models");

const allowedOrigins = [
  "http://localhost:5173/",
  "https://my-movie-crib-back.onrender.com",
];

const users = require("./routes/users.js");
const products = require("./routes/products");
const orders = require("./routes/orders");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/users", users);
app.use("/products", products);
app.use("/orders", orders);

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("DB sincronizada");
  } catch (error) {
    console.error(error);
  }
})();

app.listen(3000, () =>
  console.log("Ecommerce API running on http://localhost:3000")
);
