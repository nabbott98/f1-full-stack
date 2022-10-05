////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Driver = require("../models/driver")

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////
// Routes
/////////////////////////////////////////


// Get request
// index route -> shows all instances of a document in the db
router.get("/", (req, res) => {
    // in our index route we want to use mongoose model methods to get our data
    Driver.find({})
        .then(drivers => {
            // this is fine for initial testing
            res.json({drivers: drivers})
        })
        .catch(err => console.log(err))
})

// Post request 
// create route -> gives us the ability to create new drivers
router.post("/", (req,res) => {
    // here we'll get something called request body 
    // inside theis fuction,that will be refereed to as req.body
    Driver.create(req.body)
        .then(driver => {
            res.status(201).json({ driver: driver.toObject() })
        })
        .catch(err => console.log(err))
})

// PUT request
// Updates a specific driver
router.put("/:id", (req, res) => {
    // console.log("I hit the update route", req.params)
    const id = req.params.id

    // for now we'll use a simple mongoose model
    // we're using find by id and update
    Driver.findByIdAndUpdate(id, req.body, {new: true})
        .then(driver => {
            console.log('the driver from upate', driver)
            // update success is called '204 - no content
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

// Show Request
// Read route -> find and display a single resource
// Updates a specific driver
router.get("/:id", (req, res) => {
    // console.log("I hit the update route", req.params)
    const id = req.params.id

    // for now we'll use a simple mongoose model
    // we're using find by id and update
    Driver.findById(id, req.body)
        .then(driver => {
            console.log('show request complete', driver)
            // update success is called '204 - no content
            res.json({driver: driver})
        })
        .catch(err => console.log(err))
})


// DELETE request
// destroy route -> finds and deletes a single resource(fruit)
router.delete("/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    // find and delete the fruit
    Driver.findByIdAndRemove(id)
        // send a 204 if successful
        .then(() => {
            res.sendStatus(204)
        })
        // send the error if not
        .catch(err => res.json(err))
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router
