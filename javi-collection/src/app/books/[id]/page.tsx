'use client';

import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image'
import { useEffect, useState, use, useMemo } from 'react';
import { FormBooks } from '../formBooks';

export default function BookPage({ params }: { params: Promise<{ id: string }> }) {

    const paramsResolved = use(params);

    const [book, setBook] = useState([]);
    const [open, setOpen] = useState(false);

    const bookMemo = useMemo(() => book, [book]);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const res = await fetch('/api/books/' + paramsResolved.id, {
                    method: 'POST',
                });
                const data = await res.json();
                setBook(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        }
        fetchBooks();
    }, [paramsResolved.id]);

    return (
        <>
            {
                book.length === 0 ? (
                    <p>Cargando libro...</p>
                ) : (
                    <div>
                        <h1>{book.title}</h1>
                        <Image src={
                            book.image?.startsWith("http")
                                ? book.image
                                : `/books/${book.image || "default.jpg"}`
                        } alt={book.title} width={200} height={300} />
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

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger>Update</DialogTrigger>
                            <DialogContent >
                                <DialogTitle>Update Book</DialogTitle>
                                <DialogDescription>
                                    Update the book information.
                                </DialogDescription>
                                <FormBooks bookValue={bookMemo} />
                            </DialogContent>
                        </Dialog>
                    </div>
                )
            }
        </>

    )
}