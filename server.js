const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')


const db  = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'wordpass',
      database : 'smartbrain'
    }
});

db.select('*').from('users').then(data => {
    console.log(data)
})

const app =  express()

app.use(bodyParser.json())
app.use(cors())

const database = {
    user: [
        {
            id: "123",
            name: "Muqsit",
            email: "muqsit@gmail.com",
            password: 'muqsit',
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Adam",
            email: "adam@gmail.com",
            password: 'adam',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'muqsit@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.user)
})

//SignIn
app.post('/signin', (req, res) => {
    if(req.body.email === database.user[0].email && 
       req.body.password === database.user[0].password){
        res.json(database.user[0]);
        // res.json('success')
    }else{
        res.status(400).json('Wrong email or password')
    }
})

//Register
app.post('/register', (req, res) => {
    const { name, email, password } = req.body
    db('users')
    .returning('*')
    .insert({
        name: name,
        email: email,
        joined: new Date()
    })
    .then(user => {
        res.json(user[0])
    })
    .catch(err => res.status(400).json('Email already exists'))
})

//Profile ID
app.get('/profile/:id', (req, res) => {
    const { id } = req.params
    db.select('*').from('users').where({id})
    .then(user => {
        if(user.length){
            res.json(user)
        }else{
            res.status(400).json('Not found')
        }
    })
    .catch(err => res.status(400).json('Error getting users'))
})

//Increase rank by images
app.put('/image', (req, res) => {
    const { id } = req.body
    db.where('id', '=', id)
    .increment('entries', 1)
})

app.listen(3000, () => {
    console.log('App is running on port 3000')
}) 