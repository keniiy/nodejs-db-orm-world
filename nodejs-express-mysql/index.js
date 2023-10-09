const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
const app = express()
const port = 3002

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.get('/', (req, res) => {
    res.json({ 'MESSAGE': "Hey DEV'S 💵" })
})

app.get('/users', db.getUsers)
app.get('/user/:id', db.getUserById)
app.post('/user', db.createUser)
app.delete('/user/:id', db.deleteUserById)

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})