"use strict";

const { Schema, model, SchemaTypes } = require("mongoose");
const { Number } = SchemaTypes;

const SCHEMA_NAME = "user";

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, unique: true, index: "text" },
    firstname: { type: String, index: "text" },
    lastname: { type: String, index: "text" },
    score: { type: Number, default: 0 },
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

const userModel = model(SCHEMA_NAME, userSchema);

const saveUserModel = async (context) => {
  try {
    const {
      message: { from },
    } = context;
    const { id, username, first_name, last_name } = from;

    const user = {
      id,
      firstname: first_name,
      lastname: last_name,
      username,
    };
    await userModel.updateOne({ id }, { $set: user }, { upsert: true });
  } catch (error) {
    const { message } = error;
    console.error("saveUserModel", message);
  }
};

const saveUserScore = async (context, score = 0) => {
  try {
    const {
      message: { from },
    } = context;
    const { id } = from;

    await userModel.updateOne({ id }, { $inc: { score } });
  } catch (error) {
    const { message } = error;
    console.error("saveUserScore", message);
  }
};

module.exports = {
  schemaName: SCHEMA_NAME,
  userModel,
  saveUserModel,
  saveUserScore,
};
