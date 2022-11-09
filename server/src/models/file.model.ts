import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose'
import mongoose, {Document, ObjectId} from 'mongoose'
import { IUser } from 'src/interfaces/user.interface'

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
    userID: string | IUser

    @Prop({default: 0})
    size: number

    @Prop({type: Date, default: Date.now})
    date: string

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'File', default: []})
    childs: string[]

    @Prop()
    shareLink: string

    @Prop()
    tag: string
}

export const FileSchema = SchemaFactory.createForClass(File)