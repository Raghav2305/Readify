import { config } from 'dotenv';

if(process.env.NODE_ENV !== 'production'){
    config()
}

import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import {fileURLToPath} from 'url'
import {dirname} from 'path';
import { indexRouter } from './routes/index.js';
import { authorRouter } from './routes/authors.js';
import { bookRouter } from './routes/books.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser'; 
import methodOverride from 'method-override'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout',  'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})

const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', error => console.log("connected to mongoose"))

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

app.listen(process.env.PORT || 3000)