import { PrismaClient } from "@prisma/client";
import { normalizeWhatsAppNumber } from "@/lib/agent/tools";
import { maskPhone } from "@/lib/security/mask";

/**
 * Privacy & Data Retention CLI utility (`scripts/data-retention.ts`).
 *
 * Usage examples:
 *   # Preview deleting conversations & unbooked leads older than DATA_RETENTION_DAYS (default 180):
 *   npx tsx scripts/data-retention.ts --purge
 *
 *   # Execute retention purge:
 *   npx tsx scripts/data-retention.ts --purge --days 180 --execute
 *
 *   # Delete all data for a specific person on request (by phone, lead ID, or session UUID):
 *   npx tsx scripts/data-retention.ts --delete-phone "+60123456789" --execute
 *   npx tsx scripts/data-retention.ts --delete-lead-id "cm..." --execute
 *   npx tsx scripts/data-retention.ts --delete-session "11111111-1111-4111-8111-111111111111" --execute
 */
async function main() {
  const args = process.argv.slice(2);
  const execute = args.includes("--execute");

  const getArgValue = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : undefined;
  };

  const prisma = new PrismaClient();

  try {
    const deletePhoneRaw = getArgValue("--delete-phone");
    const deleteLeadId = getArgValue("--delete-lead-id");
    const deleteSession = getArgValue("--delete-session");
    const purgeRequested = args.includes("--purge");

    if (deletePhoneRaw) {
      const normalized = normalizeWhatsAppNumber(deletePhoneRaw);
      if (!normalized.ok) {
        console.error(`[data-retention] Invalid phone format: ${normalized.error}`);
        process.exit(1);
      }

      const leads = await prisma.lead.findMany({
        where: { whatsappNumber: normalized.e164 },
        select: { id: true },
      });
      const leadIds = leads.map((l) => l.id);

      console.log(
        `[data-retention] Subject lookup for ${maskPhone(normalized.e164)}: found ${leadIds.length} lead record(s). Mode: ${execute ? "EXECUTE" : "DRY-RUN"}`
      );

      if (execute && leadIds.length > 0) {
        await prisma.$transaction([
          prisma.conversation.deleteMany({ where: { leadId: { in: leadIds } } }),
          prisma.booking.deleteMany({ where: { leadId: { in: leadIds } } }),
          prisma.lead.deleteMany({ where: { id: { in: leadIds } } }),
        ]);
        console.log("[data-retention] Deleted all conversations, bookings, and leads for requested phone.");
      }
      return;
    }

    if (deleteLeadId) {
      console.log(
        `[data-retention] Subject deletion for leadId=${deleteLeadId}. Mode: ${execute ? "EXECUTE" : "DRY-RUN"}`
      );
      if (execute) {
        await prisma.$transaction([
          prisma.conversation.deleteMany({ where: { leadId: deleteLeadId } }),
          prisma.booking.deleteMany({ where: { leadId: deleteLeadId } }),
          prisma.lead.deleteMany({ where: { id: deleteLeadId } }),
        ]);
        console.log("[data-retention] Deleted lead and linked records.");
      }
      return;
    }

    if (deleteSession) {
      console.log(
        `[data-retention] Session deletion for sessionId=${deleteSession}. Mode: ${execute ? "EXECUTE" : "DRY-RUN"}`
      );
      if (execute) {
        await prisma.conversation.deleteMany({
          where: { sessionId: deleteSession },
        });
        console.log("[data-retention] Deleted conversation and cascaded messages.");
      }
      return;
    }

    if (purgeRequested) {
      const daysFlag = getArgValue("--days");
      const retentionDays = Number.parseInt(
        daysFlag ?? process.env.DATA_RETENTION_DAYS ?? "180",
        10
      );
      if (!Number.isFinite(retentionDays) || retentionDays < 7) {
        console.error("[data-retention] Retention period must be >= 7 days.");
        process.exit(1);
      }

      const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
      const staleConversations = await prisma.conversation.count({
        where: { updatedAt: { lt: cutoff } },
      });
      const staleLeads = await prisma.lead.count({
        where: {
          updatedAt: { lt: cutoff },
          bookings: {
            none: { status: { in: ["PENDING", "CONFIRMED"] } },
          },
        },
      });

      console.log(
        `[data-retention] Cutoff=${cutoff.toISOString()} (${retentionDays} days): ${staleConversations} conversation(s), ${staleLeads} lead(s) eligible. Mode: ${execute ? "EXECUTE" : "DRY-RUN"}`
      );

      if (execute) {
        await prisma.$transaction([
          prisma.conversation.deleteMany({ where: { updatedAt: { lt: cutoff } } }),
          prisma.lead.deleteMany({
            where: {
              updatedAt: { lt: cutoff },
              bookings: {
                none: { status: { in: ["PENDING", "CONFIRMED"] } },
              },
            },
          }),
          prisma.processedWebhookEvent.deleteMany({
            where: { createdAt: { lt: cutoff } },
          }),
        ]);
        console.log("[data-retention] Retention purge completed.");
      }
      return;
    }

    console.log(
      "Usage:\n  npx tsx scripts/data-retention.ts --purge [--days 180] [--execute]\n  npx tsx scripts/data-retention.ts --delete-phone '+60123456789' [--execute]\n  npx tsx scripts/data-retention.ts --delete-lead-id '<id>' [--execute]\n  npx tsx scripts/data-retention.ts --delete-session '<uuid>' [--execute]"
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("[data-retention] Failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
