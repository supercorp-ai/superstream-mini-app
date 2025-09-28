-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "streamedMinutesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "streamedMinutesCountLastUpdated" TIMESTAMP(3);
