const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 10 } = req.query;
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category && category !== "all") {
      query.category = category;
    }
    let sortQuery = {};
    if (sort === "price_low") {
      sortQuery.price = 1;
    } else if (sort === "price_high") {
      sortQuery.price = -1;
    } else if (sort === "name") {
      sortQuery.name = 1;
    } else {
      sortQuery.createdAt = -1;
    }
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(query);
    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: parseInt(page),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
