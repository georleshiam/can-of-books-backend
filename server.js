'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require(`mongoose`)
const app = express();
app.use(cors());

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
    status: String
  });
  mongomodel = mongoose.model(`Book`, bookSchema);
  
  const arrayOfBooks = [
    { title: 'Book 1', description: 'Description 1', status: 'Available' },
    { title: 'Book 2', description: 'Description 2', status: 'In Progress' },
    { title: 'Book 3', description: 'Description 3', status: 'Completed' }
  ];
  mongomodel.insertMany(arrayOfBooks)
}

Connect()


app.get('/test', (request, response) => {
  response.send('test request received')

})
app.get('/books', async (request,response) =>{
  
let books = await mongomodel.find({});
response.send(books)
})

app.listen(PORT, () => console.log(`listening on ${PORT}`));
