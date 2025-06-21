'use client';

import { Find } from '@/components/shared/InputFind';
import { TypesButtons } from '@/components/shared/typesButtons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FormVideogames } from './formVideogames';
import { IVideogames } from '@/lib/models/Videogames';
import { FormExternalVideogames } from './formExternalVideogames';
import ReactStars from "react-stars";

export default function VideogamesPage() {

    const [videogames, setVideogames] = useState([]);
    const [platform, setPlatform] = useState('');
    const [nameGame, setNameGame] = useState('');
    const listPlatforms = ['PC', 'PS2', 'PS3', 'Wii U', 'Switch', 'PSP', 'Nitendo DS', 'Nintendo 3DS', ''];

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
            <Find setname={setNameGame} />
            <TypesButtons type={platform} setType={setPlatform} listButtons={listPlatforms} />

            <h1 className='font-black'>My videogame collection</h1>

            <div className="w-full flex flex-row justify-start m-6 ">
                <Popover >
                    <PopoverTrigger asChild className="ml-30">
                        <Button variant='destructive'>Add manual</Button>
                    </PopoverTrigger>
                    <PopoverContent className="max-h-180 overflow-y-auto w-64">
                        <FormVideogames />
                    </PopoverContent>
                </Popover>
                <Popover >
                    <PopoverTrigger asChild className="ml-30">
                        <Button variant='destructive'>Add external</Button>
                    </PopoverTrigger>
                    <PopoverContent className="max-h-180 overflow-y-auto w-64">
                        <FormExternalVideogames />
                    </PopoverContent>
                </Popover>

            </div>
            <div className='list'>
                {videogames.length === 0 ? (
                    <div className='loading'>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        {videogames.map((game: IVideogames) => (
                            (platform === '' || game.platform.toLowerCase() === platform.toLowerCase()) &&
                            (nameGame === '' || game.title.toLowerCase().includes(nameGame.toLowerCase())) &&
                            <div key={String(game._id)}>
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
                                    {game.status == 'Completed' || game.status == 'Finished' && (
                                        <ReactStars
                                            count={5}
                                            value={game.rating}
                                            size={24}
                                            edit={false} />
                                    )}
                                    <a href={`/videogames/${game._id}`} className="inline-block bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded w-25 mt-3">Ver más</a>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}