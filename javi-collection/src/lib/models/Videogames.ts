import mongoose, { Schema, Document } from 'mongoose';

export interface IVideogames extends Document {
    title: string;
    duration?: number;
    released: Date;
    description: string;
    platform: string;
    status: string;
    image?: string;
    initDate?: Date;
    endDate?: Date;
    rating?: number;
    review?: string;
}

const VideogamesSchema: Schema = new Schema({
    title: { type: String, required: true,},
    duration: { type: Number, required: false, },
    released: { type: Date, required: true, },
    initDate: { type: Date, required: false, },
    endDate: { type: Date, required: false, },
    rating: { type: Number, required: false, },
    review: { type: String, required: false, },
    status: { type: String, required: true, },
    platform: { type: String, required: true, },
    image: { type: String, required: false, },
    description: { type: String, required: true, },
});

const Books = mongoose.models.Videogames || mongoose.model<IVideogames>('Videogames', VideogamesSchema);

export default Books;