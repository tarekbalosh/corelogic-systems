import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  formatSlotLabels,
  GERMAN_VISITOR_TIMEZONE,
  getBerlinTimezoneLabel,
  parseVisitorLocalTimeToUtc,
} from "@/lib/booking/availability";
import {
  formatLocaleCurrency,
  formatLocaleDate,
  formatLocaleNumber,
} from "@/lib/format";
import {
  buildBookingConfirmedEmail,
  buildBookingRejectedEmail,
  buildContactConfirmationEmail,
} from "@/lib/email/templates";
import {
  notifyCustomerBookingDecision,
  type BookingNotificationRecord,
} from "@/lib/whatsapp/notifications";
import { detectMessageLanguage } from "@/lib/agent/runner";
import { proxy } from "@/proxy";

describe("German i18n, Europe/Berlin DST, WhatsApp & Email localization", () => {
  it("formats Europe/Berlin winter (MEZ/CET) and summer (MESZ/CEST) slots accurately with de-DE dates", () => {
    // Winter: 2026-11-26 09:00 UTC -> 10:00 MEZ (UTC+1) in Europe/Berlin
    const winterStart = new Date("2026-11-26T09:00:00.000Z");
    const winterEnd = new Date("2026-11-26T09:30:00.000Z");
    const winterLabels = formatSlotLabels(winterStart, winterEnd);

    expect(getBerlinTimezoneLabel(winterStart)).toBe("MEZ");
    expect(winterLabels.dayLabel_de).toBe("Donnerstag, 26.11.2026");
    expect(winterLabels.timeRange_de).toBe("10:00 – 10:30 Uhr");
    expect(winterLabels.label_de).toBe(
      "Donnerstag, 26.11.2026 · 10:00 – 10:30 Uhr MEZ (Europe/Berlin)"
    );

    // Summer (DST): 2026-07-15 08:00 UTC -> 10:00 MESZ (UTC+2) in Europe/Berlin
    const summerStart = new Date("2026-07-15T08:00:00.000Z");
    const summerEnd = new Date("2026-07-15T08:30:00.000Z");
    const summerLabels = formatSlotLabels(summerStart, summerEnd);

    expect(getBerlinTimezoneLabel(summerStart)).toBe("MESZ");
    expect(summerLabels.dayLabel_de).toBe("Mittwoch, 15.07.2026");
    expect(summerLabels.timeRange_de).toBe("10:00 – 10:30 Uhr");
    expect(summerLabels.label_de).toBe(
      "Mittwoch, 15.07.2026 · 10:00 – 10:30 Uhr MESZ (Europe/Berlin)"
    );

    // Round-trip local Berlin wall-clock time to UTC across winter & summer DST
    expect(
      parseVisitorLocalTimeToUtc("2026-11-26T10:00:00", GERMAN_VISITOR_TIMEZONE).toISOString()
    ).toBe("2026-11-26T09:00:00.000Z");
    expect(
      parseVisitorLocalTimeToUtc("2026-07-15T10:00:00", GERMAN_VISITOR_TIMEZONE).toISOString()
    ).toBe("2026-07-15T08:00:00.000Z");
  });

  it("formats German numbers, dates, and B2B EUR prices with Intl de-DE", () => {
    expect(formatLocaleNumber(1234.56, "de")).toBe("1.234,56");
    expect(
      formatLocaleDate(new Date("2026-11-26T12:00:00.000Z"), "de", {
        timeZone: "Europe/Berlin",
      })
    ).toBe("26.11.2026");
    expect(
      formatLocaleCurrency(1234.56, "EUR", "de", { b2bVatNote: true })
    ).toBe("1.234,56 € zzgl. MwSt.");
  });

  it("sends German ('de') customer WhatsApp templates with unchanged names, variable order, and Europe/Berlin time", async () => {
    const sentPayloads: Array<Record<string, unknown>> = [];
    const mockFetch = vi.fn(async (_url: unknown, init?: RequestInit) => {
      if (init?.body && typeof init.body === "string") {
        sentPayloads.push(JSON.parse(init.body) as Record<string, unknown>);
      }
      return Response.json({ messages: [{ id: "wamid.de_ok" }] });
    }) as unknown as typeof fetch;

    const now = new Date("2026-11-26T08:00:00.000Z");
    const booking: BookingNotificationRecord = {
      id: "bk_de_1",
      leadId: "lead_de_1",
      startsAt: new Date("2026-11-26T09:00:00.000Z"),
      endsAt: new Date("2026-11-26T09:30:00.000Z"),
      status: "CONFIRMED",
      customerNote: null,
      decidedAt: now,
      alternativeProposal: null,
      createdAt: now,
      updatedAt: now,
      lead: {
        id: "lead_de_1",
        name: "Dr. Lukas Weber",
        whatsappNumber: "+4915112345678",
        email: "weber@example.de",
        companyName: "Weber GmbH",
        requestType: "CONSULTATION",
        projectType: "ERP",
        projectDescription: "Individuelle ERP-Lösung",
        requirements: null,
        existingSystem: null,
        budgetRange: null,
        expectedStart: null,
        consentGiven: true,
        consentAt: now,
        status: "NEW",
        notifiedAt: now,
        createdAt: now,
        updatedAt: now,
        conversations: [{ id: "conv_de_1", language: "de" }],
      },
    };

    const opts = {
      enabled: true,
      phoneNumberId: "123456789",
      accessToken: "EAATestToken",
      fetchFn: mockFetch,
    };

    await notifyCustomerBookingDecision(booking, "CONFIRM", opts);
    await notifyCustomerBookingDecision(booking, "REJECT", opts);

    expect(sentPayloads).toHaveLength(2);

    const confirmedTpl = sentPayloads[0].template as {
      name: string;
      language: { code: string };
      components: Array<{ parameters: Array<{ text: string }> }>;
    };
    expect(confirmedTpl.name).toBe("booking_confirmed_customer");
    expect(confirmedTpl.language.code).toBe("de");
    expect(confirmedTpl.components[0].parameters[0].text).toBe("Dr. Lukas Weber");
    expect(confirmedTpl.components[0].parameters[1].text).toContain("26.11.2026");
    expect(confirmedTpl.components[0].parameters[1].text).toContain("MEZ (Europe/Berlin)");

    const rejectedTpl = sentPayloads[1].template as {
      name: string;
      language: { code: string };
      components: Array<{ parameters: Array<{ text: string }> }>;
    };
    expect(rejectedTpl.name).toBe("booking_rejected_customer");
    expect(rejectedTpl.language.code).toBe("de");
    expect(rejectedTpl.components[0].parameters[0].text).toBe("Dr. Lukas Weber");
    expect(rejectedTpl.components[0].parameters[1].text).toContain("MEZ (Europe/Berlin)");
  });

  it("builds formal-'Sie' German email templates with Europe/Berlin timezone", () => {
    const contactMail = buildContactConfirmationEmail({
      locale: "de",
      fullName: "Anna Müller",
      service: "Webanwendungen",
      submittedAt: new Date("2026-11-26T10:00:00.000Z"),
    });
    expect(contactMail.subject).toContain("CoreLogic Systems");
    expect(contactMail.text).toContain("Guten Tag Anna Müller");
    expect(contactMail.text).toContain("26.11.2026");
    expect(contactMail.text).toContain("Ihre Anfrage");

    const confirmMail = buildBookingConfirmedEmail({
      locale: "de",
      customerName: "Anna Müller",
      startsAt: new Date("2026-07-15T08:00:00.000Z"),
      endsAt: new Date("2026-07-15T08:30:00.000Z"),
    });
    expect(confirmMail.text).toContain("15.07.2026");
    expect(confirmMail.text).toContain("MESZ (Europe/Berlin)");

    const rejectMail = buildBookingRejectedEmail({
      locale: "de",
      customerName: "Anna Müller",
      startsAt: new Date("2026-11-26T09:00:00.000Z"),
      endsAt: new Date("2026-11-26T09:30:00.000Z"),
      alternativeProposal: "Freitag, 27.11.2026 um 10:00 Uhr MEZ",
    });
    expect(rejectMail.text).toContain("MEZ (Europe/Berlin)");
    expect(rejectMail.text).toContain("Alternativvorschlag");
  });

  it("detects German messages and respects client fallback", () => {
    expect(detectMessageLanguage("Guten Tag, ich möchte eine Beratung buchen.")).toBe("de");
    expect(detectMessageLanguage("مرحبا أريد استشارة")).toBe("ar");
    expect(detectMessageLanguage("Hello, we need a web portal")).toBe("en");
    expect(detectMessageLanguage("OK", "de")).toBe("de");
  });

  it("redirects unprefixed URLs to default locale without Accept-Language sniffing, and remembers cookie choice", () => {
    // Even with Accept-Language: de-DE, no cookie -> stays on default locale ("en")
    const reqNoCookie = new NextRequest("https://www.corelogic-system.my/about", {
      headers: {
        host: "www.corelogic-system.my",
        "accept-language": "de-DE,de;q=0.9",
      },
    });
    const resDefault = proxy(reqNoCookie);
    expect(resDefault.status).toBe(301);
    expect(resDefault.headers.get("location")).toBe(
      "https://www.corelogic-system.my/en/about"
    );
    expect(resDefault.headers.get("vary")).toBe("Cookie");

    // Apex domain + unprefixed path collapses into a single permanent (301) hop (no redirect chain)
    const reqApex = new NextRequest("https://corelogic-system.my/about", {
      headers: { host: "corelogic-system.my" },
    });
    const resApex = proxy(reqApex);
    expect(resApex.status).toBe(301);
    expect(resApex.headers.get("location")).toBe(
      "https://www.corelogic-system.my/en/about"
    );

    // With explicit NEXT_LOCALE=de cookie -> temporary redirect (307) to /de/about
    const reqDeCookie = new NextRequest("https://www.corelogic-system.my/about", {
      headers: {
        host: "www.corelogic-system.my",
        cookie: "NEXT_LOCALE=de",
      },
    });
    const resDe = proxy(reqDeCookie);
    expect(resDe.status).toBe(307);
    expect(resDe.headers.get("location")).toBe(
      "https://www.corelogic-system.my/de/about"
    );

    // Non-localized route (/blog) stays unprefixed (no redirect)
    const reqBlog = new NextRequest("https://www.corelogic-system.my/blog", {
      headers: { host: "www.corelogic-system.my", cookie: "NEXT_LOCALE=de" },
    });
    const resBlog = proxy(reqBlog);
    expect(resBlog.headers.get("location")).toBeNull();
  });
});
