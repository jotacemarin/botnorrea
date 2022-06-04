"use strict";

const { Schema, model, SchemaTypes } = require("mongoose");
const { ObjectId } = SchemaTypes;
const { schemaName: schemaNameUser } = require("./user.model");

const SCHEMA_NAME = "crew";

const crewSchema = new Schema(
  {
    name: { type: String, unique: true, index: "text", required: true },
    members: [{ type: ObjectId, ref: schemaNameUser }],
  },
  {
    timestamps: true,
  }
);

crewSchema.pre("save", async function (next) {
  this.name = String(this.name).toLowerCase();
  return next();
});

crewSchema.pre('findOne', function (next) {
  this.populate("members");
  return next();
});

const crewModel = model(SCHEMA_NAME, crewSchema);

const saveCrewModel = async (args = []) => {
  if (args.length === 0) {
    const error = "crew name is missing!";
    console.error(`saveCrewModel: ${error}`);
    throw new Error(error);
  }

  const [rawname] = args;
  const name = String(rawname).trim().toLowerCase();
  await crewModel.create({ name });
  return name;
};

module.exports = {
  schemaName: SCHEMA_NAME,
  crewModel,
  saveCrewModel,
};
