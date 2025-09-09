import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {SocialValidationSchema} from "@/lib/validations/social-validation";

export async function PATCH(request:NextRequest,{params}: {params:{ id : string }}){
    const socialId = parseInt(params.id);
    try {
        const social=await prisma.social.findUnique({
            where:{
                id:socialId
            }
        })
        if (!social){
            return NextResponse.json({error:"Social account not found!"},{status:404})
        }

        const {url,platform,username} = await request.json();
        const validationResult = SocialValidationSchema.safeParse({url,platform,username});

        if(!validationResult.success){
            const errors = validationResult.error.issues.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message
            }));

            return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
        }

        const data = validationResult.data;

        const updateSocial = await prisma.social.update({
            where:{
                id:socialId
            },
            data:{
                platform:data.platform,
                url:data.url,
                username:data.username,
            }
        });

        if (!updateSocial){
            return NextResponse.json({error:"Something went wrong!"},{status:500})
        }else{
            return NextResponse.json({message:"Social account updated successfully!",social:updateSocial},{status:200})
        }

    }catch (error){
        return NextResponse.json({error:error},{status:500})
    }
}