import express from 'express'
import Author from '../models/author.js';
import Book from '../models/book.js';

export const authorRouter = express.Router();

authorRouter.get('/', async (req, res) => {
   let searchOptions = {}
   if (req.query.name != null && req.query.name !== '') {
      searchOptions.name = new RegExp(req.query.name, 'i')
   }
   try {
      const authors = await Author.find(searchOptions)
      res.render('../views/authors/index.ejs', { authors: authors, searchOptions: req.query })
   } catch (error) {
      res.redirect('/')
   }

})

authorRouter.get('/new', (req, res) => {
   res.render('../views/authors/new.ejs', { author: new Author() })
})

authorRouter.post('/', async (req, res) => {
   const author = new Author({
      name: req.body.name
   })

   try {
      const newAuthor = await author.save()
      res.redirect(`authors/${newAuthor.id}`)
   } catch {
      res.render('authors/new', {
         author: author,
         errorMessage: 'Error creating Author'
      })
   }
})

authorRouter.get("/:id", async (req, res) => {

   try {
      const author = await Author.findById(req.params.id)
      const books = await Book.find({ author: author.id }).limit(6).exec()

      res.render('authors/show', {
         author: author,
         booksByAuthor: books
      })
   } catch  {
      res.redirect('/')
   }

})

authorRouter.get("/:id/edit", async (req, res) => {
   try {
      const author = await Author.findById(req.params.id)
      res.render("authors/edit", { author: author })
   } catch (error) {
      res.redirect('/authors')
   }
})
authorRouter.put("/:id", async (req, res) => {
   let author
   try {
      author = await Author.findById(req.params.id)
      author.name = req.body.name
      await author.save()
      res.redirect(`/authors/${author.id}`)

   } catch {
      if (author == null) {
         res.redirect('/')
      } else {
         res.render('authors/edit', {
            author: author,
            errorMessage: 'Error updating Author'
         })
      }

   }
})
authorRouter.delete("/:id", async (req, res) => {
   let author
   try {
      // author = await Author.findById(req.params.id)
      await Author.deleteOne({ _id: req.params.id })
      res.redirect('/authors')

   } catch {
      
   res.redirect('/authors')
      
   }
})