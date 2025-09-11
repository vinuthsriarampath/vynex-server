import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SocialValidationSchema } from "@/lib/validations/social-validation";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // 👈 params is async
) {
    const { id } = await params; // 👈 must await
    const socialId = parseInt(id, 10);

    try {
        const social = await prisma.social.findUnique({ where: { id: socialId } });
        if (!social) {
            return NextResponse.json({ error: "Social account not found!" }, { status: 404 });
        }

        const { url, platform, username } = await request.json();
        const validationResult = SocialValidationSchema.safeParse({ url, platform, username });

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err: any) => ({
                field: err.path.join("."),
                message: err.message,
            }));
            return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
        }

        const updateSocial = await prisma.social.update({
            where: { id: socialId },
            data: validationResult.data,
        });

        return NextResponse.json(
            { message: "Social account updated successfully!", social: updateSocial },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: "Failed to update",details:error }, { status: 500 });
    }
}
