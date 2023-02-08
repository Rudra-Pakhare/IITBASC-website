import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pkg;
const client = new Client({
    host: 'localhost',
    port: 5432,
    user:'rudra',
    password: process.env.PASSWORD,
    database: 'lab4db'
});

export default client;