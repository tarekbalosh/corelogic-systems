import { describe, expect, it } from "vitest";
import {
  ADMIN_SESSION_TTL_MS,
  createSignedAdminSessionValue,
  verifyAdminTokenConstantTime,
  verifySignedAdminSessionValue,
} from "@/lib/security/admin-auth";

const TEST_ADMIN_SECRET = "super-secret-admin-token-0123456789";

describe("admin authentication guard & signed cookie verification (Step 11)", () => {
  it("compares ADMIN_TOKEN in constant time and rejects mismatched or short tokens", () => {
    expect(
      verifyAdminTokenConstantTime(TEST_ADMIN_SECRET, TEST_ADMIN_SECRET)
    ).toBe(true);
    expect(
      verifyAdminTokenConstantTime(`  ${TEST_ADMIN_SECRET}  `, TEST_ADMIN_SECRET)
    ).toBe(true);
    expect(
      verifyAdminTokenConstantTime("wrong-token", TEST_ADMIN_SECRET)
    ).toBe(false);
    expect(verifyAdminTokenConstantTime("", TEST_ADMIN_SECRET)).toBe(false);
    expect(verifyAdminTokenConstantTime(TEST_ADMIN_SECRET, null)).toBe(false);
  });

  it("signs, validates, and expires admin session cookies securely", () => {
    const now = 1_700_000_000_000;
    const cookieVal = createSignedAdminSessionValue(TEST_ADMIN_SECRET, now);

    // Valid within TTL
    expect(
      verifySignedAdminSessionValue(cookieVal, TEST_ADMIN_SECRET, now + 60_000)
    ).toBe(true);

    // Tampered payload rejected
    const [payload, sig] = cookieVal.split(".");
    const tamperedPayload = Buffer.from(
      JSON.stringify({ exp: now + 999_999_999, nonce: "forged", v: 1 })
    ).toString("base64url");
    expect(
      verifySignedAdminSessionValue(
        `${tamperedPayload}.${sig}`,
        TEST_ADMIN_SECRET,
        now + 1000
      )
    ).toBe(false);

    // Wrong secret rejected
    expect(
      verifySignedAdminSessionValue(
        `${payload}.${sig}`,
        "different-admin-secret-value-999999",
        now + 1000
      )
    ).toBe(false);

    // Expired cookie rejected
    expect(
      verifySignedAdminSessionValue(
        cookieVal,
        TEST_ADMIN_SECRET,
        now + ADMIN_SESSION_TTL_MS + 1
      )
    ).toBe(false);
  });
});
