const express = require('express')

const app =  express()

app.get('/', (req, res) => {
    res.send('This is working')
})

app.post()

app.listen(3000, () => {
    console.log('App is running on port 3000')
}) 