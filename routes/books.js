import express from 'express'
import Book from '../models/book.js';
import Author from '../models/author.js';


const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) =>{
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// })
export const bookRouter = express.Router();

bookRouter.get('/', async (req, res) => {

    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
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

bookRouter.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })

    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
    } catch (error) {
        renderNewPage(res, book, true)
    }
})

bookRouter.get('/:id', async (req, res) => {

    try {
        const book = await Book.findById(req.params.id).populate('author').exec()

        res.render('books/show', {
            book: book
        })
    } catch  {
        res.redirect('/')
    }
})

bookRouter.get('/:id/edit', async(req, res) => {
    try{
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    }catch{
        res.redirect('/')
    }
})

bookRouter.put('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description

        if(req.body.cover != null && req.body.cover !== ''){
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch {
        if(book != null){
            renderEditPage(res, book, true)
        }else{
            res.redirect('/')
        }
    }

})

bookRouter.delete('/:id', async(req, res) => {
    let book
    try {
     book = await Book.deleteOne({_id: req.params.id})
     res.redirect("/books")
    } catch  {
        if(book != null){
            res.render('/books/show', {
                book: book,
                errorMessage: 'Could not delete book'
            })
        }else{
            res.redirect('/')
        }
        
    }
})



async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError)
}
async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, 'new', hasError)
}



async function renderFormPage(res, book, form,  hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }

        if (hasError) params.errorMessage = "Error creating book"
        res.render(`books/${form}`, params)
    } catch {
        res.redirect('/books')
    }
}

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return

    const cover = JSON.parse(coverEncoded)

    if (coverEncoded != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}