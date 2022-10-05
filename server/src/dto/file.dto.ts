import {Prop} from "@nestjs/mongoose";
import mongoose from "mongoose";

export class FileCreationDto {
    name: string

    type: string

    path: string

    userID: number

    size: number
}