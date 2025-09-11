import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try{
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Authorization header is missing" }, { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");
        
        if (!token) {
            return NextResponse.json({ error: "No token found!" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const user = await prisma.user.findUnique({
            where: { id: typeof payload.id === 'number' ? payload.id : undefined },
            select: { id: true, email: true, first_name: true, last_name: true },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found signed to token" }, { status: 404 })
        }

        return NextResponse.json(user);
    }catch(error){
        return NextResponse.json({error:"Something went wrong!",details:error},{status:500})
    }
}