import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";

const prisma = new PrismaClient();

interface JwtPayload {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
}

export async function authMiddleware(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
            { error: "Authorization header missing or invalid" },
            { status: 401 }
        );
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        // Verify JWT token
        const payload = verify(token, process.env.NEXTAUTH_URL as string) as JwtPayload;

        // Verify user exists in database
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        // Attach user to request for downstream use
        (request as any).user = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
        };

        return null; // Proceed to the next handler
    } catch (error) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
}