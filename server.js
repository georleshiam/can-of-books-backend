'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require(`mongoose`)
const app = express();
app.use(cors());
app.use(express.json())
let verifyUser = require('./verifyUser');
app.use(verifyUser)


const PORT = process.env.PORT || 3001;


const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  email: String
});
const mongomodel = mongoose.model(`Book`, bookSchema);

const arrayOfBooks = [
  { title: 'Book 1', description: 'Description 1', status: 'Available', email: `` },
  { title: 'Book 2', description: 'Description 2', status: 'In Progress', email: `` },
  { title: 'Book 3', description: 'Description 3', status: 'Completed', email: `` }
];

mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
  .then(() => {
    console.log("connected successfully")
    mongomodel.insertMany(arrayOfBooks)

  })
  .catch((err) => {
    console.log(err.message)
  })



app.get('/test', (request, response) => {
  response.send('test request received')

})
<<<<<<< HEAD
app.get('/books', async (request,response) =>{
  
let books = await mongomodel.find({email: request.user?.email}).exec();
response.send(books)
=======
app.get('/books', async (request, response) => {

  let books = await mongomodel.find({ email: request.user?.email }).exec();
  response.send(books)
>>>>>>> 5f439dd6ab82fd64e6641ad8b58341e9ffb33d0b
})
app.post('/books', async (request, response) => {
  const { title, description, status } = request.body;
  let book = request.body

  book.email = request.user?.email

  await mongomodel.insertMany(book)

  if (!title || !description || !status) {
    return response.status(400).send('Missing required fields'); // Return a 400 Bad Request if any required fields are missing
  }

  response.send(book); // Send the created book as the response

});

app.put('/books/:id', async (request, response) => {
  let bookId = request.params.id;
  let { title, description, status } = request.body;

  if (!title || !description || !status) {
    return response.status(400).send('Missing required fields');
  }
  try {
    let updatedBook = await mongomodel.findByIdAndUpdate(
      bookId,
      { title, description, status }
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
  let bookId = request.params.id;

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

