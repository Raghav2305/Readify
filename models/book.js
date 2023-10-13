import mongoose from "mongoose";
import path from 'path'

export const coverImageBasePath = "uploads/bookCovers"

const bookSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImage: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Author'
    }
})

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null){
        return path.join('/', coverImageBasePath, this.coverImage)
    }
})

const Book = mongoose.model("Book", bookSchema)
export default Book