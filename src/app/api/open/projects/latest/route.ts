import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(request:NextRequest){
    try {
        const limit = request.nextUrl.searchParams.get("limit");

        const parsedLimit = limit ? parseInt(limit) : 10;

        if (isNaN(parsedLimit) || parsedLimit <= 0) {
            return NextResponse.json({error: "Invalid limit parameter"}, {status: 400});
        }

        const latestProjects = await prisma.project.findMany({
            where:{
                show_case: true,
            },
            orderBy:{
                createdAt: 'desc'
            },
            take: parsedLimit,
            select:{
                id:true,
                project_name:true,
                html_url:true,
                description:true,
                language:true,
                thumbnail: true,
                status:true,
            }
        });

        if (!latestProjects || latestProjects.length === 0) {
            return NextResponse.json({error: "No projects found"}, {status: 404});
        }

        return NextResponse.json(latestProjects, {status: 200});
    }catch (error) {
        return NextResponse.json({error: error}, {status: 500});
    }
}