import mongoose, { Schema, Document } from 'mongoose';

export interface IBooks extends Document {
    title: string;
    writer: string;
    pages: number;
    description: string;
    initDate: Date;
    endDate?: Date;
    rating?: number;
    review?: string;
    status: string;
    type: string;
    image?: string;
}

const BooksSchema: Schema = new Schema({
    title: { type: String, required: true,},
    writer: { type: String, required: true, },
    pages: { type: Number, required: true, },
    description: { type: String, required: true, },
    initDate: { type: Date, required: false, },
    endDate: { type: Date, required: false, },
    rating: { type: Number, required: false, },
    review: { type: String, required: false, },
    status: { type: String, required: true, },
    type: { type: String, required: true, },
    image: { type: String, required: false, },
});

const Books = mongoose.models.Books || mongoose.model<IBooks>('Books', BooksSchema);

export default Books;