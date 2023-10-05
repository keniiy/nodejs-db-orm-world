const { result } = require('@hapi/joi/lib/base');
const mysql = require('mysql2');

const client = mysql.createPool({
    user: 'root',
    host: 'localhost',
    database: 'db',
    port: 3306
})

client.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log(er);
        throw err;
    }
    console.log('Connected to mysql database');
})


const getUsers = (req, res) => {
    client.query('', (err, result) => {
        if (err) {
            res.status(500).send(err)
        }
        res.json()
    })
}