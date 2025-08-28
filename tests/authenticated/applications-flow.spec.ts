import { expect, test } from "@playwright/test"
import { withDocCategory, withDocMeta } from "@test2doc/playwright/DocMeta"
import { screenshot } from "@test2doc/playwright/screenshots"

test.describe(
  withDocCategory("Applications Flow", { label: "Applications", position: 2 }),
  () => {
    test.describe
      // TODO: remove serial and figure out how to run in parallel again
      .serial(
        withDocMeta("Applications Page Navigation", {
          sidebar_position: 1,
        }),
        () => {
          test("logo should redirect to home page", async ({
            page,
          }, testInfo) => {
            await test.step("Navigate to applications page", async () => {
              await page.goto("/applications")

              expect(page.url()).toContain("/applications")

              await expect(
                page.getByRole("heading", { name: "All Applications" }),
              ).toBeVisible()
            })

            await test.step("Click on logo", async () => {
              const logo = page.getByRole("link", {
                name: "Apply Wize Apply Wize",
              })
              await screenshot(testInfo, logo)
              await logo.click()
            })

            await test.step("Verify navigation to home page", async () => {
              await expect(page.getByRole("paragraph")).toContainText(
                "You are logged in as user",
              )
            })
          })

          test("new application button navigates to the new application page", async ({
            page,
          }, testInfo) => {
            await test.step("Navigate to applications page", async () => {
              await page.goto("/applications")

              await expect(
                page.getByRole("heading", { name: "All Applications" }),
              ).toBeVisible()
            })

            await test.step("Click on new application button", async () => {
              const newApplicationButton = page.getByRole("link", {
                name: "New Application",
              })
              await screenshot(testInfo, newApplicationButton)
              await newApplicationButton.click()
            })

            await test.step("Verify navigation to new application page", async () => {
              await expect(
                page.getByRole("heading", { name: "New Application" }),
              ).toBeVisible()
            })
          })

          test("filter between active and archived applications", async ({
            page,
          }, testInfo) => {
            await test.step("Navigate to applications page.", async () => {
              await page.goto("/applications")

              expect(page.url()).toContain("/applications")

              await expect(
                page.getByRole("heading", { name: "All Applications" }),
              ).toBeVisible()
            })

            await test.step("The table should populate with active applications.", async () => {
              const table = page.getByRole("table")
              await screenshot(testInfo, table)
              await expect(table).toBeVisible()
            })

            await test.step("Click on archived applications filter button.", async () => {
              const archivedFilter = page.getByRole("link", {
                name: "Archive",
              })
              await screenshot(testInfo, archivedFilter)
              await archivedFilter.click()
            })

            await test.step("Now archived applications should be displayed. If you haven't already archived an application the table won't appear.", async () => {
              const table = page.getByRole("table")
              await expect(table).not.toBeVisible()
              const message = page.getByText("No applications found")
              await screenshot(testInfo, message)
              await expect(message).toBeVisible()
            })

            await test.step("Click on active applications filter button will return back to active applications.", async () => {
              const activeFilter = page.getByRole("link", {
                name: "Active",
              })
              await screenshot(testInfo, activeFilter)
              await activeFilter.click()
            })

            await test.step("Now active applications should be displayed again.", async () => {
              const table = page.getByRole("table")
              await screenshot(testInfo, table)
              await expect(table).toBeVisible()
            })
          })

          test("How to logout", async ({ page }, testInfo) => {
            await test.step("While on the applications page.", async () => {
              await page.goto("/applications")

              await expect(
                page.getByRole("heading", { name: "All Applications" }),
              ).toBeVisible()
            })

            await test.step("Click on logout button.", async () => {
              const logoutButton = page.getByRole("link", {
                name: "Logout",
              })
              await screenshot(testInfo, logoutButton)
              await logoutButton.click()
            })

            await test.step("Now you should be logged out and on the login page.", async () => {
              const loginHeading = page.getByRole("heading", { name: "Login" })
              await screenshot(testInfo, loginHeading)
              await expect(loginHeading).toBeVisible()
            })

            await test.step("To confirm that you are logged out if you try to go back to the applications page (/applications) it will redirect to login.", async () => {
              await page.goto("/applications")
              await expect(
                page.getByRole("heading", { name: "Login" }),
              ).toBeVisible()
            })
          })
        },
      )
  },
)
