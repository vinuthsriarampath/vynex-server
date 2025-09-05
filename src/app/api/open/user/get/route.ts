import {prisma} from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request:NextRequest){
    try {
        const userid=request.nextUrl.searchParams.get("userId");
        let parsedUserId:number;

        if(!userid){
            return NextResponse.json({error:"User Id not found in the request header!"},{status:404});
        }else {
            parsedUserId = parseInt(userid);
            if (isNaN(parsedUserId) || parsedUserId <= 0) {
                return NextResponse.json({error: "Invalid user id parameter"}, {status: 400});
            }
        }

        const user = await prisma.user.findUnique({
            where:{
                id:parsedUserId,
            },
            select:{
                id:true,
                first_name:true,
                last_name:true,
                email:true,
                contact:true,
                address:true,
                postal_code:true,
                bio:true,
                avatar:true,
                createdAt:true,
            }
        })

        if(!user){
            return NextResponse.json({error:"User not found!"},{status:404});
        }else{
            return NextResponse.json(user,{status:200} );
        }

    }catch (e) {
        NextResponse.json({error:e},{status:500});
    }
}