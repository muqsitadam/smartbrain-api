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
    db('users').insert({
        name: name,
        email: email,
        joined: new Date()
    }).then(console.log)
    res.json(database.user[database.user.length-1])
})

//Profile ID
app.get('/profile/:id', (req, res) => {
    const { id } = req.params
    let found = false

    database.user.forEach(user => {
        if (user.id === id){
            found = true
            return res.send(user)
        }
    })
    if (!found){
        res.status(404).json('not found')        
    }
})

//Increase rank by images
app.put('/image', (req, res) => {
    const { id } = req.body
    let found = false

    database.user.forEach(user => {
        if (user.id === id){
            found = true
            user.entries++
            return res.json(user.entries)
        }
    })
    if (!found){
        res.status(404).json('not found')        
    }
})

app.listen(3000, () => {
    console.log('App is running on port 3000')
}) 