import { Page, expect, test } from "@playwright/test";
async function login(page: Page, name: string) {
  await page.goto("/");
  await page.locator('input[name="email"]').fill(name);
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill("123456");
  await page.getByRole("button", { name: /Sign In/g }).click();
}
test.describe("Happy path", () => {
  test.describe.configure({ mode: "serial" });

  test("(Both host and attendee) Create Account", async ({
    browser,
    browserName,
  }) => {
    const hostContext = await browser.newContext();
    const attendeeContext = await browser.newContext();
    const hostPage = await hostContext.newPage();
    const attendeePage = await attendeeContext.newPage();
    for (const tuple of [
      [hostPage, "Host"],
      [attendeePage, "Attendee"],
    ]) {
      const [page, name] = tuple as [Page, string];
      await page.goto("/");
      await expect(page).toHaveScreenshot("login.png");
      await page
        .locator('input[name="email"]')
        .fill(`${name}.${browserName}@acme.org`);
      await page.locator('input[name="password"]').click();
      await page.locator('input[name="password"]').fill("123456");
      await page.getByRole("button", { name: /Sign Up/ }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(
        page.locator("dialog button").filter({ hasText: /^Submit$/ })
      ).toBeDisabled();
      await page.locator('input[name="name"]').fill(name);
      await expect(
        page.locator("dialog button").filter({ hasText: /^Submit$/ })
      ).toBeEnabled();
      await page.getByRole("button", { name: "Submit" }).click();
    }
  });
  test("(Host) Login Account, Create Group, Start/End Attendance (no attendees)", async ({
    page,
    browserName,
  }) => {
    await login(page, `host.${browserName}@acme.org`);
    // Create groups
    await page.waitForURL(/dashboard/);
    await expect(page).toHaveScreenshot("dashboard-no-groups.png");
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
    await expect(page).toHaveScreenshot("dashboard-with-groups.png");
    await expect(page).toHaveScreenshot();
    await expect(page.getByRole("combobox")).toBeVisible();
    await expect(page.getByRole("tabpanel")).toContainText(
      "No attendees registered."
    );
    // Start attendance
    await page.getByRole("link", { name: /Start Attendance/ }).isEnabled();
    await page.getByRole("link", { name: /Start Attendance/ }).click();
    await page.locator("select").selectOption("Absent");
    await page.locator("select").selectOption("All Statuses");
    await page.getByRole("button", { name: "End Session" }).click();
  });
});
