import { prisma } from "@/lib/prisma";
import { PersonalBioValidationSchema } from "@/lib/validations/perosnal-bio";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request:NextRequest) {
    try {
        const userid = request.headers.get('x-user-id');

        if (userid) {
            const { bio } = await request.json();

            const validationResult = PersonalBioValidationSchema.safeParse({ bio })

            if (!validationResult.success) {
                const errors = validationResult.error.issues.map((err: any) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
            }

            const data = validationResult.data;

            const user = await prisma.user.findUnique({
                where: {
                    id: parseInt(userid)
                }
            })
            if (!user) {
                return NextResponse.json({ error: "User Id not found!" }, { status: 404 });
            }
            const updateUser = await prisma.user.update({
                where: {
                    id: user.id
                },
                data,
                select: {
                    bio: true,
                }
            })
            return NextResponse.json(updateUser, { status: 200 });
        } else {
            return NextResponse.json({ error: "User Id not found in the request header!" }, { status: 422 });
        }
    } catch (error) {
        return NextResponse.json("Internal Server Error", { status: 500 })
    }
}