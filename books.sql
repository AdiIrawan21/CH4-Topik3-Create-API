-- create table books
CREATE TABLE books (
	id BIGSERIAL PRIMARY KEY,
	title VARCHAR(50) NOT NULL,
	author VARCHAR(50) NOT NULL,
	published_year INT NOT NULL,
	is_available BOOLEAN DEFAULT TRUE
);

SELECT * FROM books;

INSERT INTO books (title, author, published_year, is_available) VALUES ('Programming in Python', 'Felix', 2015, 'yes');
INSERT INTO books (title, author, published_year, is_available) VALUES ('Programming with Java', 'Antonio', 2010, 'no');