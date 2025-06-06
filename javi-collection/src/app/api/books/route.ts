import fs from 'fs/promises';
import dbConnect from '@/lib/mongodb';
import Books from '@/lib/models/Books';
import { join } from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

async function GET() {

    try {
        await dbConnect();

        const books = await Books.find({});

        return new Response(JSON.stringify(books), {
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

async function POST(req: Request) {

    try {
        await dbConnect();
        const formData = await req.formData();
        const data = formData.get("data"); //json data
        const parsedData = data ? JSON.parse(data as string) : null;
        const image = formData.get("image") as File | null; // type: File

        const books = await Books.create({
            title: parsedData.title ?? '',
            writer: parsedData.writer ?? '',
            pages: parsedData.pages ?? '',
            initDate: parsedData.initDate ? parsedData.initDate : null,
            endDate: parsedData.endDate ? parsedData.endDate : null,
            rating: parsedData.rating ? parsedData.rating : null,
            review: parsedData.review ? parsedData.review : null,
            status: parsedData.status,
            type: parsedData.type,
            description: parsedData.description ?? '',
        });

        if (image) {
        const imageName = books._id.toString()+'.'+ image?.name.split('.').pop() as string;
        await Books.findByIdAndUpdate(books._id, { image: imageName });
        const destinationFolder = join(process.cwd(), 'public', 'books');
        const routeDestination = join(destinationFolder, imageName);
        const buffer = Buffer.from(await image.arrayBuffer());
        await fs.writeFile(routeDestination, buffer);
        }

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

export { GET, POST };