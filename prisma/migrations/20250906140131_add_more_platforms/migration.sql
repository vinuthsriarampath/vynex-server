-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Platform" ADD VALUE 'YOUTUBE';
ALTER TYPE "Platform" ADD VALUE 'TIKTOK';
ALTER TYPE "Platform" ADD VALUE 'REDDIT';
ALTER TYPE "Platform" ADD VALUE 'PINTEREST';
ALTER TYPE "Platform" ADD VALUE 'SNAPCHAT';
ALTER TYPE "Platform" ADD VALUE 'MEDIUM';
ALTER TYPE "Platform" ADD VALUE 'STACKOVERFLOW';
ALTER TYPE "Platform" ADD VALUE 'GITLAB';
ALTER TYPE "Platform" ADD VALUE 'BITBUCKET';
ALTER TYPE "Platform" ADD VALUE 'DRIBBBLE';
ALTER TYPE "Platform" ADD VALUE 'BEHANCE';
