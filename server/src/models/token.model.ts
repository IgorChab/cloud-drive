import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, {Document} from 'mongoose'

export type TokenDocument = Token & Document;

@Schema()
export class Token{
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userID: string;

    @Prop()
    tokenHash: string;

    @Prop({type: Date, default: Date.now, expires:  30 * 24 * 60 * 60 * 1000})
    expire_at: Date
}

export const TokenSchema = SchemaFactory.createForClass(Token)