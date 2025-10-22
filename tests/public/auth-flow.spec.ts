import {
  test,
  expect,
  type CDPSession,
  BrowserContext,
  Page,
} from "@playwright/test"
import { screenshot } from "@test2doc/playwright/screenshots"
import { withDocCategory, withDocMeta } from "@test2doc/playwright/DocMeta"
import { simulateSuccessfulPasskeyInput } from "../util"

test.describe(
  withDocCategory("User Authentication Flow", {
    label: "User Authentication",
    position: 1,
  }),
  () => {
    test.describe
      .serial(withDocMeta("Authentication", { sidebar_position: 1 }), () => {
        const username = `testuser-public-${Date.now()}`
        let client: CDPSession
        let authenticatorId: string
        let sharedContext: BrowserContext
        let sharedPage: Page

        test.beforeAll(async ({ browser }) => {
          // Create shared context for both tests
          sharedContext = await browser.newContext()
          sharedPage = await sharedContext.newPage()
        })

        test.afterAll(async () => {
          await client?.detach()
          await sharedContext?.close()
        })

        test("Register a new user", async ({ page: _ }, testInfo) => {
          client = await sharedPage.context().newCDPSession(sharedPage)

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

          authenticatorId = result.authenticatorId

          await test.step("On the sign up page, `/user/signup`.", async () => {
            await sharedPage.goto("/user/signup")

            await screenshot(testInfo, sharedPage)

            const result = await client.send("WebAuthn.getCredentials", {
              authenticatorId,
            })
            expect(result.credentials).toHaveLength(0)
          })

          await test.step("Fill in the sign up form with the username you wish to use.", async () => {
            const usernameInput = sharedPage.getByLabel("Username")

            await usernameInput.fill(username)

            await screenshot(testInfo, usernameInput, {
              annotation: { text: "Enter user name here." },
            })
          })

          await test.step("Submit the sign up form to initiate passkey registration.", async () => {
            const submitButton = sharedPage.getByRole("button", {
              name: "Register with passkey",
            })

            await screenshot(testInfo, submitButton, {
              annotation: { text: "Click button to submit the form" },
            })

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

          await test.step("On the login page, you can login with the generated new passkey", async () => {
            await expect(
              sharedPage.getByRole("heading", { name: "Login" }),
            ).toBeVisible()

            // const loginUsernameInput = sharedPage.getByLabel("Username")
            // await loginUsernameInput.fill(username)

            const loginButton = sharedPage.getByRole("button", {
              name: "Login with passkey",
            })

            await simulateSuccessfulPasskeyInput(
              client,
              authenticatorId,
              async () => await loginButton.click(),
            )

            await expect(sharedPage).toHaveURL("/applications")

            await expect(sharedPage.getByRole("heading")).toHaveText(
              "All Applications",
            )
          })
        })

        test("Login with an existing user", async ({ page: _ }, testInfo) => {
          await client.send("WebAuthn.enable")

          await test.step("On the login page, `/user/login`.", async () => {
            await sharedPage.goto("/user/login")

            await screenshot(testInfo, sharedPage)

            const result = await client.send("WebAuthn.getCredentials", {
              authenticatorId,
            })
            expect(result.credentials).toHaveLength(1)
          })

          // await test.step("Enter username in to the login form. *optional*", async () => {
          //   const usernameInput = sharedPage.getByLabel("Username")

          //   await screenshot(testInfo, usernameInput)

          //   await usernameInput.fill(username)

          //   await screenshot(testInfo, usernameInput)
          // })

          await test.step("Click the submit button.", async () => {
            const submitButton = sharedPage.getByRole("button", {
              name: "Login with passkey",
            })

            await screenshot(testInfo, submitButton, {
              annotation: { text: "Click the button to trigger the passkey" },
            })

            await simulateSuccessfulPasskeyInput(
              client,
              authenticatorId,
              async () => await submitButton.click(),
            )
          })

          await test.step("On successful login you'll be redirected to the protected page", async () => {
            await expect(sharedPage).toHaveURL("/applications")

            await expect(sharedPage.getByRole("heading")).toHaveText(
              "All Applications",
            )
          })
        })
      })

    test.describe(
      withDocMeta("Auth Navigation", {
        sidebar_position: 2,
        description: "Links to the sign up and login pages",
      }),
      () => {
        test("Link to the sign up page", async ({ page }, testInfo) => {
          await test.step("Registration link on the login page", async () => {
            await page.goto("/user/login")

            const signUpLink = page.getByRole("link", { name: "Register" })

            await expect(signUpLink).toHaveAttribute("href", "/user/signup")
            await expect(signUpLink).toBeVisible()

            await screenshot(testInfo, signUpLink, {annotation: { text: "Click to go to the sign up page" }})
          })
        })

        test("Link to the login page", async ({ page }, testInfo) => {
          await test.step("Login link on the sign up page", async () => {
            await page.goto("/user/signup")

            const loginLink = page.getByRole("link", { name: "Login" })

            await expect(loginLink).toHaveAttribute("href", "/user/login")
            await expect(loginLink).toBeVisible()

            await screenshot(testInfo, loginLink, {annotation: { text: "Click to go to the login page" }})
          })
        })
      },
    )

    test.describe(
      withDocCategory("Links to legal documentation", {
        label: "Legal Documentation",
        position: 3,
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
