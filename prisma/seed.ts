import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seeds default consultation availability rules in Malaysia time (Asia/Kuala_Lumpur):
 * Monday (1) through Friday (5):
 *   - Morning block:   10:00 – 12:30
 *   - Afternoon block: 14:00 – 18:00
 */
async function main() {
  const weekdays = [1, 2, 3, 4, 5]; // Monday..Friday
  const windows = [
    { startTime: "10:00", endTime: "12:30" },
    { startTime: "14:00", endTime: "18:00" },
  ];

  let upserted = 0;
  for (const dayOfWeek of weekdays) {
    for (const window of windows) {
      await prisma.availabilityRule.upsert({
        where: {
          dayOfWeek_startTime_endTime: {
            dayOfWeek,
            startTime: window.startTime,
            endTime: window.endTime,
          },
        },
        update: { active: true },
        create: {
          dayOfWeek,
          startTime: window.startTime,
          endTime: window.endTime,
          active: true,
        },
      });
      upserted += 1;
    }
  }

  console.log(
    `[prisma-seed] Upserted ${upserted} default availability rules (Mon-Fri 10:00-12:30 & 14:00-18:00 MYT).`
  );
}

main()
  .catch((error) => {
    console.error("[prisma-seed] Failed to seed availability rules:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
