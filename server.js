/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const morgan = require("morgan") // import morgan
const mongoose = require("mongoose") // import mongoose
const path = require("path") // import path module

/////////////////////////////////////////////
// Import our models
/////////////////////////////////////////////
const Driver = require('./models/driver')

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// this is where we will set up our inputs for our database connect function
const DATABASE_URL = process.env.DATABASE_URL
// here is our DB config object
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// establish our connection
mongoose.connect(DATABASE_URL, CONFIG)

// tell mongoose what to do with certain events
// opens, disconnects, errors
mongoose.connection
    .on("open", () => console.log("Connected to Mongoose"))
    .on("close", () => console.log("Disconnected from Mongoose"))
    .on("error", (error) => console.log("An error occurred: \n", error))

/////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////
const app = express()

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
// middleware runs before all the routes, every request is processed through our middleware before mongoose does anything with it.
app.use(morgan("tiny")) // This is for request logging, the "tiny" argument declares what size of morgan log to use.
app.use(express.urlencoded({ extended: true })) // this parses urlEncoded request bodies(useful for POST and PUT requests)
app.use(express.static("public")) // serve files from the public folder statically
app.use(express.json()) // parses incoming request payloads with JSON

/////////////////////////////////////////////
// Routes
/////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("Your server is running, better go out and catch it")
})

// Here, we're going to set up a seed route 'carting'
// this will seed our db for us, so we have some starting resources
// seed scripts -> they work, and they are best practices
app.get("/drivers/carting", (req, res) => {
    // array of starter drivers
    const startDrivers = [
      { name: "Max Verstappen", team: "Red Bull", country: "Netherlands", isWorldChampion: true },
      { name: "Sergio Perez", team: "Red Bull", country: "Mexico", isWorldChampion: false },
      { name: "Charles Leclerc", team: "Ferrari", country: "Monaco", isWorldChampion: false },
      { name: "Carlos Sainz", team: "Ferrari", country: "Spain", isWorldChampion: false },
      { name: "Lewis Hamilton", team: "Mercedes", country: "England", isWorldChampion: true },
      { name: "George Russel", team: "Mercedes", country: "England", isWorldChampion: false },
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
app.get("/drivers", (req, res) => {
    // in our index route we want to use mongoose model methods to get our data
    Driver.find({})
        .then(drivers => {
            // this is fine for initial testing
            res.json({drivers: drivers})
        })
        .catch(err => console.log(err))
})

// Post request 
// create route -> gives us the ability to create new fruits
app.post("/drivers", (req,res) => {
    // here we'll get something called request body 
    // inside theis fuction,that will be refereed to as req.body
    Driver.create(req.body)
        .then(driver => {
            res.status(201).json({ driver: driver.toObject() })
        })
        .catch(err => console.log(err))
})

// PUT request
// Updates a specific fruit
app.put("/drivers/:id", (req, res) => {
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

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}, mmm that humming is relaxing`))

// END