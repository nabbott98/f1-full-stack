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

// GET request - Owner Items
// only fruits owned by logged in user
// we're going to build another route, that is owner specific, to list all the fruits owned by a certain(logged in) user
router.get('/mine', (req, res) => {
    // find the fruits, by ownership
    Driver.find({ owner: req.session.userId })
    // then display the fruits
        .then(driver => {
            res.status(200).json({ driver: driver })
        })
    // or throw an error if there is one
        .catch(error => res.json(error))
})

// Post request 
// create route -> gives us the ability to create new drivers
// create -> POST
router.post('/', (req, res) => {

    // we're ready for mongoose to do its thing
    // now that we have user specific fruits, 
    // we'll add the owner to the fruit from the request body.
    // Since we've stored the id of the user in the session object, we can use it to set the owner property of the fruit upon creation.
    req.body.owner = req.session.userId
    console.log('this is req.body before adding owner', req.body)
    Driver.create(req.body)
      .then((driver) => {
        console.log('this was returned from create', driver)
        res.status(201).json({ driver: driver.toObject() })
      })
      .catch((err) => {
        console.log(err)
        res.json({ err })
      })
  })

// PUT request
// Updates a specific driver
router.put('/:id', (req, res) => {
	// get the id from the request url
	const driverId = req.params.id
	// tell mongoose to update the driver
	Driver.findById(driverId)
        .then(driver => {
            if (driver.owner == req.session.userId) {
                return driver.updateOne(req.body)
            } else {
                console.log('Unauthorized to change this driver')
            }
        })
		// if successful -> send status
		.then(driver => {
			console.log('the updated driver', driver)
			res.sendStatus(204)
		})
		// if an error, display that
		.catch((error) => res.json(error))
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
// destroy route -> finds and deletes a single resource(driver)
// delete route
router.delete('/:id', (req, res) => {
    // get the driver id
    const driverId = req.params.id
      // delete the driver
    Driver.findById(driverId)
        .then(driver => {
            if (driver.owner == req.session.userId) {
                return driver.deleteOne()
            } else {
                console.log('Unauthorized to change this driver')
            }
      })
          .then(() => {
              res.sendStatus(204)
          })
          .catch((error) => {
        console.log(error)
              res.json({ error })
          })
  })

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router
