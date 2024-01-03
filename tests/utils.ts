import { Page, expect } from "@playwright/test";

export async function login(page: Page, name: string) {
	await page.goto("/");
	await expect(page).toHaveScreenshot("login.png");
	await page.locator('input[name="email"]:not(dialog *)').fill(name);
	await page.locator('input[name="password"]:not(dialog *)').click();
	await page.locator('input[name="password"]:not(dialog *)').fill("123456");
	await page.getByRole("button", { name: /Sign In/g }).click();
}
export async function getCode(page: Page) {
	await page.goto("/host/dashboard");
	await page.getByRole("button", { name: "Register Attendees" }).click();
	const code = await page
		.locator(
			"xpath=.//div[contains(., 'Alternatively, enter the Passcode')]/following-sibling::div/div/text()/..",
		)
		.textContent();
	await expect(code).not.toBeNull();
	return code!;
}
export async function forceDashboardRefresh(page: Page) {
	await page.goto("/");
	await page.waitForURL(/dashboard/);
}
export async function removeStudent(page: Page) {
	await page
		.locator(
			':is([aria-label="Manage Attendees"] + div) .btn-dangerous:not(dialog .btn-dangerous)',
		)
		.click();
}
export async function createAccount(
	page: Page,
	email: string,
	name: string,
	type: "Host" | "Attendee",
) {
	await page.goto("/");
	await expect(page).toHaveScreenshot("login.png");
	await page.getByRole("button", { name: /No account/ }).click();
	await expect(page.getByRole("dialog")).toBeVisible();
	await expect(
		page.locator("dialog button", { hasText: /^Sign Up$/ }),
	).toBeVisible();
	await page.locator('dialog input[name="name"]').fill(name);
	await page.locator('dialog input[name="email"]').fill(email);
	await page.locator('dialog input[name="password"]').click();
	await page.locator('dialog input[name="password"]').fill("123456");
	await page.getByLabel(/who/i).selectOption(type);
	await expect(page).toHaveScreenshot(
		`${name}-${email.split("@")[0].replace(".", "-")}-signup.png`,
	);
	await page.locator("dialog button", { hasText: "Sign Up" }).click();
	await page.waitForURL(new RegExp(type.toLowerCase()));
}
export async function createGroup(page: Page, groupName: string) {
	await page.getByLabel("Manage Your Groups").click();
	await page.getByRole("button", { name: "Add Group" }).click();
	await expect(
		page.getByRole("button", { name: "Create Group" }),
	).toBeDisabled();
	await page.getByPlaceholder("Group name...").fill(groupName);
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
	// TODO: Account for multiple groups
	await expect(page).toHaveScreenshot(`${groupName}-dashboard-with-groups.png`);
	await expect(page.getByRole("combobox")).toBeVisible();
	await expect(page.getByRole("tabpanel")).toContainText(
		"No attendees registered.",
	);
}
export async function getAttendanceCode(page: Page) {
	const code = await page
		.locator("div:has(svg) + div .text-3xl.font-bold")
		.textContent();
	await expect(code).not.toBeNull();
	return code!;
}
