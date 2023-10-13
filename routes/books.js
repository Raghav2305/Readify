import express from 'express'
import Book  from '../models/book.js';
import Author  from '../models/author.js';
import multer from 'multer';
import path from 'path'
import fs from 'fs'
import { coverImageBasePath } from '../models/book.js';

const uploadPath = path.join('public' , coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})
export const bookRouter = express.Router();

bookRouter.get('/', async (req, res) => {

    let query = Book.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render("books/index", {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

bookRouter.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

bookRouter.post('/', upload.single('cover') , async (req, res) => {
    
    const fileName = req.file != null ? req.file.filename : null
    
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImage: fileName,
        description: req.body.description
    })

    try {
        const newBook = await book.save()
        res.redirect('books')
    } catch (error) {
        if(book.coverImage != null){
            removeBookCoverImage(book.coverImage)
        }
        renderNewPage(res, book, true)
    }
  })

  function removeBookCoverImage(fileName){
    fs.unlink(path.join(upload, fileName), err => {
        console.error(err)
    } )
  }

  async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
       }

       if(hasError) params.errorMessage = "Error creating book"
        res.render('books/new', params )
    } catch {
        res.redirect('/books')
    }
  }