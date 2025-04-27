'use client';

import './books.css';
import { useEffect, useState } from 'react';
import Card from "react-bootstrap/Card";

export default function BooksPage() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const res = await fetch('/api/books');
                const data = await res.json();
                setBooks(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        }

        fetchBooks();
    }, []);

    return (
        <div>
            <h1>List of Books</h1>

            <div className='listBooks'>
                {books.length === 0 ? (
                    <p>Cargando libros...</p>
                ) : (
                    books.map((book) => (
                        <Card key={book._id}>
                            <Card.Img variant='top' src="public/" alt='book' />
                            <Card.Body className='text-bg-light'>
                                <Card.Title>{book.title}</Card.Title>
                                <Card.Text>
                                    <strong>Autor:</strong> {book.writer}&ensp;
                                    <strong>Páginas:</strong> {book.pages}<br /> <br />
                                    {book.description}
                                </Card.Text>
                                <Card.Link href={`/books/${book._id}`} className='btn btn-primary'>
                                    Ver más
                                </Card.Link>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}