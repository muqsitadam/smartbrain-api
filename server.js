const express = require('express')
const bodyParser = require('body-parser')

const app =  express()

app.use(bodyParser.json())
const database = {
    user: [
        {
            id: "123",
            name: "Muqsit",
            email: "muqsit@gmail.com",
            password: "adamu",
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Adam",
            email: "adam@gmail.com",
            password: "olams",
            entries: 0,
            joined: new Date()
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
        res.json('success')
    }else{
        res.status(400).json('Wrong email or password')
    }
})

//Register
app.post('/register', (req, res) => {
    const { name, email, password } = req.body
    database.user.push({
        id: "125",
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.user[database.user.length-1])
})

app.listen(3000, () => {
    console.log('App is running on port 3000')
}) 