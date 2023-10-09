const { result } = require('@hapi/joi/lib/base');
const mysql = require('mysql2');

const client = mysql.createPool({
    user: 'user',
    host: 'localhost',
    database: 'db',
    password: 'password',
    port: 3307

})

client.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log('Connected to mysql database');
})


const getUsers = (req, res) => {
    client.query('SELECT * FROM users', (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log(result, 'results');
        res.status(200).json(result);
    })
}

const getUserById = (req, res) => {
    const id = Number(req.params.id)
    console.log(id, 'id');
    client.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    })
}

const deleteUserById = (req, res) => {
    const id = parseInt(req.params.id);

    client.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) throw err;

        res.status(204)
    })
}

const createUser = (req, res) => {
    client.query('INSERT into users SET ?', req.body, (err, result) => {
        if (err) {
            res.send(500).send(err);
        }
        res.send(201).send(result.insertId);
    })
}

module.exports = {
    createUser,
    getUserById,
    getUsers,
    deleteUserById
}