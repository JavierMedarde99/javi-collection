import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Books from '@/lib/models/Books';

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
            label: info.volumeInfo.authors ? info.volumeInfo.title+ ", " +info.volumeInfo.authors : info.volumeInfo.title,
            value: JSON.stringify(info),
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

async function POST(req: NextRequest) {

    try {
        await dbConnect();
        const data = await req.text(); // get raw text body
        const parsedData = data ? JSON.parse(data) : null;
        const bookData = parsedData.book ? JSON.parse(parsedData.book as string) : null;

        await Books.create({
            title: bookData.volumeInfo.title ?? '',
            writer: bookData.volumeInfo.authors ? bookData.volumeInfo.authors[0] :'unknown',
            pages: bookData.volumeInfo.pageCount ?? 0,
            initDate: parsedData.initDate ? parsedData.initDate : null,
            endDate: parsedData.endDate ? parsedData.endDate : null,
            rating: parsedData.rating ? parsedData.rating : null,
            review: parsedData.review ? parsedData.review : null,
            status: parsedData.status,
            type: parsedData.type,
            image: bookData.volumeInfo.imageLinks?.smallThumbnail ?? null,
            description: bookData.volumeInfo.description ?? '',
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        return new Response(JSON.stringify("{error: internal error}"), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

}

export { GET,POST };