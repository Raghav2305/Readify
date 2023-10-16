import mongoose from "mongoose";
import Book from "./book.js"
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('deleteOne', async function (next) {

    try {
        const query = this.getFilter();
        const hasBook = await Book.exists({ author: query._id });

        if (hasBook) {
            next(new Error("This author still has books."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
    // Book.find({author: this.id}, (err, books) => {
    //     if(err){
    //         next(err)
    //     }else if(books.length > 0){
    //         next(new Error("This author has books in the Library"))
    //     }else{
    //         next()
    //     }
    // })
})

const Author = mongoose.model("Author", authorSchema)
export default Author