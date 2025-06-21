import Videogames from '@/lib/models/Videogames';
import dbConnect from "@/lib/mongodb";
import { NextRequest } from "next/server";

const VIDEOGAMES_CLIENT_ID = process.env.VIDEOGAMES_CLIENTE_ID as string;
const VIDEOGAMES_CLIENT_SECRET = process.env.VIDEOGAMES_CLIENTE_SECRET as string;

const getBearerToken = async () => {
    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${VIDEOGAMES_CLIENT_ID}&client_secret=${VIDEOGAMES_CLIENT_SECRET}&grant_type=client_credentials`, {
        method: "POST",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch Bearer Token");
    }
    const data = await res.json();
    return data.access_token;
}

const getVideogameDuration = async (gameId: number, bearerToken: string) => {
    const res = await fetch("https://api.igdb.com/v4/game_time_to_beats", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Client-ID": VIDEOGAMES_CLIENT_ID,
            "Authorization": `Bearer ${bearerToken}`,
        },
        body: `fields normally; where game_id = ${gameId};`
    });

    if (!res.ok) {
        throw new Error("Failed to fetch game duration");
    }

    const data = await res.json();
    return data.length > 0 ? data[0].normally : null;
}

async function GET(request: NextRequest) {

    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('search');

        const bearerToken = await getBearerToken();

        if (bearerToken === undefined || bearerToken === null) {
            return new Response(JSON.stringify("{error: error to get Bearer Token}"), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const res = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Client-ID": VIDEOGAMES_CLIENT_ID,
                "Authorization": `Bearer ${bearerToken}`,
            },
            body: `search "${query}"; fields name, summary, cover.url, first_release_date; limit 5;`
        });

        if (!res.ok) {
            return new Response(JSON.stringify("{error: error to call RAWG API}"), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
        const data = await res.json();

        const fullData = await Promise.all(
            data.map(async (item: any) => {
                try {
                    const duration = await getVideogameDuration(item.id, bearerToken);
                    return {
                        ...item,
                        duration,
                    };
                } catch (error) {
                    console.error(`Error fetching duration for game ID ${item.id}:`, error);
                    return {
                        ...item,
                        duration: null,
                    };
                }
            })
        );

        const listVideogamesSelect = fullData.map((info: any) => ({
            label: info.name,
            value: JSON.stringify(info),
        })) ?? [];

        return new Response(JSON.stringify(listVideogamesSelect), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {

        console.error('Error fetching videogames:', error);
        return new Response(JSON.stringify("{error: internal error}"), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const data = await request.text(); // get raw text body
        const parsedData = data ? JSON.parse(data) : null;
        const videogameData = parsedData.videogame;

        await Videogames.create({
            title: videogameData.name ?? '',
            description: videogameData.summary ?? '',
            duration: videogameData.duration ? (videogameData.duration / 60) : null,
            released: videogameData.first_release_date ? new Date(videogameData.first_release_date * 1000) : null,
            image: videogameData.cover.url ? `https:${videogameData.cover.url}` : null,
            initDate: parsedData.initDate ? parsedData.initDate : null,
            endDate: parsedData.endDate ? parsedData.endDate : null,
            rating: parsedData.rating ? parsedData.rating : null,
            review: parsedData.review ? parsedData.review : null,
            status: parsedData.status,
            platform: parsedData.platform,
        });
        return new Response(JSON.stringify({ message: "Videogame added successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error('Error adding videogame:', error);
        return new Response(JSON.stringify("{error: internal error}"), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

}

export { GET, POST };