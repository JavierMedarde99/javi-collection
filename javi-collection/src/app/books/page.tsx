'use client';

import './books.css';
import { useEffect, useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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
                    <div className='loading'>
                        <Progress value={33} />
                    </div>
                ) : (
                    books.map((book) => (
                        <Card key={book._id}>
                            <CardHeader>
                                <CardTitle>{book.title}</CardTitle>
                            </CardHeader>
                            <CardContent className='text-bg-light'>
                                <p><strong>Autor:</strong> {book.writer}&ensp;<br />
                                    <strong>Páginas:</strong> {book.pages}<br /> <br />
                                    {book.description} </p>
                                <p> <a href={`/books/${book._id}`}>Ver más</a> </p>
                            </CardContent>
                        </Card>
                    ))
                )}
                < Card >
                    <CardHeader>
                        <CardTitle>New</CardTitle>
                    </CardHeader>
                    <CardContent className='text-bg-light'>
                        <Popover>
                            <PopoverTrigger>+</PopoverTrigger>
                            <PopoverContent>Place content for the popover here.</PopoverContent>
                        </Popover>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}