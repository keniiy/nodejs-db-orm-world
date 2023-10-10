const { Client } = require('pg')

const client = new Client({
    user: 'test',
    host: 'localhost',
    database: 'test',
    password: 'test',
    port: 5434
})

client.connect();

client.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log(err);
        return
    }

    console.log('Postgres Database connected');
})

const isValidEmail = (email) => {
    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
};

const getUsers = (request, response) => {
    client.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getUserById = (request, response) => {
    const id = parseInt(request.params.id);

    client.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const createUser = (request, response) => {
    const { name, email } = request.body;

    // Basic validation
    if (!name || !email || !isValidEmail(email)) {
        return response.status(400).send('Invalid input');
    }

    client.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows.length === 0) {
            return response.status(400).send('Error creating user');
        }
        response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    });
};

const updateUser = (request, response) => {
    const id = parseInt(request.params.id);
    const { name, email } = request.body;

    // Basic validation
    if (!name || !email || !isValidEmail(email)) {
        return response.status(400).send('Invalid input');
    }

    client.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error;
            }
            if (results.rowCount === 0) {
                return response.status(404).send(`User not found`);
            }
            response.status(200).send(`User modified with ID: ${results.rows[0].id}`);
        }
    );
};

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);

    client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rowCount === 0) {
            return response.status(404).send(`User not found`);
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};