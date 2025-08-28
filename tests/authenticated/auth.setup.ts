import { expect, test } from "@playwright/test"
import { simulateSuccessfulPasskeyInput } from "../util"

const authFile = "playwright/.auth/user.json"

const username = `test-setup-${Date.now()}`

test("authentication", async ({ page }) => {
  const client = await page.context().newCDPSession(page)

  // Enable WebAuthn environment in this session
  await client.send("WebAuthn.enable")

  // Attach a virtual authenticator with specific options
  const result = await client.send("WebAuthn.addVirtualAuthenticator", {
    options: {
      protocol: "ctap2",
      transport: "internal",
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
      automaticPresenceSimulation: true,
    },
  })

  const authenticatorId = result.authenticatorId

  await page.goto("/user/signup")
  await page.waitForLoadState("networkidle")

  await page.getByLabel("Username").fill(username)

  const submitButton = page.getByRole("button", {
    name: "Register with passkey",
  })

  await simulateSuccessfulPasskeyInput(
    client,
    authenticatorId,
    async () => await submitButton.click(),
  )
  await page.waitForLoadState("networkidle")
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()

  await page.getByLabel("Username").fill(username)

  const loginButton = page.getByRole("button", {
    name: "Login with passkey",
  })

  await simulateSuccessfulPasskeyInput(
    client,
    authenticatorId,
    async () => await loginButton.click(),
  )

  await expect(page).toHaveURL("http://localhost:5173/applications", {
    timeout: 5000,
  })
  await expect(page.getByRole("heading")).toHaveText("All Applications")

  await page.context().storageState({ path: authFile })
})
