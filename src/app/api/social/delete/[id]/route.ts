import { NextResponse, NextRequest } from "next/server";
import {prisma} from "@/lib/prisma";

export async function DELETE(
    request: NextRequest,
    context: { params: { id: string } }
) {
    // await the params before using
    const { id } = await context.params;

    const socialId = parseInt(id);

    try {
        await prisma.social.delete({ where: { id: socialId } });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
