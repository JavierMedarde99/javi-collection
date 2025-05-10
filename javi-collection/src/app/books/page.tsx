'use client';

import './books.css';
import { FormBooks } from "./formBooks";
import { FindButtons } from "./InputFindBook";
import { TypesButtons } from "./typesButtons";
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
import Image from 'next/image'


export default function BooksPage() {
    const [books, setBooks] = useState([]);
    const [typeBook, setTypeBook] = useState('');
    const [nameBook, setNameBook] = useState('');

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

    function truncateText(text, maxLength = 50) {
        return text.length > maxLength
            ? text.slice(0, maxLength - 3) + '...'
            : text;
    }

    return (
        <div>
            <h1>List of Books</h1>
            <div className="flex flex-row justify-around w-full">
                <TypesButtons booktype={typeBook} setbooktype={setTypeBook} />
                <FindButtons setbookname={setNameBook} />
            </div>
            <div className='listBooks'>
                {books.length === 0 ? (
                    <div className='loading'>
                        <Progress value={33} />
                    </div>
                ) : (
                    <>
                        < Card className="mt-4 w-25">
                            <CardHeader>
                                <CardTitle>New</CardTitle>
                            </CardHeader>
                            <CardContent className='text-bg-light'>
                                <Popover>
                                    <PopoverTrigger>+</PopoverTrigger>
                                    <PopoverContent className="max-h-200 overflow-y-auto w-64">
                                        <FormBooks />
                                    </PopoverContent>
                                </Popover>
                            </CardContent>
                        </Card>
                        {books.map((book) => (
                            ((typeBook == book.type || typeBook == '') && (nameBook == '' || book.title.toLowerCase().includes(nameBook.toLowerCase()))) && (
                                <Card key={book._id} className="mt-4">
                                    <CardHeader>
                                        <CardTitle>{book.title}</CardTitle>
                                        <Image
                                            src={`/books/${book.image ? book.image : 'default.jpg'}`}
                                            alt={book.title}
                                            width={200}
                                            height={300}
                                        />
                                    </CardHeader>
                                    <CardContent className='text-bg-light'>
                                        <p><strong>Autor:</strong> {book.writer}&ensp;<br />
                                            <strong>Páginas:</strong> {book.pages}<br /> <br />
                                            {truncateText(book.description)}</p>
                                        <p> <a href={`/books/${book._id}`}>Ver más</a> </p>
                                    </CardContent>
                                </Card>
                            )
                        ))}
                    </>

                )}

            </div>
        </ div>
    );
}