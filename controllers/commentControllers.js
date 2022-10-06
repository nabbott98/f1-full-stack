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
// POST
// only loggedIn users can post comments
router.post("/:driverId", (req, res) => {
    const driverId = req.params.driverId

    if (req.session.loggedIn) {
        // we want to adjust req.body so that the author is automatically assigned
        req.body.author = req.session.userId
    } else {
        res.sendStatus(401)
    }
    // find a specific fruit
    Driver.findById(driverId)
        // do something if it works
        //  --> send a success response status and maybe the comment? maybe the fruit?
        .then(driver => {
            // push the comment into the fruit.comments array
            driver.comments.push(req.body)
            // we need to save the fruit
            return driver.save()
        })
        .then(driver => {
            res.status(200).json({ driver: driver })
        })
        // do something else if it doesn't work
        //  --> send some kind of error depending on what went wrong
        .catch(error => console.log(error))
})

// DELETE
// only the author of the comment can delete it
router.delete('/delete/:driverId/:commId', (req, res) => {
    // isolate the ids and save to vars for easy ref
    const driverId = req.params.driverId 
    const commId = req.params.commId
    //console.log('driverID: ', driverId)
    //console.log('commID: ', commID)
    // get the fruit
    Driver.findById(driverId)
        .then(driver => {
            // get the comment
            // subdocs have a built in method that you can use to access specific subdocuments when you need to.
            // this built in method is called .id()
            const theComment = driver.comments.id(commId)
            console.log('this is the comment that was found', theComment)
            // make sure the user is logged in
            if (req.session.loggedIn) {
                // only let the author of the comment delete it
                if (theComment.author == req.session.userId) {
                    // find some way to remove the comment
                    // here's another built in method
                    theComment.remove()
                    driver.save()
                    res.sendStatus(204)
                    // return the saved fruit
                    // return fruit.save()
                } else {
                    res.sendStatus(401)
                }
            } else {
                res.sendStatus(401)
            }
        })
        // send an error if error
        .catch(error => console.log(error))

})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router