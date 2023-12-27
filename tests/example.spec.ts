import { expect, test } from "@playwright/test";
test.describe("Happy path", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  // Started with a generated test via
  // bun run playwright codegen
  test("Create Account, Group, and Start/End Attendance", async ({
    page,
    browserName,
  }) => {
    await page.locator('input[name="email"]').fill(`${browserName}@acme.org`);
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill("123456");
    await page.getByRole("button", { name: /Sign Up/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.locator("dialog button").filter({ hasText: /^Submit$/ })
    ).toBeDisabled();
    await page.locator('input[name="name"]').fill("Host");
    await expect(
      page.locator("dialog button").filter({ hasText: /^Submit$/ })
    ).toBeEnabled();
    await page.getByRole("button", { name: "Submit" }).click();

    await page.waitForURL(/dashboard/);
    await page.getByLabel("Manage Your Groups").click();
    await page.getByRole("button", { name: "Add Group" }).click();
    await expect(
      page.getByRole("button", { name: "Create Group" })
    ).toBeDisabled();
    await page.getByPlaceholder("Group name...").fill("Example Group");
    await expect(
      page.getByRole("button", { name: "Create Group" })
    ).toBeEnabled();
    await page.getByRole("button", { name: "Create Group" }).click();
    await expect(
      page.getByRole("button", { name: "Create Group" })
    ).toBeDisabled();
    // XXX: Reload because realtime is disabled
    await page.goto("/");
    await page.waitForURL(/dashboard/);
    await expect(page.getByRole("combobox")).toBeVisible();
    await page.screenshot({ path: `example-${browserName}.png` });
    await expect(page.getByRole("tabpanel")).toContainText(
      "No attendees registered."
    );

    await page.getByRole("link", { name: /Start Attendance/ }).click();
    await page.locator("select").selectOption("Absent");
    await page.locator("select").selectOption("All Statuses");
    await page.getByRole("button", { name: "End Session" }).click();
  });
});
