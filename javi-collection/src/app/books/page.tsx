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
import ReactStars from 'react-stars'
import { FormExternalBooks } from './formFindExternalBooks';

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

    function truncateText(text: string, maxLength = 50) {
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
                                    <PopoverTrigger>add manual</PopoverTrigger>
                                    <PopoverContent className="max-h-180 overflow-y-auto w-64">
                                        <FormBooks />
                                    </PopoverContent>
                                </Popover>

                                <Popover>
                                    <PopoverTrigger>add find</PopoverTrigger>
                                    <PopoverContent className="max-h-170 overflow-y-auto w-150">
                                        <FormExternalBooks />
                                    </PopoverContent>
                                </Popover>
                            </CardContent>
                        </Card>
                        {books.map((book) => (
                            ((typeBook == book.type || typeBook == '') && (nameBook == '' || book.title.toLowerCase().includes(nameBook.toLowerCase()))) && (
                                <Card key={book._id} className="mt-4">
                                    <CardHeader>
                                        <CardTitle className="text-center">{book.title}</CardTitle>
                                        <Image
                                            src={
                                                book.image?.startsWith("http")
                                                    ? book.image
                                                    : `/books/${book.image || "default.jpg"}`
                                            }
                                            alt={book.title}
                                            width={200}
                                            height={300}
                                            style={{
                                                margin: "auto",
                                            }}
                                        />
                                    </CardHeader>
                                    <CardContent className='text-bg-light'>
                                        <ul>
                                            <li><strong>Author:</strong> {book.writer}</li>
                                            <li><strong>type:</strong> {book.type}</li>
                                            <li><strong>status:</strong> {book.status}</li>
                                            {book.status == 'read' && (
                                                <ReactStars
                                                    count={5}
                                                    value={book.rating}
                                                    size={24}
                                                    edit={false} />
                                            )}
                                        </ul>

                                        <p>
                                            {truncateText(book.description)}</p>
                                        <p className="text-center"> <a href={`/books/${book._id}`}>Ver más</a> </p>
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