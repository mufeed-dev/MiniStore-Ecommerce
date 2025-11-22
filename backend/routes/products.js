const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const router = express.Router();
const { authenticateToken } = require("./auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "product-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

const validateProductId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }
};

const handleImageUpload = (req) => {
  if (req.file) {
    return `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }
  return req.body.image || "https://placehold.co/300x300?text=No+Image";
};

router.get("/", async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 8 } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }

    const getSortQuery = (sortValue) => {
      const sortMap = {
        price_low: { price: 1 },
        price_high: { price: -1 },
        name: { name: 1 },
      };
      return sortMap[sortValue] || { createdAt: -1 };
    };

    const sortQuery = getSortQuery(sort);

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      totalPages,
      currentPage: parseInt(page),
      totalProducts,
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    validateProductId(id);

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    const statusCode = error.message.includes("Invalid product ID") ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
});

router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, price, category } = req.body;

      if (!name || !price || !category) {
        return res
          .status(400)
          .json({ error: "Name, price, and category are required" });
      }

      const imageUrl = handleImageUpload(req);

      const product = new Product({
        name: name.trim(),
        price: parseFloat(price),
        category,
        image: imageUrl,
      });

      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      const statusCode = error.name === "ValidationError" ? 400 : 500;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      validateProductId(id);

      const updateData = { ...req.body };

      if (updateData.name) {
        updateData.name = updateData.name.trim();
      }
      if (updateData.price) {
        updateData.price = parseFloat(updateData.price);
      }
      if (req.file) {
        updateData.image = handleImageUpload(req);
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error) {
      const statusCode =
        error.message.includes("Invalid product ID") ||
        error.name === "ValidationError"
          ? 400
          : 500;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    validateProductId(id);

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    const statusCode = error.message.includes("Invalid product ID") ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
});

module.exports = router;
