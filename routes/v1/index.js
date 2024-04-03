const router = require("express").Router();
const pool = require('./../../db/koneksi');

function auth(req, res, next) {
    let { authorization } = req.headers;

    if (authorization) {
        let token = authorization.split(' ')[1];

        if (token) {
            return next()
        }
    }
    return res.status(401).json({
        status: false,
        message: 'you\'re unauthorized',
        data: null
    });
}

// get all books
router.get('/', async (req, res, next) => {
    try {
        const books = await pool.query('SELECT * FROM books');
        res.json(books.rows);
    } catch (err) {
        next(err);
    }
})

// get detail books
router.get('/books/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const books = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        if (books.rows.length > 0) {
            res.json(books.rows[0]);
        } else {
            res.status(404).json({
                status: false,
                message: 'Data buku tidak tersedia'
            });
        }
    } catch (err) {
        next(err);
    }
})

// creating a resource
router.post('/books', auth, async (req, res, next) => {
    const { title, author, published_year, is_available } = req.body;

    if (!title || !author || !published_year || !is_available) {
        return res.status(400).json({
            status: false,
            message: 'title, author, published_year, and is_available are required'
        });
    }

    try {
        const books = await pool.query('INSERT INTO books (title, author, published_year, is_available) VALUES ($1, $2, $3, $4) RETURNING *', [title, author, published_year, is_available]);
        res.status(201).json(books.rows[0]);
    } catch (err) {
        next(err);
    }
});

// updating a resource
router.put('/books/:id', async (req, res, next) => {
    const id = req.params.id;
    const { title, author, published_year, is_available } = req.body;


    try {
        const books = await pool.query('UPDATE books SET title = $1, author = $2, published_year = $3, is_available = $4 WHERE id = $5 RETURNING *', [title, author, published_year, is_available, id]);

        if (books.rows.length > 0) {
            res.status(200).json(books.rows[0]);
        } else {
            res.status(404).json({
                status: false,
                message: 'Data buku tidak tersedia'
            });
        }

    } catch (err) {
        next(err);
    }
});

// deleting a resource
router.delete('/books/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const books = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
        if (books.rows.length > 0) {
            res.json({
                status: true,
                message: 'Buku berhasil dihapus'
            });
        } else {
            res.status(404).json({
                status: false,
                message: 'Data buku tidak tersedia'
            });
        }
    } catch (err) {
        next(err);
    }
});

// internal error handler
router.use((err, req, res, next) => {
    console.log('error: ', err);
    res.status(500).json({
        status: false,
        message: 'Internal server error'
    });
});




module.exports = router;