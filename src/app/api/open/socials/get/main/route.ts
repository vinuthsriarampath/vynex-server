import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {Platform} from "@prisma/client";

export async function GET(request:NextRequest){
    try {
        const platform = request.nextUrl.searchParams.get("platform");
        if (platform===null){
            return NextResponse.json({error:"Platform is invalid"},{status:400})
        }else{
            const social = await prisma.social.findFirst({
                where:{
                    priority:1,
                    platform:platform.toUpperCase() as Platform,
                },
                select:{
                    id:true,
                    url:true,
                    platform:true,
                    username:true,
                }
            })
            if (social){
                return NextResponse.json({social:social},{status:200})
            }
            return NextResponse.json({error:"No Social Found"},{status:404})
        }
    }catch (error){
        return NextResponse.json({error:error},{status:500})
    }
}