import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import client from './models/schema.js';
import dotenv from 'dotenv';
import appRoutes from './routes/appRoutes.js';
import session from 'express-session';

const app = express();
dotenv.config();

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));

client.connect().then(() => {console.log('Connected to database')}).catch((err) => {console.log(err)});

const PORT = process.env.PORT || 5000;

app.use('/', appRoutes)

app.listen(PORT, () => {
    console.log('Server started on port 5000');
});