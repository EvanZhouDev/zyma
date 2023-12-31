import { Page, expect, test } from "@playwright/test";

const GROUP_NAME = "Example Group";
async function login(page: Page, name: string) {
	await page.goto("/");
	await expect(page).toHaveScreenshot("login.png");
	await page.locator('input[name="email"]:not(dialog *)').fill(name);
	await page.locator('input[name="password"]:not(dialog *)').click();
	await page.locator('input[name="password"]:not(dialog *)').fill("123456");
	await page.getByRole("button", { name: /Sign In/g }).click();
	await page.waitForURL(new RegExp(name.split(".")[0]));
}
async function getCode(page: Page) {
	const code = await page
		.locator(
			"xpath=.//div[contains(., 'Alternatively, enter the Passcode')]/following-sibling::div/div/text()/..",
		)
		.textContent();
	await expect(code).not.toBeNull();
	return code!;
}
async function removeStudent(page: Page) {
	await page
		.locator(
			':is([aria-label="Manage Attendees"] + div) .btn-dangerous:not(dialog .btn-dangerous)',
		)
		.click();
}
test.describe("Happy path", () => {
	// These tests are inherently serial because they share the same account
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
			await page.getByRole("button", { name: /No account/ }).click();
			await expect(page.getByRole("dialog")).toBeVisible();
			await expect(
				page.locator("dialog button", { hasText: /^Sign Up$/ }),
			).toBeVisible();
			await page
				.locator('dialog input[name="email"]')
				.fill(`${name}.${browserName}@acme.org`);
			await page.locator('dialog input[name="password"]').click();
			await page.locator('dialog input[name="password"]').fill("123456");
			await page.getByLabel(/who/i).selectOption(name);
			await page.locator('input[name="name"]').fill(name);
			await expect(page).toHaveScreenshot(`${name}-signup.png`);
			await page.locator("dialog button", { hasText: "Sign Up" }).click();
			await page.waitForURL(new RegExp(name.toLowerCase()));
		}
	});
	test("(Host) Login Account, Create Group", async ({ page, browserName }) => {
		await login(page, `host.${browserName}@acme.org`);
		// Create groups
		await expect(page).toHaveScreenshot("dashboard-no-groups.png");
		await page.getByLabel("Manage Your Groups").click();
		await page.getByRole("button", { name: "Add Group" }).click();
		await expect(
			page.getByRole("button", { name: "Create Group" }),
		).toBeDisabled();
		await page.getByPlaceholder("Group name...").fill(GROUP_NAME);
		await expect(
			page.getByRole("button", { name: "Create Group" }),
		).toBeEnabled();
		await page.getByRole("button", { name: "Create Group" }).click();
		await expect(
			page.getByRole("button", { name: "Create Group" }),
		).toBeDisabled();
		// XXX: Reload because realtime is disabled
		await page.goto("/");
		await page.waitForURL(/dashboard/);
		await expect(page).toHaveScreenshot("dashboard-with-groups.png");
		await expect(page.getByRole("combobox")).toBeVisible();
		await expect(page.getByRole("tabpanel")).toContainText(
			"No attendees registered.",
		);
	});
	test("(Host) Login Account, Start/End Attendance (no attendees)", async ({
		page,
		browserName,
	}) => {
		await login(page, `host.${browserName}@acme.org`);
		// Assert that a Group exists
		await expect(page.getByRole("tabpanel")).toContainText(
			"No attendees registered.",
		);
		// Start attendance
		await page.getByRole("link", { name: /Start Attendance/ }).isEnabled();
		await page.getByRole("link", { name: /Start Attendance/ }).click();
		await page.locator("select").selectOption("Absent");
		await page.locator("select").selectOption("All Statuses");
		await page.getByRole("button", { name: "End Session" }).click();
	});
	test("Join group + leave group", async ({ browser, browserName }) => {
		const hostContext = await browser.newContext();
		const attendeeContext = await browser.newContext();
		const hostPage = await hostContext.newPage();
		const attendeePage = await attendeeContext.newPage();
		await login(hostPage, `host.${browserName}@acme.org`);
		// Assert that a Group exists
		await expect(hostPage.getByRole("tabpanel")).toContainText(
			"No attendees registered.",
		);
		await hostPage.goto("/host/dashboard"); // Just in case the codes can work fine
		await hostPage.getByRole("button", { name: "Register Attendees" }).click();
		await hostPage.goto("/host/dashboard"); // Just in case the codes can work fine
		await hostPage.getByRole("button", { name: "Register Attendees" }).click();
		const code = await getCode(hostPage);
		// Join class
		await login(attendeePage, `attendee.${browserName}@acme.org`);
		await attendeePage.goto(`/attendee/join?code=${code}`);
		await expect(attendeePage).toHaveScreenshot("attendee-success.png");
		await expect(attendeePage.getByText(/Successfully joined/)).toBeVisible();
		// See student
		await hostPage.goto("/host/dashboard"); // XXX: Realtime
		await expect(hostPage).toHaveScreenshot("dashboard-attendee-joined.png");
		await expect(
			hostPage
				.getByRole("cell", { name: `attendee.${browserName}@acme.org` })
				.first(),
		).toBeVisible();
		// Remove student
		await removeStudent(hostPage);
		await hostPage.goto("/host/dashboard"); // XXX: Realtime
		await expect(hostPage.getByRole("tabpanel")).toContainText(
			"No attendees registered.",
		);
	});
	test("Join group (manual) + leave group", async ({
		browser,
		browserName,
	}) => {
		const hostContext = await browser.newContext();
		const attendeeContext = await browser.newContext();
		const hostPage = await hostContext.newPage();
		const attendeePage = await attendeeContext.newPage();
		await login(hostPage, `host.${browserName}@acme.org`);
		// Assert that a Group exists
		await expect(hostPage.getByRole("tabpanel")).toContainText(
			"No attendees registered.",
		);
		await hostPage.getByRole("button", { name: "Register Attendees" }).click();
		const code = await getCode(hostPage);
		// Join class
		await hostPage
			.locator('input[name="email"]')
			.fill(`attendee.${browserName}@acme.org`);
		await hostPage.getByText("Add Attendee").click();
		await login(attendeePage, `attendee.${browserName}@acme.org`);
		await attendeePage.goto(`/attendee/join?code=${code}`);
		await expect(attendeePage).toHaveScreenshot("attendee-already-joined.png");
		await expect(
			attendeePage.getByText(/You already joined this group/),
		).toBeVisible();
		// Remove student
		await hostPage.goto("/host/dashboard"); // XXX: Realtime
		await removeStudent(hostPage);
		await hostPage.goto("/host/dashboard"); // XXX: Realtime
		await expect(hostPage.getByRole("tabpanel")).toContainText(
			"No attendees registered.",
		);
	});
});
