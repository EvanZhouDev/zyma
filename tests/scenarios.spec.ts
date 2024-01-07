import { expect, test } from "@playwright/test";
import {
	createAccount,
	createGroup,
	getAttendanceCode,
	getCode,
	login,
} from "./utils";
test.describe("One Group", () => {
	// Now we have a theoretical situation consisting of 5
	// accounts:
	// - Teacher (host): Obvious agenda. Hosts groups
	// - Lawful (attendee): Joins groups, follows expected protocol, always present
	// - Unlawful (attendee): Joins groups (manually), lazy (doesn't want to do anything), never attends
	// - Absentminded (attendee): Like lawful and always attends but always has an excuse for absence
	//								+ always needs redirect as he forgets to log in
	// - QRCodeHater (attendee): Like lawful but always input codes manually, still always present
	// TODO: Screenshots
	test.describe.configure({ mode: "serial" });
	test("Setup", async ({ browser, browserName }) => {
		// Create accounts
		const hostContext = await browser.newContext();
		const hostPage = await hostContext.newPage();
		await createAccount(
			hostPage,
			`teacher.${browserName}@acme.org`,
			"Host",
			"Host",
		);
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
				attendee.charAt(0).toUpperCase() + attendee.slice(1),
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
		// const unlawfulContext = await browser.newContext();
		// const unlawfulPage = await unlawfulContext.newPage();
		const absentmindedContext = await browser.newContext();
		const absentmindedPage = await absentmindedContext.newPage();
		const qrcodehaterContext = await browser.newContext();
		const qrcodehaterPage = await qrcodehaterContext.newPage();
		await login(hostPage, `teacher.${browserName}@acme.org`);
		await hostPage.waitForURL(/host/);
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
		await expect(absentmindedPage.getByText(/joined/)).toBeVisible();
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

		await expect(
			hostPage.locator(
				"[role=tabpanel]:first-of-type table:not(dialog *) tr > td:nth-child(2)",
			),
		).toHaveText([
			`lawful.${browserName}@acme.org`,
			`absentminded.${browserName}@acme.org`,
			`qrcodehater.${browserName}@acme.org`,
			`unlawful.${browserName}@acme.org`,
		]);
	});
	test("Take attendance", async ({ browser, browserName }) => {
		// Create browser contexts
		const hostContext = await browser.newContext();
		const hostPage = await hostContext.newPage();
		const lawfulContext = await browser.newContext();
		const lawfulPage = await lawfulContext.newPage();
		const absentmindedContext = await browser.newContext();
		const absentmindedPage = await absentmindedContext.newPage();
		const qrcodehaterContext = await browser.newContext();
		const qrcodehaterPage = await qrcodehaterContext.newPage();
		await login(hostPage, `teacher.${browserName}@acme.org`);
		// Start attendance
		await hostPage.waitForURL(/host/);
		await hostPage.getByRole("link", { name: /Start Attendance/ }).isEnabled();
		await hostPage.getByRole("link", { name: /Start Attendance/ }).click();
		await hostPage.waitForURL(/host\/attendance/);
		// Get attendance code
		const code = await getAttendanceCode(hostPage);

		// Lawful joins by scanning the QR code
		await login(lawfulPage, `lawful.${browserName}@acme.org`);
		await lawfulPage.waitForURL(/attendee/);
		await lawfulPage.goto(`/attendee/attend?code=${code}`);
		await expect(lawfulPage.getByText(/Attended/)).toBeVisible();

		// Absentminded joins by scanning the QR code but forgets to login
		await absentmindedPage.goto(`/attendee/attend?code=${code}`);
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
		await absentmindedPage.waitForURL(`**/attendee/attend?code=${code}`);
		await expect(absentmindedPage.getByText(/Attended/)).toBeVisible();
		// Select an absence for absentminded
		await expect(
			absentmindedPage.getByRole("button", { name: /Mark me as absent/ }),
		).toBeDisabled();
		await absentmindedPage.locator("select").selectOption("Other");
		await absentmindedPage
			.getByRole("button", { name: /Mark me as absent/ })
			.click();
		await expect(
			absentmindedPage.getByText(/Successfully Absent/),
		).toBeVisible();
		// Login as QRCodeHater and attend manually
		await login(qrcodehaterPage, `qrcodehater.${browserName}@acme.org`);
		await qrcodehaterPage.waitForURL(/attendee/);
		await qrcodehaterPage.locator("input[name='groupCode']").click();
		await qrcodehaterPage.locator("input[name='groupCode']").fill(code);
		await qrcodehaterPage.getByRole("link", { name: /Attend/ }).click();
		await qrcodehaterPage.waitForURL(/attendee\/attend/);
		await expect(qrcodehaterPage.getByText(/Attended/)).toBeVisible();
		// "Accidentally" mark QRCodeHater as absent
		await expect(
			qrcodehaterPage.getByRole("button", { name: /Mark me as absent/ }),
		).toBeDisabled();
		await qrcodehaterPage.locator("select").selectOption("Other");
		await qrcodehaterPage
			.getByRole("button", { name: /Mark me as absent/ })
			.click();
		await expect(
			qrcodehaterPage.getByText(/Successfully Absent/),
		).toBeVisible();
		await qrcodehaterPage
			.getByRole("button", { name: /Actually here/ })
			.click();
		await expect(qrcodehaterPage.getByText(/Successfully Absent/)).toBeHidden();
		await expect(hostPage.getByRole("cell", { name: "Lawful" })).toBeVisible();
		await expect(
			hostPage.getByRole("cell", { name: "Absentminded" }),
		).toBeVisible();
		await expect(
			hostPage.getByRole("cell", { name: "Qrcodehater" }),
		).toBeVisible();
	});
});
