import { NextApiRequest } from 'next';
import dbConnect from '@/lib/mongodb';
import Books from '@/lib/models/Books';
import { join } from 'path';
import fs from 'fs/promises';

async function DELETE(req: NextApiRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();

        const { id } = await params;

        await Books.findByIdAndDelete(id);

        return new Response(JSON.stringify("{'success': 'deleted correctly'}"), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error('Error deleting book:', error);
        return new Response(JSON.stringify("{'error': 'internal error'}"), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

}

async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();

        
        console.log('params', params);

        const { id } = await params;
        
        const formData = await req.formData();
        const data = formData.get("data"); //json data
        const parsedData = data ? JSON.parse(data as string) : null;
        const image = formData.get("image") as File | null; // type: File
        let imageName = null;


        if (image) {
            imageName = id + '.' + image?.name.split('.').pop() as string;
            const destinationFolder = join(process.cwd(), 'public', 'books');
            const routeDestination = join(destinationFolder, imageName);
            const buffer = Buffer.from(await image.arrayBuffer());
            await fs.writeFile(routeDestination, buffer);
        }

        await Books.findByIdAndUpdate(id, {
            title: parsedData.title,
            writer: parsedData.writer,
            pages: parsedData.pages,
            initDate: parsedData.initDate ? parsedData.initDate : null,
            endDate: parsedData.endDate ? parsedData.endDate : null,
            rating: parsedData.rating ? parsedData.rating : null,
            review: parsedData.review ? parsedData.review : null,
            status: parsedData.status,
            type: parsedData.type,
            description: parsedData.description,
            image: imageName ? imageName : null
        });

        return new Response(JSON.stringify("{'success': 'updated correctly'}"), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error('Error updating book:', error);
        return new Response(JSON.stringify("{'error': 'internal error'}"), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

async function POST(req: NextApiRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();

        console.log('params', params);

        const { id } = await params;

        const book = await Books.findById(id);

        return new Response(JSON.stringify(book), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error('Error updating book:', error);
        return new Response(JSON.stringify("{'error': 'internal error'}"), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export { DELETE, PUT, POST };