-- CreateEnum
CREATE TYPE "WhatsAppMessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "WhatsAppMessageType" AS ENUM ('TEXT', 'IMAGE', 'DOCUMENT', 'AUDIO', 'VIDEO', 'LOCATION', 'INTERACTIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "ChatFlowTriggerType" AS ENUM ('ANY_MESSAGE', 'KEYWORD');

-- CreateEnum
CREATE TYPE "ChatFlowNodeType" AS ENUM ('MESSAGE', 'QUESTION', 'CONDITION', 'END');

-- CreateEnum
CREATE TYPE "ChatFlowSessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED', 'PAUSED');

-- CreateTable
CREATE TABLE "whatsapp_conversations" (
    "id" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMessagePreview" TEXT,
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "clientId" TEXT,
    "leadId" TEXT,

    CONSTRAINT "whatsapp_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_messages" (
    "id" TEXT NOT NULL,
    "direction" "WhatsAppMessageDirection" NOT NULL,
    "messageType" "WhatsAppMessageType" NOT NULL DEFAULT 'TEXT',
    "body" TEXT,
    "rawPayload" JSONB,
    "metaMessageId" TEXT,
    "sentByBot" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversationId" TEXT NOT NULL,
    "sentByUserId" TEXT,

    CONSTRAINT "whatsapp_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_flows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "triggerType" "ChatFlowTriggerType" NOT NULL DEFAULT 'ANY_MESSAGE',
    "triggerKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "startNodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "chat_flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_flow_nodes" (
    "id" TEXT NOT NULL,
    "type" "ChatFlowNodeType" NOT NULL,
    "data" JSONB NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,
    "flowId" TEXT NOT NULL,

    CONSTRAINT "chat_flow_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_flow_edges" (
    "id" TEXT NOT NULL,
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,
    "label" TEXT,
    "flowId" TEXT NOT NULL,

    CONSTRAINT "chat_flow_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_flow_sessions" (
    "id" TEXT NOT NULL,
    "currentNodeId" TEXT,
    "variables" JSONB NOT NULL DEFAULT '{}',
    "status" "ChatFlowSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "conversationId" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,

    CONSTRAINT "chat_flow_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "whatsapp_conversations_userId_lastMessageAt_idx" ON "whatsapp_conversations"("userId", "lastMessageAt");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_conversations_userId_contactNumber_key" ON "whatsapp_conversations"("userId", "contactNumber");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_messages_metaMessageId_key" ON "whatsapp_messages"("metaMessageId");

-- CreateIndex
CREATE INDEX "whatsapp_messages_conversationId_createdAt_idx" ON "whatsapp_messages"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "chat_flows_userId_isActive_idx" ON "chat_flows"("userId", "isActive");

-- CreateIndex
CREATE INDEX "chat_flow_sessions_conversationId_status_idx" ON "chat_flow_sessions"("conversationId", "status");

-- AddForeignKey
ALTER TABLE "whatsapp_conversations" ADD CONSTRAINT "whatsapp_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_conversations" ADD CONSTRAINT "whatsapp_conversations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_conversations" ADD CONSTRAINT "whatsapp_conversations_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "whatsapp_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_sentByUserId_fkey" FOREIGN KEY ("sentByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_flows" ADD CONSTRAINT "chat_flows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_flow_nodes" ADD CONSTRAINT "chat_flow_nodes_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "chat_flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_flow_edges" ADD CONSTRAINT "chat_flow_edges_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "chat_flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_flow_sessions" ADD CONSTRAINT "chat_flow_sessions_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "whatsapp_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_flow_sessions" ADD CONSTRAINT "chat_flow_sessions_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "chat_flows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
