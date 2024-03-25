const express = require("express");
const port = 3000;
const pool = require("./db/koneksi.js");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// get all books
app.get('/', async (req, res, next) => {
    try {
        const books = await pool.query('SELECT * FROM books');
        res.json(books.rows);
    } catch(err) {
        next(err);
    }
})

// get detail books
app.get('/books/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const books = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        if(books.rows.length > 0 ){
            res.json(books.rows[0]);
        } else {
            res.status(404).json({error: 'Data buku tidak tersedia'});
        }
    } catch (err) {
        next(err);
    }
})

// creating a resource
app.post('/books', async (req, res, next) => {
    const { title, author, published_year, is_available } = req.body;

    try {
        const books = await pool.query('INSERT INTO books (title, author, published_year, is_available) VALUES ($1, $2, $3, $4) RETURNING *', [title, author, published_year, is_available]);
        res.status(201).json(books.rows[0]);
    } catch (err) {
        next(err);
    }
});

// updating a resource
app.put('/books/:id', async (req, res, next) => {
    const id = req.params.id;
    const { title, author, published_year, is_available } = req.body;
    

    try {
        const books = await pool.query('UPDATE books SET title = $1, author = $2, published_year = $3, is_available = $4 WHERE id = $5 RETURNING *', [title, author, published_year, is_available, id]);
        res.status(200).json(books.rows[0]);
    } catch (err) {
        next(err);
    }
});

// deleting a resource
app.delete('/books/:id', async (req, res, next) => {
    const id = req.params.id;
    try{
        const books = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
        if(books.rows.length){
            res.json({message: 'Buku berhasil dihapus'});
        } else {
            res.status(404).json({err:  'Data buku tidak tersedia'});
        }
    } catch (err) {
        next(err);
    }
});

// internal error handler
app.use((err, req, res, next) => {
    console.log('error: ', err);
    res.status(500).json({error: 'Internal server error'});
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
