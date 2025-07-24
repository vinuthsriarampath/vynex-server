import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(){
    try {
        const showCaseProjects = await prisma.project.findMany({
            where:{
                show_case: true,
            },
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

        if (!showCaseProjects || showCaseProjects.length === 0) {
            return NextResponse.json({error: "No showcase projects found"}, {status: 404});
        }

        return NextResponse.json(showCaseProjects, {status: 200});
    }catch (error){
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}