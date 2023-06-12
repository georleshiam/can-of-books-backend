'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require(`mongoose`)
const app = express();
app.use(cors());
app.use(express.json())
app.use(verifyUser)

const PORT = process.env.PORT || 3001;
let mongomodel = undefined

async function Connect(){
  await mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
  .then(()=>{
   console.log("connected successfully")
  })
  .catch((err)=>{
    console.log(err.message)
  })

  const bookSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    email: String
  });
  mongomodel = mongoose.model(`Book`, bookSchema);
  
  const arrayOfBooks = [
    { title: 'Book 1', description: 'Description 1', status: 'Available', email: ``},
    { title: 'Book 2', description: 'Description 2', status: 'In Progress', email:`` },
    { title: 'Book 3', description: 'Description 3', status: 'Completed', email:`` }
  ];
  mongomodel.insertMany(arrayOfBooks)
}

Connect()


app.get('/test', (request, response) => {
  response.send('test request received')

})
app.get('/books', async (request,response) =>{
  
let books = await mongomodel.find({email: request.user.email}).exec();
response.send(books)
})
app.post('/books', async (request, response) => {
  const { title, description, status } = request.body;
  let book = request.body

  book.email = request.user.email

  await bookSchema.insertMany(book)
  
    if (!title || !description || !status) {
      return response.status(400).send('Missing required fields'); // Return a 400 Bad Request if any required fields are missing
    }
  let newBook = await mongomodel.create({
    title,
    description,
    status
  });
 const insertedBooks = await mongomodel.insertMany([newBook]); // Insert the new book into the database

 if (insertedBooks.length === 0) {
  return response.status(500).send('Failed to insert book'); // Return a 500 Internal Server Error if the book insertion fails

}

    response.send(newBook); // Send the created book as the response
  
});

app.put('/books/:id', async (request, response) => {
  let bookId = request.params.id;
  let { title, description, status } = request.body;

  if (!title || !description || !status) {
    return response.status(400).send('Missing required fields');
  }
  try{
    let updatedBook = await mongomodel.findByIdAndUpdate(
      bookId,
      {title, description, status}
    );
    if (!updatedBook) {
      return response.status(404).send('Book not found');
    }

    response.send(updatedBook);
  } catch (error) {
    response.status(500).send('Failed to update book');
  }
  });

app.delete('/books/:id', async (request, response) => {
  let  bookId  = request.params.id;

  if (!id) {
    return response.status(400).send('Missing book ID');
  }

  try {
    let deletedBook = await mongomodel.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return response.status(404).send('Book not found');
    }

    response.send('Book deleted successfully')

    response.send(deletedBook);
  } catch (error) {
    response.status(500).send('Failed to delete book');
  }
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));

