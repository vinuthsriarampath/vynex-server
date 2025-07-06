// import { authMiddleware } from "@/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // const authResponse = await authMiddleware(request)
    // if(authResponse){
    //     return authResponse
    // }
    return NextResponse.json("Test 123")
}