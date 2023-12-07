const express = require("express");
const app = express();
const cors = require("cors")
const port = 3000;
const { createBook, getBooks, updateBook, deleteBook, createAuthor, getAuthors, updateAuthor,deleteAuthor} = require("./queries");

app.use(cors())
app.use(express.json()); // for parsing application/json

app.post("/books",createBook);
app.get("/books", getBooks);
app.put("/books/:id", updateBook);
app.delete("/books/:id", deleteBook);

// create post, get, put, delete for author CRUD operations for author CREATE READ UPDATE DELETE aka POST GET PUT DELETE

app.post('/authors', createAuthor)
app.get('/authors', getAuthors)
app.put("/authors/:id", updateAuthor)
app.delete("/authors/:id", deleteAuthor);
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});