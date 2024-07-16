const express = require('express');
const pg = require('pg');

// create client connection to data
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_hr_directory');

// create server
const server = express();

// create init function
// department comes first because it's the parent
// NOT NULL means it's required.

const init = async () => {
    await client.connect();
    console.log('client connected');

    let SQL = `
        DROP TABLE IF EXISTS employee;
        DROP TABLE IF EXISTS department;

        CREATE TABLE department(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL 
        );

        CREATE TABLE employee(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now(),
            department_id INTEGER REFERENCES department(id) NOT NULL
        )
    `
    // database process query - sends to databse
    await client.query(SQL);
    console.log("tables created");

    
    SQL = `
    INSERT INTO department(name) VALUES('Contracting');
    INSERT INTO department(name) VALUES('Billing');
    INSERT INTO department(name) VALUES('Claims');

    INSERT INTO employee(name, department_id) VALUES('Jake', (SELECT id FROM department WHERE name='Contracting'));
    INSERT INTO employee(name, department_id) VALUES('Brian', (SELECT id FROM department WHERE name='Billing'));
    INSERT INTO employee(name, department_id) VALUES('Indigo', (SELECT id FROM department WHERE name='Claims'));
    `;

    await client.query(SQL);
    console.log("seeded table");

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server listening on ${PORT}`)
    })

}

init();

server.use(express.json())
server.use(require("morgan")("dev"));


// CRUD
// get employees
server.get('/api/employees', async (req, res, next) => {
    try {
        const SQL = `SELECT * FROM employee`
        const response = await client.query(SQL);
        res.send(response.rows);
    } catch (error) {
        next(error)
    }
});

// GET departments
server.get('/api/departments', async (req, res, next) => {
    try {
        const SQL =`SELECT * FROM department;`;
        const response = await client.query(SQL);
        res.send(response.rows);
    } catch (error) {
        next(error)
    }
});

// POST employees
server.post('/api/employees', async (req, res, next) => {
    try {
        const {name, department_id} = req.body;

        const SQL = `INSERT INTO employee(name, department_id) VALUES($1, $2) RETURNING *;`
        const response = await client.query(SQL, [name, department_id]);
        res.status(201).send(response.rows[0]);
    } catch (error) {
        next(error)
    }
});

// DELETE employee
server.delete('/api/employees/:id', async (req, res, next) => {
    try {
        const SQL = `
        DELETE FROM employee WHERE id=$1;
    `;
    await client.query(SQL, [req.params.id]);
    // send status code 204 for delete
    res.sendStatus(204);

    } catch (error) {
        next(error)
    }
});

// PUT employees
server.put('/api/employees/:id', async (req, res, next) => {
    try {
        const {name, department_id} = req.body;

        const SQL = `UPDATE employee SET name=$1, department_id=$2, updated_at=now() WHERE id=$3 RETURNING *;`
        const response = await client.query(SQL, [name, 
            department_id, 
            req.params.id,]);
        res.send(response.rows[0]);

    } catch (error) {
        next(error)
    }
});

// // error handling route
server.use((err, req, res) => {
    res.status(res.status)
});