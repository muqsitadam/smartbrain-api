const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

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
    // console.log(data)
})

const app =  express()

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('success')
})

//SignIn
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

//Register ....dependencies injection
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

//Profile ID
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)})

//Increase rank by images
app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.listen(3000, () => {
    console.log('App is running on port 3000')
}) 