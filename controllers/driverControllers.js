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
// Here, we're going to set up a seed route 'carting'
// this will seed our db for us, so we have some starting resources
// seed scripts -> they work, and they are best practices
router.get("/carting", (req, res) => {
    // array of starter drivers
    const startDrivers = [
      { name: "Max Verstappen", team: "Red Bull", country: "Netherlands", isWorldChampion: true },
      { name: "Sergio Perez", team: "Red Bull", country: "Mexico", isWorldChampion: false },
      { name: "Charles Leclerc", team: "Ferrari", country: "Monaco", isWorldChampion: false },
      { name: "Carlos Sainz", team: "Ferrari", country: "Spain", isWorldChampion: false },
      { name: "Lewis Hamilton", team: "Mercedes", country: "England", isWorldChampion: true },
      { name: "George Russell", team: "Mercedes", country: "England", isWorldChampion: false },
      { name: "Lando Norris", team: "Mclaren", country: "England", isWorldChampion: false },
      { name: "Daniel Ricciardo", team: "Mclaren", country: "Australia", isWorldChampion: false },
      { name: "Fernando Alonso", team: "Alpine", country: "Spain", isWorldChampion: true },
      { name: "Esteban Ocon", team: "Alpine", country: "France", isWorldChampion: false },
      { name: "Valterri Bottas", team: "Alfa Romeo", country: "Finland", isWorldChampion: false },
      { name: "Zhou Guanyu", team: "Alfa Romeo", country: "China", isWorldChampion: false },
      { name: "Sebastian Vettel", team: "Aston Martin", country: "Germany", isWorldChampion: true },
      { name: "Lance Stroll", team: "Aston Martin", country: "Canada", isWorldChampion: false },
      { name: "Mick Schumacher", team: "Haas", country: "Germany", isWorldChampion: false },
      { name: "Kevin Magnussen", team: "Haas", country: "Denmark", isWorldChampion: false },
      { name: "Pierre Gasly", team: "Alpha Tauri", country: "France", isWorldChampion: false },
      { name: "Yuki Tsunoda", team: "Alpha Tauri", country: "Japan", isWorldChampion: false },
      { name: "Alex Albon", team: "Williams", country: "Thailand", isWorldChampion: false },
      { name: "Nicholas Latifi", team: "Williams", country: "Canada", isWorldChampion: false },
    ]
  
    // Delete all drivers
    Driver.deleteMany({}).then((data) => {
      Driver.create(startDrivers)
        .then((data) => {
        // send created drivers as response to confirm creation
          res.json(data)
        })
    })
  })

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
