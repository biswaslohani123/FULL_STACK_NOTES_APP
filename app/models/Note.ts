import mongoose, { Document, Model, Schema } from "mongoose";

export interface INote extends Document {

    title: string;
    content: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;

}

const noteSchema = new Schema<INote> ({

    title: {type: String, required: [true, "Title is required"], trim: true},

    content: {type: String, required: [true, "Content is required"], trim: true},

    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true}

}, {timestamps: true});

const Notes: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', noteSchema)

export default Notes;