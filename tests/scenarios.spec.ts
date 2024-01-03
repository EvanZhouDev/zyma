import { Page, expect, test } from "@playwright/test";
import { createAccount, createGroup, getCode, login } from "./utils";
test.describe("One Group", () => {
	// Now we have a theoretical situation consisting of 5
	// accounts:
	// - Teacher (host): Obvious agenda. Hosts groups
	// - Lawful (attendee): Attends groups, follows expected protocol, always present
	// - Unlawful (attendee): Attends groups, lazy (doesn't want to do anything), never attends
	// - Absentminded (attendee): Like lawful and always attends but always has an excuse for absence
	//								+ always needs redirect as he forgets to log in
	// - QRCodeHater (attendee): Like lawful but always input codes manually, still always present
	// TODO: Screenshots
	test.describe.configure({ mode: "serial" });
	test("Setup", async ({ browser, browserName }) => {
		// Create accounts
		const hostContext = await browser.newContext();
		const hostPage = await hostContext.newPage();
		await createAccount(hostPage, `teacher.${browserName}@acme.org`, "Host");
		for (const attendee of [
			"lawful",
			"unlawful",
			"absentminded",
			"qrcodehater",
		]) {
			const attendeeContext = await browser.newContext();
			const attendeePage = await attendeeContext.newPage();
			await createAccount(
				attendeePage,
				`${attendee}.${browserName}@acme.org`,
				"Attendee",
			);
		}
		// Setup group
		await createGroup(hostPage, "OneGroup");
	});
	test("Join group", async ({ browser, browserName }) => {
		// Create browser contexts
		const hostContext = await browser.newContext();
		const hostPage = await hostContext.newPage();
		const lawfulContext = await browser.newContext();
		const lawfulPage = await lawfulContext.newPage();
		const unlawfulContext = await browser.newContext();
		const unlawfulPage = await unlawfulContext.newPage();
		const absentmindedContext = await browser.newContext();
		const absentmindedPage = await absentmindedContext.newPage();
		const qrcodehaterContext = await browser.newContext();
		const qrcodehaterPage = await qrcodehaterContext.newPage();
		await login(hostPage, `teacher.${browserName}@acme.org`);
		await hostPage.waitForURL(/host/);
		// Create a group
		await createGroup(hostPage, "OneGroup");
		// Lawful joins
		const code = await getCode(hostPage);
		await login(lawfulPage, `lawful.${browserName}@acme.org`);
		await lawfulPage.waitForURL(/attendee/);
		await lawfulPage.goto(`/attendee/join?code=${code}`);
		await expect(lawfulPage.getByText(/Successfully joined/)).toBeVisible();

		// Absentminded joins
		await absentmindedPage.goto(`/attendee/join?code=${code}`);
		await expect(absentmindedPage).toHaveScreenshot("login.png");
		await absentmindedPage
			.locator('input[name="email"]:not(dialog *)')
			.fill(`absentminded.${browserName}@acme.org`);
		await absentmindedPage
			.locator('input[name="password"]:not(dialog *)')
			.click();
		await absentmindedPage
			.locator('input[name="password"]:not(dialog *)')
			.fill("123456");
		await absentmindedPage.getByRole("button", { name: /Sign In/g }).click();
		await absentmindedPage.waitForURL(`**/attendee/join?code=${code}`);
		// await expect(
		// 	absentmindedPage.getByText(/Successfully joined/),
		// ).toBeVisible();
		// QRCodeHater joins
		await login(qrcodehaterPage, `qrcodehater.${browserName}@acme.org`);
		await qrcodehaterPage.waitForURL(/attendee/);
		await qrcodehaterPage.getByText("Manage Your Groups").click();
		await qrcodehaterPage.getByPlaceholder(/Code/).fill(code);
		await qrcodehaterPage.getByText("Join Group").click();
		await expect(
			qrcodehaterPage.getByText(/Successfully joined/),
		).toBeVisible();
		// Manually add Unlawful
		await hostPage
			.locator('input[name="email"]')
			.fill(`unlawful.${browserName}@acme.org`);
		await hostPage.getByText("Add Attendee").click();
		await hostPage.goto("/");
		await hostPage.waitForURL(/host/);
		// Check for the new attendees
		for (const attendee of [
			`lawful.${browserName}@acme.org`,
			`unlawful.${browserName}@acme.org`,
			`absentminded.${browserName}@acme.org`,
			`qrcodehater.${browserName}@acme.org`,
		]) {
			await expect(
				hostPage.getByRole("cell", { name: attendee }).first(),
			).toBeVisible();
		}
	});
});
