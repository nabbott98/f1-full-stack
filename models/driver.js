/////////////////////////////////////////////
// Our schema and model for the driver resource
/////////////////////////////////////////////
//const mongoose = require("mongoose") // import mongoose
const mongoose = require('./connection')

// we're going to pull the schema and model from mongoose
// we'll use a snytax called destructuring
const { Schema, model } = mongoose

// drivers schema
const driverSchema = new Schema({
    name: String,
    team: String,
    country: String,
    isWorldChampion: Boolean
})

// Make the driver model
// the model method takes two args
// the first is what we will call our model
// the second is what we will use to build the model

// make the driver model
const Driver = model("Driver", driverSchema)

/////////////////////////////////////////////
// Export our model
/////////////////////////////////////////////
module.exports = Driver