import { prisma } from "@/lib/prisma";
import { PersonalInfoValidationSchema } from "@/lib/validations/personal-info";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    try {
        const userid = request.headers.get('x-user-id');

        if (userid) {
            const { first_name, last_name, contact } = await request.json();

            const validationResult = PersonalInfoValidationSchema.safeParse({ first_name, last_name, contact })

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
                    first_name: true,
                    last_name: true,
                    contact: true,
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