import {NextApiRequest} from 'next';
import dbConnect from '@/lib/mongodb';
import Books from '@/lib/models/Books';


async function GET() {

    try {
        await dbConnect();

        const books = await Books.find({});

        return new Response(JSON.stringify(books), {
            status: 200,
            headers:{ "Content-Type": "application/json" }
        });
    } catch (error) {

        console.error('Error fetching books:', error);
        return new Response(JSON.stringify("{error: internal error}"), {
            status: 500,
            headers:{ "Content-Type": "application/json" }
        });
    }
}

async function POST(req: NextApiRequest) {

    try {
        await dbConnect();

        const data = await req.json();

        await Books.create({
            title: data.title,
            writer: data.writer,
            pages: data.pages,
            initDate: data.initDate ? data.initDate : null,
            endDate: data.endDate ? data.endDate : null,
            rating: data.rating ? data.rating : null,
            review: data.review ? data.review : null,
            status: data.status,
            type: data.type,
            description: data.description
        });

        return new Response(JSON.stringify("{'success': 'inserted correctly'}"), {
            status: 200,
            headers:{ "Content-Type": "application/json" }
        });
    } catch (error) {

        console.log('Error fetching books:', error);
        return new Response(JSON.stringify("{'error': 'internal error'}"), {
            status: 500,
            headers:{ "Content-Type": "application/json" }
        });
    }
}

export { GET, POST};