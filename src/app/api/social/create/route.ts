import {NextRequest, NextResponse} from "next/server";
import {SocialValidationSchema} from "@/lib/validations/social-validation";
import {prisma} from "@/lib/prisma";
import {Social} from "@/types/social";

export async function POST(request:NextRequest){
    try{
        const userid = request.headers.get('x-user-id');
        if(!userid){
            return NextResponse.json({error:"Invalid user id"},{status:400})
        }
        const {url,platform,username,priority} = await request.json();

        const validationResult = SocialValidationSchema.safeParse({url,priority,platform,username});

        if(!validationResult.success){
            const errors = validationResult.error.issues.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message
            }));

            return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
        }

        const data = validationResult.data;

        const mappedSocial:Social ={
            platform:data.platform,
            url:data.url,
            username:data.username,
            priority:2,
            userId:parseInt(userid)
        }

        // Check if the social link already exists for the user
        const existingSocial = await prisma.social.findFirst({
            where:{
                userId:mappedSocial.userId,
                platform:mappedSocial.platform,
                url:mappedSocial.url,
                username:mappedSocial.username,
            }
        })

        if(existingSocial){
            return NextResponse.json({error:"Social Link Already Exists !!"},{status:409});
        }

        const platformSocials = await prisma.social.findMany({
            where:{
                userId:parseInt(userid),
                platform:mappedSocial.platform
            },
            orderBy:{
                priority:'asc'
            }
        })

        if(platformSocials.length === 0) mappedSocial.priority = 1;


        const social = await prisma.social.create({
            data: {
                platform: mappedSocial.platform,
                url: mappedSocial.url,
                username: mappedSocial.username,
                priority: mappedSocial.priority,
                userId: parseInt(userid)
            }
        })
        return NextResponse.json({message: "Social link stored successfully",social:social},{status:201});
    }catch (error){
        return NextResponse.json({error:error}, {status: 500});
    }
}