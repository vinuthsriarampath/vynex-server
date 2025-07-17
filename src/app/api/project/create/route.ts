import { prisma } from "@/lib/prisma";
import { Project } from "@/types/project";
import { NextRequest, NextResponse } from "next/server";
import { ProjectValidationSchema, validateProjectBusinessRules } from "@/lib/validations/project";


export async function POST(request: NextRequest) {
    try {
        const projectData = await request.json();
        
        const validationResult = ProjectValidationSchema.safeParse(projectData);
        
        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message
            }));
            
            return NextResponse.json({
                error: "Validation failed",
                details: errors
            }, { status: 400 });
        }
        
        const validatedData = validationResult.data;
        
        const businessRuleErrors = validateProjectBusinessRules(validatedData);
        if (businessRuleErrors.length > 0) {
            return NextResponse.json({
                error: "Business rule validation failed",
                details: businessRuleErrors
            }, { status: 400 });
        }
        
        const mappedProject: Project = {
            project_name: validatedData.project_name,
            show_case : validatedData.show_case,
            repo_id: validatedData.repo_id,
            repo_name: validatedData.repo_name,
            html_url: validatedData.html_url,
            clone_url: validatedData.clone_url,
            description: validatedData.description || undefined,
            language: validatedData.language || undefined,
            status: validatedData.status,
            createdAt: validatedData.createdAt,
            updatedAt: validatedData.updatedAt,
        };

        const existingProject = await prisma.project.findUnique({
            where:{
                repo_id:mappedProject.repo_id,
                repo_name:mappedProject.repo_name,
                project_name:mappedProject.project_name
            }
        });

        if(existingProject){
            return NextResponse.json({error:"Project Already Exists !!"},{status:409});
        }

        const newProject = await prisma.project.create({
            data:mappedProject
        });

        if(!newProject){
            return NextResponse.json({error:"Failed to create the project !!"},{status:400})
        }
        return NextResponse.json({project:newProject},{status:200})
    }catch(error){
        return NextResponse.json({error:"Internal Server Error"},{status:500})
    }
}