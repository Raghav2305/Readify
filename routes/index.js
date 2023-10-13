import express from 'express'
import Book from '../models/book.js'

 export const indexRouter = express.Router()

 indexRouter.get('/', async (req, res) => {
   let books
   try {
      books = await Book.find().sort({createdAt: 'desc' }).limit(10).exec()
   } catch {
      books = []
   }

   res.render('index', {books: books})
 })