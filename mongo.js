const mongoose = require('mongoose')

if (process.argv.length != 3 && process.argv.length < 5) {
    console.log("Missing arguments. Please try again.")
    process.exit(1)
} 

const password = process.argv[2]

const url = `mongodb+srv://brendanlyc:${password}@cluster0.w3uemxg.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
    
mongoose.set('strictQuery', false)

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 3) {
    console.log("phonebook:")
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    
    const contact = new Contact({
        name: name,
        number: number
    })
    
    contact.save().then(result => {
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
    })
}


