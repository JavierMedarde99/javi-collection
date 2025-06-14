'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function VideogamesPage() {

    const [videogames, setVideogames] = useState([]);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const res = await fetch('/api/videogames');
                const data = await res.json();
                setVideogames(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        }

        fetchBooks();
    }, []);

    return (
        <div>
            <h1 className='font-black'>My videogame collection</h1>

            <div className='list'>
                {videogames.length === 0 ? (
                    <div className='loading'>
                        <p>Loading...</p>
                    </div>
                ) : (
                    videogames.map((game) => (
                        <>
                            <div key={game._id}>
                                <Image
                                    src={
                                        game.image?.startsWith("http")
                                            ? game.image
                                            : `/videogames/${game.image || "default.jpg"}`
                                    }
                                    alt={game.title}
                                    width={150}
                                    height={200}
                                    className="gameImage"
                                />
                                <div className='ml-4 mr-50 flex flex-col '>
                                    <h2>{game.title}</h2>
                                    <p>{game.platform}</p>
                                    <a href={`/videogames/${game._id}`} className="inline-block bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded w-25 mt-3">Ver más</a>
                                </div>
                            </div>
                        </>
                    ))
                )}
            </div>
        </div>
    )
}