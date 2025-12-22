const express = require("express");
const sequelize = require("../config/db");
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const t = await sequelize.transaction();

  try {
    let total = 0;

    const order = await Order.create(
      { user_id: req.userId, total: 0 },
      { transaction: t }
    );

    for (const item of req.body.items) {
      const product = await Product.findByPk(item.product_id, {
        transaction: t,
      });

      if (!product || product.stock < item.quantity)
        throw new Error("Stock insufficient");

      total += product.price * item.quantity;

      await OrderItem.create(
        {
          order_id: order.id,
          product_id: product.id,
          quantity: item.quantity,
          price_at_purchase: product.price,
        },
        { transaction: t }
      );

      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    order.total = total;
    await order.save({ transaction: t });

    await t.commit();
    res.status(201).json(order);
  } catch (err) {
    await t.rollback();
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
