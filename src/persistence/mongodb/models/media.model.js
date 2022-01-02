"use strict";

const { Schema, model } = require("mongoose");

const mediaSchema = new Schema(
  {
    googleKey: { type: String, required: true, unique: true },
    webContentLink: { type: String, required: true, unique: true },
    mimeType: { type: String, required: true },
    type: { type: String, required: true },
    tags: { type: [String], default: [], index: "text" },
  },
  {
    timestamps: true,
  }
);

mediaSchema.pre("save", function (next) {
  this.mimeType = String(this.mimeType).toLowerCase();
  this.type = String(this.type).toLowerCase();
  this.tags = this.tags.map((tag) => String(tag).toLowerCase());
  next();
});

module.exports = model("media", mediaSchema);
