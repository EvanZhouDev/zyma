import { Page, expect, test } from "@playwright/test";
import { createAccount, createGroup, login } from "./utils";
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
	});
});
