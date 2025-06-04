require('dotenv').config ()
const express = require('express')
const Contact = require('./models/contact')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', function (req, res) {
    if (req.method === 'POST' || req.method === 'PUT') {
        return JSON.stringify(req.body)
    } else {
        return ''
    }
    })

app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(results => {
        response.json(results)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Contact.findById(requests.params.id)
        .then(contact => {
            response.json(contact)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Contact.findByIdAndDelete (request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    contact.save()
        .then(savedContact => {
            response.json(savedContact)
        })
        .catch(error => next(error))


})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Contact.findByIdAndUpdate (request.params.id) 
        .then(note => {
            if (!note) {
                response.status(404).end()
            }

            note.name = name
            note.number = number

            return note.save().then(updatedNote => {
                response.json(updatedNote)
            })
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const now = new Date()
    const formattedDate = now.toString()
    Contact.countDocuments({}).then(value => {
        response.send(`<p>Phonebook has info for ${value} people</p><p>${formattedDate}</p>`)
    })
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === "ValidationError") {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})