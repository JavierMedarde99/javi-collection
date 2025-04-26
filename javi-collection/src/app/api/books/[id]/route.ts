import {NextApiRequest} from 'next';
import dbConnect from '../../../../../lib/mongodb';
import Books from '../../../../../lib/models/Books';

async function DELETE(req: NextApiRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();

        const { id } = await params;

        await Books.findByIdAndDelete(id);

        return new Response(JSON.stringify("{'success': 'deleted correctly'}"), {
            status: 200,
            headers:{ "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error('Error deleting book:', error);
        return new Response(JSON.stringify("{'error': 'internal error'}"), {
            status: 500,
            headers:{ "Content-Type": "application/json" }
        });
    }
    
}

async function PUT(req: NextApiRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();

        const { id } = await params;
        const data = await req.json();

        await Books.findByIdAndUpdate(id, {
            title: data.title,
            writer: data.writer,
            pages: data.pages,
            initDate: data.initDate,
            endDate: data.endDate ? data.endDate : null,
            rating: data.rating ? data.rating : null,
            review: data.review ? data.review : null,
            status: data.status,
            type: data.type,
        });

        return new Response(JSON.stringify("{'success': 'updated correctly'}"), {
            status: 200,
            headers:{ "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error('Error updating book:', error);
        return new Response(JSON.stringify("{'error': 'internal error'}"), {
            status: 500,
            headers:{ "Content-Type": "application/json" }
        });
    }
}

export { DELETE, PUT};