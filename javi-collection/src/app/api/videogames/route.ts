
import dbConnect from '@/lib/mongodb';
import Videogames from '@/lib/models/Videogames';
import fs from 'fs/promises';
import { join } from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

async function GET() {

    try {
        await dbConnect();

        const videogames = await Videogames.find({});

        return new Response(JSON.stringify(videogames), {
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

        const videogame = await Videogames.create({
            title: parsedData.title ?? '',
            duration: parsedData.duration ?? 0,
            released: parsedData.released ? new Date(parsedData.released) : new Date(),
            initDate: parsedData.initDate ? new Date(parsedData.initDate) : null,
            endDate: parsedData.endDate ? new Date(parsedData.endDate) : null,
            rating: parsedData.rating ? parsedData.rating : null,
            review: parsedData.review ? parsedData.review : null,
            status: parsedData.status,
            platform: parsedData.platform,
        });

        if (image) {
        const imageName = videogame._id.toString()+'.'+ image?.name.split('.').pop() as string;
        await videogame.findByIdAndUpdate(videogame._id, { image: imageName });
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
        console.error('Error fetching videogame:', error);
        return new Response(JSON.stringify("{error: internal error}"), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export { POST,GET };
