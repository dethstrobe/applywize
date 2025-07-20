import { test, expect, CDPSession } from "@playwright/test"
import { screenshot } from "@test2doc/playwright/screenshots"

test.describe("Sign up Page", () => {
  test("Navigate to the login in page", async ({ page }, testInfo) => {
    await test.step("On the sign up page", async () => {
      await page.goto("/user/signup")

      await screenshot(testInfo, page)

      await expect(
        page.getByRole("heading", { name: "Create an Account" }),
      ).toBeVisible()
      console.log("Sign up page loaded", Date.now())
    })

    await test.step("Click the login link", async () => {
      const loginLink = page.getByRole("link", { name: "Login" })

      await screenshot(testInfo, loginLink)

      await expect(
        page.getByRole("heading", { name: "Login" }),
      ).not.toBeAttached()

      await loginLink.click()

      await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()
      console.log("Navigated to login page", Date.now())
    })
  })

  test("Navigate to the privacy policy", async ({ page }, testInfo) => {
    await test.step("On the sign up page", async () => {
      await page.goto("/user/signup")

      await screenshot(testInfo, page)

      expect(
        page.getByRole("heading", { name: "Create an Account" }),
      ).toBeVisible()
    })

    await test.step("Click the privacy policy link", async () => {
      const privacyPolicyLink = page.getByRole("link", {
        name: "Privacy Policy",
      })

      await screenshot(testInfo, privacyPolicyLink)

      await expect(
        page.getByRole("heading", { name: "Privacy Policy" }),
      ).not.toBeAttached()

      await privacyPolicyLink.click()

      await expect(
        page.getByRole("heading", { name: "Privacy Policy" }),
      ).toBeVisible()
    })
  })

  test("Navigate to the terms of service", async ({ page }, testInfo) => {
    await test.step("On the sign up page", async () => {
      await page.goto("/user/signup")

      await screenshot(testInfo, page)

      await expect(
        page.getByRole("heading", { name: "Create an Account" }),
      ).toBeVisible()
    })

    await test.step("Click the terms of service link", async () => {
      const termsOfServiceLink = page.getByRole("link", {
        name: "Terms of Service",
      })

      await screenshot(testInfo, termsOfServiceLink)

      await expect(
        page.getByRole("heading", { name: "Terms of Service" }),
      ).not.toBeAttached()

      await termsOfServiceLink.click()
    })

    await expect(
      page.getByRole("heading", { name: "Terms of Service" }),
    ).toBeVisible()
  })

  async function simulateSuccessfulPasskeyInput(
    client: CDPSession,
    authenticatorId: string,
    operationTrigger: () => Promise<void>,
  ) {
    // initialize event listeners to wait for a successful passkey input event
    const operationCompleted = new Promise<void>((resolve) => {
      client.on("WebAuthn.credentialAdded", () => resolve())
      client.on("WebAuthn.credentialAsserted", () => resolve())
    })

    // set isUserVerified option to true
    // (so that subsequent passkey operations will be successful)
    await client.send("WebAuthn.setUserVerified", {
      authenticatorId: authenticatorId,
      isUserVerified: true,
    })

    // set automaticPresenceSimulation option to true
    // (so that the virtual authenticator will respond to the next passkey prompt)
    await client.send("WebAuthn.setAutomaticPresenceSimulation", {
      authenticatorId: authenticatorId,
      enabled: true,
    })

    // perform a user action that triggers passkey prompt
    await operationTrigger()

    // wait to receive the event that the passkey was successfully registered or verified
    await operationCompleted

    // set automaticPresenceSimulation option back to false
    await client.send("WebAuthn.setAutomaticPresenceSimulation", {
      authenticatorId,
      enabled: false,
    })
  }

  test("Register a new user and login", async ({ page }, testInfo) => {
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

    const username = `testuser-${Date.now()}`

    await test.step("On the sign up page", async () => {
      await page.goto("/user/signup")

      await screenshot(testInfo, page)

      const result = await client.send("WebAuthn.getCredentials", {
        authenticatorId,
      })
      expect(result.credentials).toHaveLength(0)
    })

    await test.step("Fill in the sign up form and submit", async () => {
      const usernameInput = page.getByLabel("Username")

      await screenshot(testInfo, usernameInput)

      await usernameInput.fill(username)

      const submitButton = page.getByRole("button", {
        name: "Register with passkey",
      })

      await screenshot(testInfo, submitButton)

      await simulateSuccessfulPasskeyInput(
        client,
        authenticatorId,
        async () => await submitButton.click(),
      )

      const result2 = await client.send("WebAuthn.getCredentials", {
        authenticatorId,
      })
      expect(result2.credentials).toHaveLength(1)
    })

    await test.step("On the login page should be able to log in with new passkey", async () => {
      await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()

      const loginUsernameInput = page.getByLabel("Username")
      await loginUsernameInput.fill(username)

      const loginButton = page.getByRole("button", {
        name: "Login with passkey",
      })

      await screenshot(testInfo, loginButton)

      await simulateSuccessfulPasskeyInput(
        client,
        authenticatorId,
        async () => await loginButton.click(),
      )

      await expect(page).toHaveURL("/protected")

      await expect(page.getByRole("paragraph")).toHaveText(
        `You are logged in as user ${username}`,
      )
    })
  })
})
