'use client';

import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image'
import { useEffect, useState, use, useMemo } from 'react';
import { FormBooks } from '../formBooks';
import ReactStars from 'react-stars';
import { Button } from '@/components/ui/button';

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
                    <div className='flex flex-col items-center justify-center p-4 m-20'>
                        <div className='flex flex-row '>
                            <div className='mr-4'>
                                <h1 className='font-black'>{book.title}</h1>
                                <h3 className='text-[var(--color-redtext)]'>By {book.writer}</h3>
                                <p className='mt-4'>Summary</p>
                                <p className='text-[var(--color-redtext)]'>{book.description}</p>
                            </div>
                            <Image src={
                                book.image?.startsWith("http")
                                    ? book.image
                                    : `/books/${book.image || "default.jpg"}`
                            } alt={book.title} width={500} height={300} />
                        </div>
                        <div className='flex flex-row justify-evenly w-full mt-10 border-t-2 border-gray-200 border-solid'>
                            <p><span className='text-[var(--color-redtext)]'>pages</span> <br /> {book.pages}</p>
                            <p><span className='text-[var(--color-redtext)]'>type</span> <br /> {book.type}</p>
                            <p><span className='text-[var(--color-redtext)]'>status</span> <br /> {book.status}</p>
                        </div>

                        {book.status == 'reading' && (
                            <div className='flex flex-row justify-evenly w-full mt-10 border-t-2 border-gray-200 border-solid'>
                                <p><span className='text-[var(--color-redtext)]'>start to read</span> <br /> {book.initDate.split('T')[0]}</p>
                            </div>
                        )}

                        {book.status == 'read' && (
                            <>
                                <div className='flex flex-row justify-evenly w-full mt-10 border-t-2 border-gray-200 border-solid'>
                                    <p><span className='text-[var(--color-redtext)]'>start to read</span> <br /> {book.initDate.split('T')[0]}</p>
                                    <p><span className='text-[var(--color-redtext)]'>end to read</span> <br /> {book.endDate.split('T')[0]}</p>
                                    <div><span className='text-[var(--color-redtext)]'>rating</span>
                                        <ReactStars
                                            count={5}
                                            value={book.rating}
                                            size={24}
                                            edit={false} /></div>
                                </div>
                                <div className='flex flex-col w-full mt-10 border-t-2 border-gray-200 border-solid'>
                                    <p className='mt-4'>Review</p>
                                    <p className='text-[var(--color-redtext)]'>{book.review}</p>
                                </div>
                                
                            </>
                        )}

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild ><Button variant='destructive'>Update Book</Button></DialogTrigger>
                            <DialogContent >
                                <DialogTitle>Update Book</DialogTitle>
                                <FormBooks bookValue={bookMemo} />
                            </DialogContent>
                        </Dialog>
                    </div>
                )
            }
        </>

    )
}