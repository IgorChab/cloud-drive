import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

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

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'File'})
    files: [number]

    @Prop({default: 2147483648})
    availableSpace: number
}

export const UserSchema = SchemaFactory.createForClass(User)