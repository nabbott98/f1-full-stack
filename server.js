/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express

const morgan = require("morgan") // import morgan
const path = require("path") // import path module
const DriverRouter = require('./controllers/driverControllers')
const UserRouter = require('./controllers/userControllers')
const middleware = require("./utils/middleware")

/////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////
const app = express()

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
// middleware runs before all the routes, every request is processed through our middleware before mongoose does anything with it.
middleware(app)

/////////////////////////////////////////////
// Routes
/////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("Your server is running, better go out and catch it")
})

/////////////////////////////////////////////
// Register our Routes
/////////////////////////////////////////////

app.use('/drivers', DriverRouter)
app.use('/users', UserRouter)

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}, mmm that humming is relaxing`))

// END