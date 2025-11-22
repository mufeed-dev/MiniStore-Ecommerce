const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: {
        values: [
          "Electronics",
          "Clothing",
          "Books",
          "Home & Kitchen",
          "Sports",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    image: {
      type: String,
      default: "https://placehold.co/300x300?text=No+Image",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
