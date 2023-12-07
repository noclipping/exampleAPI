const { Pool } = require("pg");


const pool = new Pool({
    user: "postgres",
    host: "library.cdxoevlmzhqr.ap-south-1.rds.amazonaws.com",
    database: "books_db",
    password: "testpass1",
    port: 5432,
  });

  
  // Test DB connection
  pool.query("SELECT NOW()", (err, res) => {
    if(res){
      console.log('connection established')
    } else if (err){
      console.log('error connecting')
    }
  });
  
async function createBook(req, res)  {
    const { title, author_id, publication_year } = req.body;
    
    if(!title || !author_id || !publication_year){
        return  res.json({'Error':'invalid input'})
        
    }
    if(title.length <= 0 || author_id.length <= 0 || publication_year<= 0){
        return  res.json({'Error':'invalid input'})
    }
    console.log(author_id,'author_id', typeof(author_id), 'typeof')
    if(isNaN(author_id) || isNaN(publication_year)){
        return  res.json({'Error':'invalid input'})
    }
    if(publication_year.length < 4 || publication_year.length > 4){
        return res.json({'Error':'year is invalid'})
    }

    const doesAuthorExist = await pool.query(`SELECT * FROM authors WHERE id = $1`, [author_id])
    if(!doesAuthorExist.rows[0]){
        return res.json({'Error':'author does not exist'})
    }
    const result = await pool.query(
      "INSERT INTO books (title, author_id, publication_year) VALUES ($1, $2, $3) RETURNING *",
      [title, author_id, publication_year]
    );
    res.json(result.rows[0]);
  }

  async function getBooks(req, res){
    const result = await pool.query("SELECT * FROM books");
    res.json(result.rows);
  }
async function  updateBook(req, res) {
    const { id } = req.params;
    let { title, author_id, publication_year } = req.body;
    const preexistingData = await pool.query(`SELECT * FROM books WHERE id = $1`, [id])

    if(!title || title.length <= 0 ){
        title = preexistingData.rows[0].title
    }
    if(!publication_year || publication_year.length<=0){
        publication_year = preexistingData.rows[0].publication_year
    }
    if(!author_id || author_id.length<=0){
        author_id = preexistingData.rows[0].author_id
    }
    
    const result = await pool.query(
      "UPDATE books SET title = $1, author_id = $2, publication_year = $3 WHERE id = $4 RETURNING *",
      [title, author_id, publication_year, id]
    );
    res.json(result.rows[0]);
  }
async function deleteBook(req, res){
    const { id } = req.params;
    await pool.query("DELETE FROM books WHERE id = $1", [id]);
    res.json({ message: "Book deleted" });
  }


 // add author exports

async function createAuthor(req, res)  {
    const { name, dob, nationality } = req.body;

    if(!name || !dob || !nationality){
        return  res.json({'Error':'invalid input'})
        
    }
    if(name.length <= 0 || dob.toString().length <= 0 || nationality.length<= 0){
        return  res.json({'Error':'invalid input'})
    }
    let validDate = /^\d{4}-\d{2}-\d{2}$/gm
    if(!validDate.test(dob)){
        return res.json({'Error':'invalid dob (format is YYYY-MM-DD)'})
    }
    const result = await pool.query(
      "INSERT INTO authors (name, dob, nationality) VALUES ($1, $2, $3) RETURNING *",
      [name, dob, nationality]
    );
    res.json(result.rows[0]);
  }
  // id |     name     |    dob     | nationality
async function getAuthors(req, res){
    const result = await pool.query(
        "SELECT * FROM authors"
    )
    res.json(result.rows)
}
async function updateAuthor(req, res) {
    const { id } = req.params;
    let { name, dob, nationality } = req.body;
    const preexistingData = await pool.query(`SELECT * FROM authors WHERE id = $1`, [id])

    if(!name || name.length <= 0 ){
        name = preexistingData.rows[0].name
    }
    if(!dob || dob.length<=0){
        dob = preexistingData.rows[0].dob
    }
    if(!nationality || nationality.length<=0){
        nationality = preexistingData.rows[0].nationality
    }
    
    const result = await pool.query(
      "UPDATE authors SET name = $1, dob = $2, nationality = $3 WHERE id = $4 RETURNING *",
      [name, dob, nationality, id]
    );
    res.json(result.rows[0]);
  }
  async function deleteAuthor(req, res){
    const { id } = req.params;
    await pool.query("DELETE FROM authors WHERE id = $1", [id]);
    res.json({ message: "Author deleted" });
  }

module.exports= {createBook, getBooks, updateBook, deleteBook, createAuthor, getAuthors, updateAuthor, deleteAuthor}