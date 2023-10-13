import express from 'express'
import Author  from '../models/author.js';

export const authorRouter = express.Router();

authorRouter.get('/', async (req, res) => {
   let searchOptions = {}
   if(req.query.name != null && req.query.name !== ''){
      searchOptions.name = new RegExp(req.query.name, 'i')
   }
   try {
      const authors = await Author.find(searchOptions)
      res.render('../views/authors/index.ejs', {authors: authors, searchOptions: req.query})
   } catch (error) {
      res.redirect('/')
   }
   
})

authorRouter.get('/new', (req, res) => {
   res.render('../views/authors/new.ejs', {author: new Author()})
})

authorRouter.post('/', async (req, res) => {
   const author = new Author({
      name: req.body.name
   })

   try {
      const newAuthor = await author.save()
      // res.redirect(`authors/${newAuthor.id}`)
      res.redirect(`authors`)
    } catch {
      res.render('authors/new', {
        author: author,
        errorMessage: 'Error creating Author'
      })
    }
  })