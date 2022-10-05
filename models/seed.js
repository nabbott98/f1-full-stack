///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Driver = require('./driver')

///////////////////////////////////////////
// Seed Code
////////////////////////////////////////////
// Here, we're going to set up a seed script 'carting'
// this will seed our db for us, so we have some starting resources
// seed scripts -> they work, and they are best practices
// save the connection in a variable
const db = mongoose.connection
console.log('db in seed', db)
db.on('open', () => {
	// array of starter fruits
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
        { name: "Nicholas Latifi", team: "Williams", country: "Canada", isWorldChampion: false }
      ]

	// when we seed data, there are a few steps involved
	// delete all the data that already exists(will only happen if data exists)
	Driver.deleteMany({})
        .then(deletedDrivers => {
		    console.log('this is what remove returns', deletedDrivers)
		    // then we create with our seed data
            Driver.create(startDrivers)
                .then((data) => {
                    console.log('Here are the new seed drivers', data)
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    db.close()
                })
	    })
        .catch(error => {
            console.log(error)
            db.close()
        })
})
