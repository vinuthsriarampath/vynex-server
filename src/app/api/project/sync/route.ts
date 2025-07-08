import { prisma } from "@/lib/prisma";
import { Project } from "@/types/project";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const projects: Project[] = await request.json();

  if (!projects || !Array.isArray(projects)) {
    return NextResponse.json(
      { error: "Projects array is required" },
      { status: 400 }
    );
  }

  const newRepos: Project[] = [];

  try {
    for (const project of projects) {
      if (!project.repo_id || typeof project.repo_id !== "number") {
        
        continue;
      }
      const foundRepo = await prisma.project.findUnique({
        where: {
          repo_id: project.repo_id,
        },
      });
      if (foundRepo && foundRepo.repo_id === project.repo_id) {
        continue;
      }
      try {
        const createdProject = await prisma.project.create({
          data: {
            repo_id: project.repo_id,
            project_name: project.repo_name,
            repo_name: project.repo_name,
            html_url: project.html_url,
            description: project.description || "",
            language: project.language,
            clone_url: project.clone_url,
            status: project.status,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
          },
        });

        newRepos.push({
          ...createdProject,
          project_name: createdProject.project_name || createdProject.repo_name,
          language: createdProject.language || "",
          description: createdProject.description || "",
          status: createdProject.status as "in-progress" | "done",
        });
      } catch (error) {
        return NextResponse.json( { error: "Unable to create project" }, { status: 500 } );
      }
    }
    return NextResponse.json({ newRepos }, { status: 201 });
  } catch (error) {
    return NextResponse.json( { error: "Something Went Wrong!" },  { status: 500 } );
  }
}
