'use client';

import './books.css';
import { FormBooks } from "./formBooks";
import {Find} from "../../components/InputFind";
import { TypesButtons } from "../../components/typesButtons";
import { useEffect, useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import Image from 'next/image'
import ReactStars from 'react-stars'
import { FormExternalBooks } from './formFindExternalBooks';
import { Button } from '@/components/ui/button';

export default function BooksPage() {
    const [books, setBooks] = useState([]);
    const [typeBook, setTypeBook] = useState('');
    const [nameBook, setNameBook] = useState('');
    const listTypeBooks = ['novel', 'manga', 'comic', ''];

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
            : text + '..';
    }

    return (
        <div>
            <Find setname={setNameBook} />
            <TypesButtons type={typeBook} setType={setTypeBook} listButtons={listTypeBooks}/>

            <h1 className='font-black'>My book collection</h1>

            <div className='listBooks'>
                {books.length === 0 ? (
                    <div className='loading'>
                        <Progress value={33} />
                    </div>
                ) : (
                    <>

                        <div className="w-full flex flex-row justify-start m-6 ">
                            <Popover >
                                <PopoverTrigger asChild className="ml-30">
                                    <Button variant='destructive'>Add manual</Button>
                                </PopoverTrigger>
                                <PopoverContent className="max-h-180 overflow-y-auto w-64">
                                    <FormBooks />
                                </PopoverContent>
                            </Popover>

                            <Popover>
                                <PopoverTrigger asChild className="ml-20">
                                    <Button variant='destructive'>import book</Button>
                                </PopoverTrigger>
                                <PopoverContent className="max-h-170 overflow-y-auto w-150">
                                    <FormExternalBooks />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {books.map((book) => (
                            ((typeBook == book.type || typeBook == '') && (nameBook == '' || book.title.toLowerCase().includes(nameBook.toLowerCase()))) && (
                                <div key={book._id} className="w-full ml-30 flex flex-row">
                                    <Image
                                        src={
                                            book.image?.startsWith("http")
                                                ? book.image
                                                : `/books/${book.image || "default.jpg"}`
                                        }
                                        alt={book.title}
                                        width={150}
                                        height={200}
                                        className="rounded-lg mb-4 object-contain"
                                    />
                                    <div className='ml-4 mr-50 flex flex-col '>
                                        <h2>{book.title}</h2>
                                        <h3 className='text-[var(--color-redtext)]'>By {book.writer}</h3>
                                        <p className='text-sm text-gray-500 mt-3'>{truncateText(book.description, 300)} </p>
                                        {book.status == 'read' && (
                                            <ReactStars
                                                count={5}
                                                value={book.rating}
                                                size={24}
                                                edit={false} />
                                        )}
                                        <a href={`/books/${book._id}`} className="inline-block bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded w-25 mt-3">Ver más</a>
                                    </div>
                                    
                                </div>
                            )
                        ))}
                    </>

                )}

            </div>
        </ div>
    );
}