const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db.js");
require("./models");

const users = require("./routes/users.js");
const products = require("./routes/products");
const orders = require("./routes/orders");

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.36:5173",
  "https://minc-cg-front.onrender.com",
];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true); 
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
//     return callback(null, false); 
//   },
// }));

app.use(cors());

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
