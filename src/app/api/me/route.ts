import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    const userid=request.headers.get('x-user-id');
    try{
        if(userid){
            const user = await prisma.user.findUnique({
                where:{
                    id:parseInt(userid)
                }
            })
            if(!user){
                return NextResponse.json({error:"User Id not found in the request header!"},{status:422});
            }
            return NextResponse.json(user,{status:200});
        }else{
            return NextResponse.json({error:"User Id not found in the request header!"},{status:422});
        }
    }catch(error){
        return NextResponse.json({error:"Internal Server Error"},{status:500})
    }
}