-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "agent_message_role" AS ENUM ('user', 'assistant');

-- CreateEnum
CREATE TYPE "agent_lead_request_type" AS ENUM ('CONSULTATION', 'QUOTE', 'SUPPORT', 'APPOINTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "agent_lead_status" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED');

-- CreateEnum
CREATE TYPE "agent_booking_status" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "agent_conversations" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "language" TEXT,
    "leadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "agent_message_role" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "email" TEXT,
    "companyName" TEXT,
    "requestType" "agent_lead_request_type" NOT NULL,
    "projectType" TEXT,
    "projectDescription" TEXT,
    "requirements" TEXT,
    "existingSystem" TEXT,
    "budgetRange" TEXT,
    "expectedStart" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentAt" TIMESTAMP(3),
    "status" "agent_lead_status" NOT NULL DEFAULT 'NEW',
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_bookings" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" "agent_booking_status" NOT NULL DEFAULT 'PENDING',
    "customerNote" TEXT,
    "decidedAt" TIMESTAMP(3),
    "alternativeProposal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_availability_rules" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_availability_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_blocked_dates" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_blocked_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_processed_webhook_events" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_processed_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agent_conversations_sessionId_key" ON "agent_conversations"("sessionId");

-- CreateIndex
CREATE INDEX "agent_conversations_leadId_idx" ON "agent_conversations"("leadId");

-- CreateIndex
CREATE INDEX "agent_conversations_createdAt_idx" ON "agent_conversations"("createdAt");

-- CreateIndex
CREATE INDEX "agent_messages_conversationId_idx" ON "agent_messages"("conversationId");

-- CreateIndex
CREATE INDEX "agent_messages_conversationId_createdAt_idx" ON "agent_messages"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "agent_leads_status_createdAt_idx" ON "agent_leads"("status", "createdAt");

-- CreateIndex
CREATE INDEX "agent_leads_whatsappNumber_idx" ON "agent_leads"("whatsappNumber");

-- CreateIndex
CREATE INDEX "agent_bookings_leadId_idx" ON "agent_bookings"("leadId");

-- CreateIndex
CREATE INDEX "agent_bookings_startsAt_status_idx" ON "agent_bookings"("startsAt", "status");

-- Partial Unique Index: prevents double-booking on active (PENDING / CONFIRMED) slots
CREATE UNIQUE INDEX "agent_bookings_startsAt_active_key"
ON "agent_bookings"("startsAt")
WHERE "status" IN ('PENDING', 'CONFIRMED');

-- CreateIndex
CREATE INDEX "agent_availability_rules_dayOfWeek_active_idx" ON "agent_availability_rules"("dayOfWeek", "active");

-- CreateIndex
CREATE UNIQUE INDEX "agent_availability_rules_dayOfWeek_startTime_endTime_key" ON "agent_availability_rules"("dayOfWeek", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "agent_blocked_dates_date_key" ON "agent_blocked_dates"("date");

-- CreateIndex
CREATE INDEX "agent_processed_webhook_events_createdAt_idx" ON "agent_processed_webhook_events"("createdAt");

-- AddForeignKey
ALTER TABLE "agent_conversations" ADD CONSTRAINT "agent_conversations_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "agent_leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_messages" ADD CONSTRAINT "agent_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "agent_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_bookings" ADD CONSTRAINT "agent_bookings_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "agent_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
