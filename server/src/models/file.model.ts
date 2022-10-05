import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose'
import mongoose, {Document} from 'mongoose'

export type FileDocument = File & Document

@Schema()
export class File {
    @Prop({isRequired: true})
    name: string

    @Prop()
    type: string

    @Prop()
    path: string

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userID: number

    @Prop({default: 0})
    size: number

    @Prop({type: Date, default: Date.now})
    date: string
}

export const FileSchema = SchemaFactory.createForClass(File)