const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    trim: true,
    maxlength: [120, "prodct name must less than 120"],
  },

  price: {
    type: Number,
    required: [true, "please enter Price"],
    maxlength: [5, "price is less than 5"],
  },

  description: {
    type: String,
    required: [true, "please enter your description"],
    trim: true,
  },

  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],

  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: [
      true,
      "please select category from -short-sleeves, long-sleeves, sweat-shirt, hoodies",
    ],
    enum: {
      values: ["shortsleeves", "longsleeves", "sweat-hirt", "hoodies"],
      message:
        "Please select catogery only from short-sleeves, long-sleeves, sweat-shirt, hoodies ",
    },
  },
  brand: {
    type: String,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Prdouct", productSchema);
