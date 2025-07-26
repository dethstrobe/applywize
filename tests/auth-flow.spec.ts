import { test, expect, type CDPSession } from "@playwright/test"
import { screenshot } from "@test2doc/playwright/screenshots"
import { withDocCategory, withDocMeta } from "@test2doc/playwright/DocMeta"

test.describe(
  withDocCategory("User Authentication Flow", { label: "User Authentication" }),
  () => {
    test.describe("Authentication", () => {
      const username = `testuser-${Date.now()}`

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
          await expect(
            page.getByRole("heading", { name: "Login" }),
          ).toBeVisible()

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

    test.describe(withDocMeta("Auth Navigation", {}), () => {
      test("Link to the sign up page", async ({ page }, testInfo) => {
        await test.step("Registration link on the login page", async () => {
          await page.goto("/user/login")

          const signUpLink = page.getByRole("link", { name: "Register" })

          await expect(signUpLink).toHaveAttribute("href", "/user/signup")
          await expect(signUpLink).toBeVisible()

          await screenshot(testInfo, signUpLink)
        })
      })

      test("Link to the login page", async ({ page }, testInfo) => {
        await test.step("Login link on the sign up page", async () => {
          await page.goto("/user/signup")

          const loginLink = page.getByRole("link", { name: "Login" })

          await expect(loginLink).toHaveAttribute("href", "/user/login")
          await expect(loginLink).toBeVisible()

          await screenshot(testInfo, loginLink)
        })
      })
    })

    test.describe(
      withDocCategory("Links to legal documentation", {
        label: "Legal Documentation",
      }),
      () => {
        test.describe(
          withDocMeta("Privacy Policy", {
            description: "Where to find the Privacy Policy for the application",
          }),
          () => {
            test("Sign up page", async ({ page }, testInfo) => {
              await test.step("Contains a link to the Privacy Policy", async () => {
                await page.goto("/user/signup")
                const link = page.getByRole("link", { name: "Privacy Policy" })
                await expect(link).toHaveAttribute("href", "/legal/privacy")
                await screenshot(testInfo, link)
              })
            })

            test("Login page", async ({ page }, testInfo) => {
              await test.step("Contains a link to the Privacy Policy", async () => {
                await page.goto("/user/login")
                const link = page.getByRole("link", { name: "Privacy Policy" })
                await expect(link).toHaveAttribute("href", "/legal/privacy")
                await screenshot(testInfo, link)
              })
            })
          },
        )

        test.describe(
          withDocMeta("Terms of Service", {
            description:
              "Where to find the Terms of Service for the application",
          }),
          () => {
            test("Sign up page", async ({ page }, testInfo) => {
              await test.step("Contains a link to the Terms of Service", async () => {
                await page.goto("/user/signup")
                const link = page.getByRole("link", {
                  name: "Terms of Service",
                })
                await expect(link).toHaveAttribute("href", "/legal/terms")
                await screenshot(testInfo, link)
              })
            })

            test("Login page", async ({ page }, testInfo) => {
              await test.step("Contains a link to the Terms of Service", async () => {
                await page.goto("/user/login")
                const link = page.getByRole("link", {
                  name: "Terms of Service",
                })
                await expect(link).toHaveAttribute("href", "/legal/terms")
                await screenshot(testInfo, link)
              })
            })
          },
        )
      },
    )
  },
)
