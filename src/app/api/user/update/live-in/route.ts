import { prisma } from "@/lib/prisma";
import { PersonalLiveInValidationSchema } from "@/lib/validations/personal-live-in";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request:NextRequest) {
    try {
        const userid = request.headers.get('x-user-id');

        if (userid) {
            const { address,postal_code } = await request.json();

            const validationResult = PersonalLiveInValidationSchema.safeParse({ address,postal_code })

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
                    address: true,
                    postal_code: true,
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