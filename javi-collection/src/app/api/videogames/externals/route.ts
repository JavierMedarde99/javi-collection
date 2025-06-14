import { NextRequest } from "next/server";

const VIDEOGAMES_CLIENT_ID = process.env.VIDEOGAMES_CLIENTE_ID as string;
const VIDEOGAMES_CLIENT_SECRET = process.env.VIDEOGAMES_CLIENTE_SECRET as string;

const getBearerToken = async () => {
    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${VIDEOGAMES_CLIENT_ID}&client_secret=${VIDEOGAMES_CLIENT_SECRET}&grant_type=client_credentials`,{
        method: "POST",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch Bearer Token");
    }
    const data = await res.json();
    return data.access_token;
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

        const listVideogamesSelect = data.map((info: any) => ({
            label: info.name,
            value: info,
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

export { GET };