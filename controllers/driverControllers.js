////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Driver = require("../models/driver")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
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
        .catch(err => res.redirect(`/error?error=${err}`))
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
    req.body.isWorldChampion = req.body.isWorldChampion === 'on' ? true : false
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // this is going to add ownership, via a foreign key reference, to our drivers
    // basically, all we have to do, is append our request body, with the `owner` field, and set the value to the logged in user's id
    req.body.owner = req.session.userId
    console.log('the driver from the form', req.body)
    // we'll use the mongoose model method `create` to make a new driver
    Driver.create(req.body)
        .then(driver => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // send the user a '201 created' response, along with the new driver
            // res.status(201).json({ driver: driver.toObject() })
            res.redirect('/drivers')
            // res.render('drivers/show', { driver, username, loggedIn, userId })
        })
        .catch(err => res.redirect(`/error?error=${err}`))
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
        .catch(err => res.redirect(`/error?error=${err}`))
})

// GET request to show the update page
router.get("/edit/:id", (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId

    const driverId = req.params.id

    Driver.findById(driverId)
        // render the edit form if there is a driver
        .then(driver => {
            res.render('drivers/edit', { driver, username, loggedIn, userId })
        })
        // redirect if there isn't
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
    // res.send('edit page')
})

// PUT request
// update route -> updates a specific driver
router.put("/:id", (req, res) => {
    //console.log("req.body initially", req.body)
    const id = req.params.id

    req.body.isWorldChampion = req.body.isWorldChampion === 'on' ? true : false
    //console.log('req.body after changing checkbox value', req.body)
    Driver.findById(id)
        .then(driver => {
            if (driver.owner == req.session.userId) {
                // must return the results of this query
                return driver.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .then(() => {
            // console.log('returned from update promise', data)
            res.redirect(`/drivers/${id}`)
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

router.delete('/:id', (req, res) => {
    // get the driver id
    const driverId = req.params.id

    // delete and REDIRECT
    Driver.findByIdAndRemove(driverId)
        .then(driver => {
            // if the delete is successful, send the user back to the index page
            res.redirect('/drivers')
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})

// SHOW request
// read route -> finds and displays a single resource
router.get("/:id", (req, res) => {
    const id = req.params.id

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
        .catch(err => res.redirect(`/error?error=${err}`))
})


//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router
