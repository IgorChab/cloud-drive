import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document, ObjectId} from 'mongoose'

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    // @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'File', default: []})
    // files: ObjectId[]

    // @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'Folder', default: []})
    // folders: ObjectId[]

    @Prop({default: 2147483648})
    availableSpace: number

    @Prop({default: 0})
    usedSpace: number
}

export const UserSchema = SchemaFactory.createForClass(User)