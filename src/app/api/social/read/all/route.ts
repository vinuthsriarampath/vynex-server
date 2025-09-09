import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(){
    try{
        const socials = await prisma.social.findMany({
            orderBy:[
                {priority: 'asc'},
                {platform: 'asc'},
            ],
        })
        return NextResponse.json({socials},{status:200})
    }catch (error){
        return NextResponse.json({error:error},{status:500})
    }
}