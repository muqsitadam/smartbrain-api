const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')

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

    // Load hash from your password DB.
    // bcrypt.compare("nawal", '$2a$10$EkTTBpGr/FQdcXZwHV060u3cfGvEk23If/tSmHWitlOqgzZH/5DDi', function(err, res) {
    //     console.log('first guess', res)
    // });
    // bcrypt.compare("veggies", '$2a$10$EkTTBpGr/FQdcXZwHV060u3cfGvEk23If/tSmHWitlOqgzZH/5DDi', function(err, res) {
    //     console.log('second guess', res)
    // });

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

    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash)
    // });

    database.user.push({
        id: "125",
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })
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