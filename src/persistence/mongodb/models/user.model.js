"use strict";

const { Schema, model } = require("mongoose");

const SCHEMA_NAME = "user";

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, unique: true, index: "text" },
    firstname: { type: String, index: "text" },
    lastname: { type: String, index: "text" },
    aliases: { type: [String], default: [], index: "text" },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  this.id = String(this.id);
  if (this.username === void 0 || this.username === "undefined") {
    this.username = null;
  }
  this.firstname = String(this.firstname).toLowerCase();
  this.lastname = String(this.lastname).toLowerCase();
  this.type = String(this.type).toLowerCase();
  this.aliases = this.aliases.map((alias) => String(alias).toLowerCase());
  return next();
});

module.exports = model(SCHEMA_NAME, userSchema);
