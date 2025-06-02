const express = require('express')
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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find (person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter (person => person.id != id)

    response.status(204).end()
})

const generateId = () => {
    return Math.random()*100
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number is missing'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Name already exists in phonebook'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons.concat(person)

    response.json(person)
})

app.get('/info', (request, response) => {
    const now = new Date()
    const formattedDate = now.toString()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${formattedDate}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})