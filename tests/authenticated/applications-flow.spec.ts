import { expect, test } from "@playwright/test"
import { withDocCategory, withDocMeta } from "@test2doc/playwright/DocMeta"
import { screenshot } from "@test2doc/playwright/screenshots"
import { TodaysDate } from "../util"

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

          test("Create a new application", async ({ page }, testInfo) => {
            const corpName = `Mega Co. ${Date.now()}`
            await test.step("While on the applications page", async () => {
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
              await expect(
                page.getByRole("heading", { name: "New Application" }),
              ).toBeVisible()
            })

            await test.step(`### New Application page
              You should have navigated to the New Application page where you can fill out the company information form`, async () => {
              const form = page.getByRole("form", {
                name: "Company Information",
              })
              await screenshot(testInfo, form)
              await expect(form).toBeVisible()
            })

            await test.step("#### Enter the company name", async () => {
              const companyInput = page.getByRole("textbox", {
                name: "Company",
              })
              await companyInput.fill(corpName)
              await screenshot(testInfo, companyInput)
            })

            await test.step("#### Enter the job title", async () => {
              const jobTitleInput = page.getByRole("textbox", {
                name: "Job Title",
              })
              await jobTitleInput.fill("Matrix Network Engineer")
              await screenshot(testInfo, jobTitleInput)
            })

            await test.step("#### Enter the job description", async () => {
              const jobDescriptionInput = page.getByRole("textbox", {
                name: "Job Description / Requirements",
              })
              await jobDescriptionInput.fill(
                "Design and implement complex wireless Matrix systems",
              )
              await screenshot(testInfo, jobDescriptionInput)
            })

            await test.step("#### Enter the salary range", async () => {
              const salaryMinInput = page.getByRole("textbox", {
                name: "Min",
              })
              await salaryMinInput.fill("80000¥")
              await screenshot(testInfo, salaryMinInput)

              const salaryMaxInput = page.getByRole("textbox", {
                name: "Max",
              })
              await salaryMaxInput.fill("120000¥")
              await screenshot(testInfo, salaryMaxInput)
            })

            await test.step("#### Enter the application URL", async () => {
              const urlInput = page.getByRole("textbox", {
                name: "Application URL",
              })
              await urlInput.fill(
                "https://shadowrun.fandom.com/wiki/Mitsuhama_Computer_Technologies",
              )
              await screenshot(testInfo, urlInput)
            })

            const dateButton = page.getByRole("button", {
              name: "Pick a date",
            })
            await test.step("#### Enter the date intended to apply to this company", async () => {
              await screenshot(testInfo, dateButton)
            })

            await test.step("Click the date button to open the date picker.", async () => {
              await dateButton.click()
              const datePicker = page.getByRole("dialog")
              await screenshot(testInfo, datePicker)
            })

            await test.step("Select a date from the date picker.", async () => {
              const dateOption = page.getByRole("button", {
                name: TodaysDate(),
              })
              await screenshot(testInfo, dateOption)
              await dateOption.click()
            })

            await test.step("Click outside of the date picker or press escape to close it.", async () => {
              await page.keyboard.press("Escape")
              await expect(page.getByRole("dialog")).toBeHidden()
              await screenshot(testInfo, page)
            })

            await test.step("#### Select one of the Application Statuses", async () => {
              const statusSelect = page.getByRole("combobox", {
                name: "Application Status",
              })
              await screenshot(testInfo, statusSelect)
              await statusSelect.click()
            })

            await test.step("Click the Application Statuses button to open the dropdown", async () => {
              const selectOptions = page.getByRole("listbox")

              await screenshot(testInfo, selectOptions)
            })

            await test.step("Select one of the application statuses from the dropdown", async () => {
              const newOption = page.getByRole("option", {
                name: "New",
              })
              await screenshot(testInfo, newOption)
              await newOption.click()
            })

            await test.step(`#### Add a Contact for the Application
              Open the Add a Contact sheet by clicking the "Add a contact" button.`, async () => {
              const addContactButton = page.getByRole("button", {
                name: "Add a contact",
              })
              await screenshot(testInfo, addContactButton)
              await addContactButton.click()
            })
            await test.step("##### Enter the First Name of the contact", async () => {
              const firstNameInput = page.getByRole("textbox", {
                name: "First Name",
              })
              await firstNameInput.fill("John")
              await screenshot(testInfo, firstNameInput)
            })
            await test.step("##### Enter the Last Name of the contact", async () => {
              const lastNameInput = page.getByRole("textbox", {
                name: "Last Name",
              })
              await lastNameInput.fill("Doe")
              await screenshot(testInfo, lastNameInput)
            })
            await test.step("##### Enter the contacts role in the company", async () => {
              const roleInput = page.getByRole("textbox", {
                name: "Role",
              })
              await roleInput.fill("Hiring Manager")
              await screenshot(testInfo, roleInput)
            })
            await test.step("##### Enter the contacts email address", async () => {
              const emailInput = page.getByRole("textbox", {
                name: "Email",
              })
              await emailInput.fill("john.doe@example.com")
              await screenshot(testInfo, emailInput)
            })
            await test.step('##### Add the contact by clicking the "Create a Contact" button', async () => {
              const createButton = page.getByRole("button", {
                name: "Create a contact",
              })
              await screenshot(testInfo, createButton)
              await createButton.click()
            })
            await test.step("Your new contact appears on the Contacts section", async () => {
              const contactCard = page.getByRole("listitem").filter({
                hasText: "John Doe",
              })
              await expect(contactCard).toBeVisible()
              await screenshot(testInfo, contactCard)
            })

            await test.step("#### Submit the form", async () => {
              const submitButton = page.getByRole("button", {
                name: "Create",
              })
              await screenshot(testInfo, submitButton)
              await submitButton.click()
            })

            await test.step("You should be redirected to the Applications page where you can see your new application.", async () => {
              await expect(
                page.getByRole("heading", { name: "All Applications" }),
              ).toBeVisible()

              const newlyAddedApplication = page.getByText(corpName)
              await expect(newlyAddedApplication).toBeVisible()
              await screenshot(testInfo, newlyAddedApplication)
            })
          })

          test("Removing a contact from a new application", async ({
            page,
          }, testInfo) => {
            await test.step("While on the new applications page if you've already added a contact", async () => {
              await page.goto("/applications/new")

              await page
                .getByRole("button", {
                  name: "Add a contact",
                })
                .click()

              await page
                .getByRole("textbox", { name: "First Name" })
                .fill("John")
              await page.getByRole("textbox", { name: "Last Name" }).fill("Doe")
              await page
                .getByRole("textbox", { name: "Email" })
                .fill("john.doe@example.com")
              await page
                .getByRole("textbox", { name: "Role" })
                .fill("Hiring Manager")

              await page
                .getByRole("button", {
                  name: "Create",
                })
                .click()

              const contactCard = page
                .getByRole("listitem")
                .filter({ hasText: "John Doe" })
              await expect(contactCard).toBeVisible()
              await screenshot(testInfo, contactCard)
            })

            await test.step("Hover over the contact card to make the delete button appear", async () => {
              await page
                .getByRole("listitem")
                .filter({ hasText: "John Doe" })
                .hover()
              const deleteButton = page.getByRole("button", {
                name: "Delete contact John Doe",
              })
              await expect(deleteButton).toBeVisible()
              await screenshot(testInfo, deleteButton)
            })

            await test.step("clicking the delete button will remove the contact from the application", async () => {
              await page
                .getByRole("button", {
                  name: "Delete contact John Doe",
                })
                .click()
              const contactList = page.getByRole("list", { name: "Contacts" })
              await screenshot(testInfo, contactList)

              await expect(
                page.getByRole("heading", {
                  name: "John Doe",
                }),
              ).not.toBeVisible()
              await expect(contactList.locator("li")).toHaveCount(0)
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
