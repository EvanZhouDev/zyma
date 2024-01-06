import { Page, expect, test } from "@playwright/test";
import {
	createAccount,
	createGroup,
	getCode,
	login,
	removeStudent,
} from "./utils";

const GROUP_NAME = "Example Group";

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
			const [page, name] = tuple as [Page, "Host" | "Attendee"];
			await createAccount(page, `${name}.${browserName}@acme.org`, name, name);
		}
	});
	test("(Host) Login Account, Create Group", async ({ page, browserName }) => {
		await login(page, `host.${browserName}@acme.org`);
		await page.waitForURL(/host/);
		// Create groups
		await expect(page).toHaveScreenshot("dashboard-no-groups.png");
		await createGroup(page, GROUP_NAME);
	});
	test("(Host) Login Account, Start/End Attendance (no attendees)", async ({
		page,
		browserName,
	}) => {
		await login(page, `host.${browserName}@acme.org`);
		await page.waitForURL(/host/);
		// Assert that a Group exists
		await expect(page.getByRole("tabpanel")).toContainText(
			"No attendees registered.",
		);
		// Start attendance
		await page.getByRole("link", { name: /Start Attendance/ }).isEnabled();
		await page.getByRole("link", { name: /Start Attendance/ }).click();
		await page.waitForURL(/host\/attendance/);
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
		await hostPage.waitForURL(/host/);
		// Assert that a Group exists
		await expect(hostPage.getByRole("tabpanel")).toContainText(
			"No attendees registered.",
		);
		const code = await getCode(hostPage);
		// Join class
		await login(attendeePage, `attendee.${browserName}@acme.org`);
		await attendeePage.waitForURL(/attendee/);
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
		await expect(hostPage.locator(".alert-info:not(dialog *)")).toBeVisible();
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
		await hostPage.waitForURL(/host/);
		// Assert that a Group exists
		await expect(hostPage.getByRole("tabpanel")).toContainText(
			"No attendees registered.",
		);
		const code = await getCode(hostPage);
		// Join class
		await hostPage
			.locator('input[name="email"]')
			.fill(`attendee.${browserName}@acme.org`);
		await hostPage.getByText("Add Attendee").click();
		await login(attendeePage, `attendee.${browserName}@acme.org`);
		await attendeePage.waitForURL(/attendee/);
		await attendeePage.goto(`/attendee/join?code=${code}`);
		await expect(attendeePage).toHaveScreenshot("attendee-already-joined.png");
		await expect(
			attendeePage.getByText(/You already joined this group/),
		).toBeVisible();
		// Remove student
		await hostPage.goto("/host/dashboard"); // XXX: Realtime
		await removeStudent(hostPage);
		await expect(hostPage.locator(".alert-info:not(dialog *)")).toBeVisible();
		await expect(hostPage.getByRole("tabpanel")).toContainText(
			"No attendees registered.",
		);
	});
});
