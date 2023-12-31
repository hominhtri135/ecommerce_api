"use strict";
// key !dmbg install by Mongo Snippets for Node-js

const { model, Schema, Types } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";
const URL_DEFAULT_AVATAR = "/avatar/default_avatar.jpg";

// Declare the Schema of the Mongo model
var userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      maxLength: [10, "no should have maximum 10 digits"],
      match: [/\d{10}/, "no should only have digits"],
      default: null,
    },
    password: {
      type: String,
      min: 6,
      trim: true,
      required: true,
    },
    passwordsUsed: {
      type: Array,
      default: [], // nhung password da duoc su dung
    },
    avatar: {
      public_id: { type: String },
      url: { type: String, default: URL_DEFAULT_AVATAR },
    },
    address: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      enum: ["USER", "MANAGER", "ADMIN"],
      default: "USER",
    },
    active: { type: Boolean, default: true },
    isVerify: {
      type: Boolean,
      default: false,
    },
    public: { type: Boolean, default: true }, // role as delete or block
    lock: {
      status: { type: Boolean, default: false },
      reason: { type: String, max: 5000, trim: true },
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
