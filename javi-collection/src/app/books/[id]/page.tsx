'use client';


import Image from 'next/image'
import { useEffect, useState } from 'react';

export default function BookPage({ params }: { params: Promise<{ id: string }> }) {

    const [book, setBook] = useState([]);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const { id } = await params;
                const res = await fetch('/api/books/' + id, {
                    method: 'POST',
                });
                const data = await res.json();
                setBook(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        }

        fetchBooks();
    }, []);

    return (
        <>
            {
                book.length === 0 ? (
                    <p>Cargando libro...</p>
                ) : (
                    <div>
                        <h1>{book.title}</h1>
                        <Image src={`/books/${book.image ? book.image : 'default.jpg'}`} alt={book.title} width={200} height={300} />
                        <p><strong> Author: </strong>{book.writer}</p>
                        <p><strong>pages: </strong>{book.pages}</p>
                        <p><strong>initDate: </strong>{book.initDate}</p>
                        <p>{book.description}</p>
                        {book.status !== 'reader' && (
                            <>
                            <p><strong>status:</strong> {book.status}</p>
                            <p><strong>endDate:</strong> {book.endDate}</p>
                            <p><strong>rating:</strong> {book.rating}</p>
                            <p><strong>review:</strong> {book.review}</p>
                            </>
                        )}
                    </div>
                )
            }
        </>

    )
}