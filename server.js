import { config } from 'dotenv';

if(process.env.NODE_ENV !== 'production'){
    config()
}

import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import {fileURLToPath} from 'url'
import {dirname} from 'path';
import { router } from './routes/index.js';
import mongoose from 'mongoose';
import { error } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout',  'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})

const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', error => console.log("connected to mongoose"))

app.use(router)

app.listen(process.env.PORT || 3000)