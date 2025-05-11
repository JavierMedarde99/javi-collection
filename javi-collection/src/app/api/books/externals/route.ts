import { NextRequest } from 'next/server';

const GOOGLE_BOOK_KEY = process.env.GOOGLE_BOOK_KEY as string;

async function GET(request: NextRequest) {

    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('search');

        console.log(GOOGLE_BOOK_KEY);

        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&fields=items(volumeInfo/title,volumeInfo/authors,volumeInfo/description,volumeInfo/pageCount,volumeInfo/imageLinks/smallThumbnail)&key=${GOOGLE_BOOK_KEY}&maxResults=10`)

        if (!res.ok) {
            return new Response(JSON.stringify("{error: error to call Google API Book}"), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const data = await res.json();

        const listBooksSelect = data.items?.map((info) => ({
            text: info.volumeInfo.title,
            image: info.volumeInfo.imageLinks?.smallThumbnail ?? '',
            value: info
        })) ?? [];

        return new Response(JSON.stringify(listBooksSelect), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {

        console.error('Error fetching books:', error);
        return new Response(JSON.stringify("{error: internal error}"), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export { GET };