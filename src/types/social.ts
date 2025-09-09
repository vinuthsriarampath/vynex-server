import {Platform} from "@prisma/client";

export interface Social{
    id?:number,
    userId:number,
    platform:Platform,
    url:string,
    username:string,
    priority:number,
    createdAt?:Date,
    updatedAt?:Date
}