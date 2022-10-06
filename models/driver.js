/////////////////////////////////////////////
// Our schema and model for the driver resource
/////////////////////////////////////////////
//const mongoose = require("mongoose") // import mongoose
const mongoose = require('./connection')
const User = require('./user')

// here we'll import our commentSchema
const commentSchema = require('./comment')

// we're going to pull the schema and model from mongoose
// we'll use a snytax called destructuring
const { Schema, model } = mongoose

// drivers schema
const driverSchema = new Schema({
    name: String,
    team: String,
    country: String,
    isWorldChampion: Boolean,

    owner: {
        // references the type 'ObjectId', the  `._id` of a user.
        type: Schema.Types.ObjectId,
        // references the model: 'User'
        ref: 'User'
    },
    comments: [commentSchema]
}, { timestamps: true })

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