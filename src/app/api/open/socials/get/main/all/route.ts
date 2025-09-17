import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(request: NextRequest){
    try {
        const socials =  await prisma.social.findMany({
            where:{
                priority:1,
            },
            select:{
                id:true,
                url:true,
                platform:true,
                username:true,
            }
        })

        return NextResponse.json({socials},{status:200})
    }catch (error){
        return NextResponse.json({error:error},{status:500})
    }
}