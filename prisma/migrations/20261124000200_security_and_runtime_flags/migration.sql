-- CreateTable: Postgres-backed atomic fixed-window rate limit buckets (Step 10)
CREATE TABLE "agent_rate_limits" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_rate_limits_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "agent_rate_limits_expiresAt_idx" ON "agent_rate_limits"("expiresAt");

-- CreateTable: Runtime feature flags / emergency kill-switch without redeploy (Steps 11 & 13)
CREATE TABLE "agent_runtime_settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_runtime_settings_pkey" PRIMARY KEY ("key")
);
