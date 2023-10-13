import express from 'express'

 export const indexRouter = express.Router()

 indexRouter.get('/', (req, res) => {
    res.render('index')
 })