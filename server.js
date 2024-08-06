const express = require('express');
const {getAllBooks,getBook,searchQuery,fetchByCategory} = require('./firestore.js');


const app = express();

app.use(express.static(__dirname + '/public'))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


app.get('/search-results', (req, res) => {
  res.sendFile(__dirname + '/public/search.html');
});



app.get('/book', (req, res) => {
  res.sendFile(__dirname + '/public/book.html');
});


app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/auth/auth.html');
});

app.get('/fetch-all-books', async (req,res) => {
  const books = await getAllBooks()
  // console.log(books)
  res.json(books)
});

app.get('/fetch-book', async (req,res) => {
  const {id} = req.query;
  // console.log(id)
  const book = await getBook(id)
  res.json(book)
});

app.get('/search',async (req,res) => {
  const {query} = req.query
  const results = await searchQuery(query)
  console.log(results)
  res.json(results)
})

app.get('/search-category',async (req,res) => {
  const {query} = req.query
  const results = await fetchByCategory(query)
  console.log(results)
  res.json(results)
})




app.listen(3000,() => {
  console.log('server running at http://localhost:3000');
});