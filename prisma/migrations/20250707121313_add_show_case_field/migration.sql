-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "show_case" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "project_name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
