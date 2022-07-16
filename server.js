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
    // console.log(data)
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
    res.send('success')
})

//SignIn
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
       .where('email', '=', req.body.email)
       .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if(isValid){
                db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('Unable to get user'))
            }else{
                res.status(400).json('Wrong credentials')
            }
       })
       .catch(err => res.status(400).json('Wrong credentials'))
})

//Register
app.post('/register', (req, res) => {
    const { name, email, password } = req.body
    const hash = bcrypt.hashSync(password)
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                name: name,
                email: loginEmail[0].email,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)   
    })
    .catch(err => res.status(400).json('Unable to register'))
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
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json('Unable to get entries'))
})

app.listen(3000, () => {
    console.log('App is running on port 3000')
}) 