import { Schema, Prop, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document, ObjectId} from 'mongoose'

export type FolderDocument = Folder & Document

@Schema()
export class Folder {
    @Prop({isRequired: true})
    name: string
    
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userID: number

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'File', default: []})
    files: ObjectId[]

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Folder'})
    parentFolder: number

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'Folder', default: []})
    childFolder: ObjectId[]

    @Prop({default: 0})
    size: number

    @Prop()
    path: string

    @Prop({type: Date, default: Date.now})
    date: string
}

export const FolderSchema = SchemaFactory.createForClass(Folder)