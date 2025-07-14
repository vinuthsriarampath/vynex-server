import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const projects = await prisma.project.findMany({
            orderBy:{
                updatedAt: "desc"
            }
        })
        if(!projects || projects.length==0){
            return NextResponse.json([],{status:200})
        }
        return NextResponse.json(projects,{status:200})
    }catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal server error!"},{status:500})
    }
}