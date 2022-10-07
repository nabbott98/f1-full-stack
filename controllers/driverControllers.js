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
// GET request
// index route -> shows all instances of a document in the db
router.get("/", (req, res) => {
    // console.log("this is the request", req)
    // in our index route, we want to use mongoose model methods to get our data
    Driver.find({})
        .populate("comments.author", "username")
        .then(drivers => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // console.log(drivers)
            // this is fine for initial testing
            // res.send(drivers)
            // this the preferred method for APIs
            // res.json({ drivers: drivers })
            // here, we're going to render a page, but we can also send data that we got from the database to that liquid page for rendering
            res.render('drivers/index', { drivers, username, loggedIn, userId })
        })
        .catch(err => console.log(err))
})

// GET for new driver
// renders the form to create a driver
router.get('/new', (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId

    res.render('drivers/new', { username, loggedIn, userId })
})
// POST request
// create route -> gives the ability to create new drivers
router.post("/", (req, res) => {
    // bc our checkboxes dont send true or false(which they totally should but whatev)
    // we need to do some js magic to change the value
    // first side of the equals sign says "set this key to be the value"
    // the value comes from the ternary operator, checking the req.body field
    req.body.isWorldChampion = req.body.readyToEat === 'on' ? true : false
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // this is going to add ownership, via a foreign key reference, to our drivers
    // basically, all we have to do, is append our request body, with the `owner` field, and set the value to the logged in user's id
    req.body.owner = req.session.userId
    console.log('the driver from the form', req.body)
    // we'll use the mongoose model method `create` to make a new driver
    Driver.create(req.body)
        .then(driver => {
            // send the user a '201 created' response, along with the new driver
            // res.status(201).json({ driver: driver.toObject() })
            res.redirect('/drivers')
        })
        .catch(error => console.log(error))
})

// GET request
// only drivers owned by logged in user
// we're going to build another route, that is owner specific, to list all the drivers owned by a certain(logged in) user
router.get('/mine', (req, res) => {
    // find the drivers, by ownership
    Driver.find({ owner: req.session.userId })
    // then display the drivers
        .then(drivers => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId

            // res.status(200).json({ drivers: drivers })
            res.render('drivers/index', { drivers, username, loggedIn, userId })
        })
    // or throw an error if there is one
        .catch(error => res.json(error))
})

// GET request to show the update page
router.get("/edit/:id", (req, res) => {
    // const username = req.session.username
    // const loggedIn = req.session.loggedIn
    // const userId = req.session.userId
    res.send('edit page')
})

// PUT request
// update route -> updates a specific driver
router.put("/:id", (req, res) => {
    // console.log("I hit the update route", req.params.id)
    const id = req.params.id
    Driver.findById(id)
        .then(driver => {
            if (driver.owner == req.session.userId) {
                res.sendStatus(204)
                return driver.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .catch(error => res.json(error))
})


// // Get request
// // index route -> shows all instances of a document in the db
// router.get("/", (req, res) => {
//     // in our index route we want to use mongoose model methods to get our data
//     Driver.find({})
//         .populate("comments.author", "username")
//         .then(drivers => {
//             // this is fine for initial testing
//             res.json({drivers: drivers})
//         })
//         .catch(err => console.log(err))
// })

// // GET request - Owner Items
// // only drivers owned by logged in user
// // we're going to build another route, that is owner specific, to list all the drivers owned by a certain(logged in) user
// router.get('/mine', (req, res) => {
//     // find the drivers, by ownership
//     Driver.find({ owner: req.session.userId })
//     // then display the drivers
//     .populate("comments.author", "username")
//         .then(driver => {
//             res.status(200).json({ driver: driver })
//         })
//     // or throw an error if there is one
//         .catch(error => res.json(error))
// })

// // Post request 
// // create route -> gives us the ability to create new drivers
// // create -> POST
// router.post('/', (req, res) => {

//     // we're ready for mongoose to do its thing
//     // now that we have user specific drivers, 
//     // we'll add the owner to the driver from the request body.
//     // Since we've stored the id of the user in the session object, we can use it to set the owner property of the driver upon creation.
//     req.body.owner = req.session.userId
//     console.log('this is req.body before adding owner', req.body)
//     Driver.create(req.body)
//       .then((driver) => {
//         console.log('this was returned from create', driver)
//         res.status(201).json({ driver: driver.toObject() })
//       })
//       .catch((err) => {
//         console.log(err)
//         res.json({ err })
//       })
//   })

// // PUT request
// // Updates a specific driver
// router.put('/:id', (req, res) => {
// 	// get the id from the request url
// 	const driverId = req.params.id
// 	// tell mongoose to update the driver
// 	Driver.findById(driverId)
//         .then(driver => {
//             if (driver.owner == req.session.userId) {
//                 return driver.updateOne(req.body)
//             } else {
//                 console.log('Unauthorized to change this driver')
//             }
//         })
// 		// if successful -> send status
// 		.then(driver => {
// 			console.log('the updated driver', driver)
// 			res.sendStatus(204)
// 		})
// 		// if an error, display that
// 		.catch((error) => res.json(error))
// })
//-------------------------------------------------------------------------------
// Show Request
// Read route -> find and display a single resource
// Updates a specific driver
router.get("/:id", (req, res) => {
    // console.log("I hit the update route", req.params)
    const id = req.params.id

    // for now we'll use a simple mongoose model
    // we're using find by id and update
    Driver.findById(id)
    // populate will provide more data about the document that is in the specified collection
    // the first arg is the field to populate
    // the second can specify which parts to keep or which to remove
    // .populate("owner", "username")
    // we can also populate fields of our subdocuments
    .populate("comments.author", "username")
    .then(driver => {
        const username = req.session.username
        const loggedIn = req.session.loggedIn
        const userId = req.session.userId
        // res.json({ driver: driver })
        res.render('drivers/show', { driver, username, loggedIn, userId })
    })
    .catch(err => console.log(err))
})


// DELETE request
// destroy route -> finds and deletes a single resource(driver)
// delete route
// router.delete('/:id', (req, res) => {
//     // get the driver id
//     const driverId = req.params.id
//       // delete the driver
//     Driver.findById(driverId)
//         .then(driver => {
//             if (driver.owner == req.session.userId) {
//                 return driver.deleteOne()
//             } else {
//                 console.log('Unauthorized to change this driver')
//             }
//       })
//           .then(() => {
//               res.sendStatus(204)
//           })
//           .catch((error) => {
//         console.log(error)
//               res.json({ error })
//           })
//   })

router.delete('/:id', (req, res) => {
    // get the driver id
    const driverId = req.params.id

    // delete and REDIRECT
    Driver.findByIdAndRemove(driverId)
        .then(driver => {
            // if the delete is successful, send the user back to the index page
            res.redirect('/drivers')
        })
        .catch(error => {
            res.json({ error })
        })
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router
