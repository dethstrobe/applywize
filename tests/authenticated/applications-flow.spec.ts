import { expect, type Page, test } from "@playwright/test"
import { withDocCategory, withDocMeta } from "@test2doc/playwright/DocMeta"
import { screenshot } from "@test2doc/playwright/screenshots"
import { addDays, format } from "date-fns"

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
                name: format(new Date(), "EEEE, MMMM do, yyyy"),
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

          const createApplication = async (page: Page) => {
            await page.goto("/applications/new")

            const companyName = `Acme Corp ${Date.now()}`

            await page
              .getByRole("textbox", { name: "Company" })
              .fill(companyName)
            await page
              .getByRole("textbox", { name: "Job Title" })
              .fill("Software Engineer")
            await page
              .getByRole("textbox", { name: "Job Description" })
              .fill("Looking for a skilled developer")
            await page.getByRole("textbox", { name: "Min" }).fill("100000")
            await page.getByRole("textbox", { name: "Max" }).fill("150000")
            await page
              .getByRole("textbox", { name: "Application URL" })
              .fill("https://acme.com/apply")
            await page.getByRole("button", { name: "Pick a date" }).click()
            const applicationDate = new Date()
            await page
              .getByRole("button", {
                name: format(applicationDate, "EEEE, MMMM do, yyyy"),
              })
              .click()
            await page
              .getByRole("combobox", { name: "Application Status" })
              .click()
            await page.getByRole("option", { name: "New" }).click()
            await page.getByRole("button", { name: "Add a Contact" }).click()
            await page
              .getByRole("textbox", { name: "First Name" })
              .fill("Wile E.")
            await page
              .getByRole("textbox", { name: "Last Name" })
              .fill("Coyote")
            await page
              .getByRole("textbox", { name: "Email" })
              .fill("we.coyote@acme.com")
            await page.getByRole("textbox", { name: "Role" }).fill("Inventor")
            await page.getByRole("button", { name: "Create a Contact" }).click()

            await expect(
              page.getByRole("form", { name: "Create Contact" }),
            ).not.toBeInViewport()

            const applicationForm = page.getByRole("form", {
              name: "Company Information",
            })
            await applicationForm
              .getByRole("button", { name: "Create" })
              .click()

            await expect(
              page.getByRole("heading", { name: "All Applications" }),
            ).toBeVisible()
            await expect(page.getByText(companyName)).toBeVisible()

            return { companyName, applicationDate }
          }

          test("View the details of an Application", async ({
            page,
          }, testInfo) => {
            const { companyName } = await createApplication(page)

            await test.step("Click on the view detail icon to open the view detail page", async () => {
              const viewDetailButton = page.getByRole("link", {
                name: `View details for ${companyName} Software Engineer`,
              })
              await screenshot(testInfo, viewDetailButton)
              await viewDetailButton.click()
              const heading = page.getByRole("heading", {
                name: "Software Engineer",
              })
              await expect(heading).toBeVisible()
              await screenshot(testInfo, page)
            })

            await test.step(`#### Elements on the details page
              ##### Job Title`, async () => {
              const jobTitle = page.getByRole("heading", {
                name: "Software Engineer",
              })
              await expect(jobTitle).toBeVisible()
              await screenshot(testInfo, jobTitle)
            })

            await test.step("##### Application Status", async () => {
              const status = page.getByLabel("Application status: New")
              await expect(status).toBeVisible()
              await screenshot(testInfo, status)
            })

            await test.step("##### Link to the job application website", async () => {
              const website = page.getByRole("link", {
                name: "View Application",
              })
              await expect(website).toBeVisible()
              await screenshot(testInfo, website)
            })

            await test.step("##### Job Description", async () => {
              const jobDescriptionSection = page.getByRole("region", {
                name: "Job Description",
              })
              await expect(jobDescriptionSection).toBeVisible()
              await screenshot(testInfo, jobDescriptionSection)
            })

            await test.step("##### Compensation", async () => {
              const compensation = page.getByRole("region", {
                name: "Compensation",
              })
              await expect(compensation).toBeVisible()
              await screenshot(testInfo, compensation)
            })

            await test.step("##### Contacts", async () => {
              const contacts = page.getByRole("region", { name: "Contacts" })
              await expect(contacts).toBeVisible()
              await screenshot(testInfo, contacts)
            })

            await test.step("##### Edit Application button", async () => {
              const editButton = page.getByRole("link", {
                name: "Edit",
              })
              await expect(editButton).toBeVisible()
              await screenshot(testInfo, editButton)
            })

            await test.step("##### Delete Applications button", async () => {
              const deleteButton = page.getByRole("button", {
                name: "Delete",
              })
              await expect(deleteButton).toBeVisible()
              await screenshot(testInfo, deleteButton)
            })
          })

          test("Edit an existing application", async ({ page }, testInfo) => {
            const { companyName, applicationDate } =
              await createApplication(page)
            await test.step("While on an application's detail page, click on the edit button.", async () => {
              await page
                .getByRole("link", {
                  name: `View details for ${companyName} Software Engineer`,
                })
                .click()
              const editButton = page.getByRole("link", {
                name: "Edit",
              })
              await screenshot(testInfo, editButton)
              await editButton.click()
            })

            await test.step("This will navigate you to the Edit Application page. Here we find the edit form to update all the same fields as found in the new application page.", async () => {
              await expect(
                page.getByRole("heading", { name: "Edit Software Engineer" }),
              ).toBeVisible()
              await screenshot(testInfo, page)
            })

            await test.step("##### Company Name", async () => {
              const companyNameInput = page.getByRole("textbox", {
                name: "Company",
              })
              await expect(companyNameInput).toBeVisible()
              await companyNameInput.fill(`${companyName} - Edited`)
              await screenshot(testInfo, companyNameInput)
            })

            await test.step("##### Job Title", async () => {
              const jobTitleInput = page.getByRole("textbox", {
                name: "Job Title",
              })
              await expect(jobTitleInput).toBeVisible()
              await jobTitleInput.fill("Senior Software Engineer")
              await screenshot(testInfo, jobTitleInput)
            })

            await test.step("##### Job Description", async () => {
              const jobDescriptionInput = page.getByRole("textbox", {
                name: "Job Description / Requirements",
              })
              await expect(jobDescriptionInput).toBeVisible()
              await jobDescriptionInput.fill(
                "Looking for a skilled developer with 5+ years of experience",
              )
              await screenshot(testInfo, jobDescriptionInput)
            })

            await test.step("##### Salary Range", async () => {
              const salaryMinInput = page.getByRole("textbox", {
                name: "Min",
              })
              await expect(salaryMinInput).toBeVisible()
              await salaryMinInput.fill("150000")
              await screenshot(testInfo, salaryMinInput)

              const salaryMaxInput = page.getByRole("textbox", {
                name: "Max",
              })
              await expect(salaryMaxInput).toBeVisible()
              await salaryMaxInput.fill("200000")
              await screenshot(testInfo, salaryMaxInput)
            })

            await test.step("##### Application URL", async () => {
              const urlInput = page.getByRole("textbox", {
                name: "Application URL",
              })
              await expect(urlInput).toBeVisible()
              await urlInput.fill("https://acme.com/careers")
              await screenshot(testInfo, urlInput)
            })

            await test.step("##### Application Date", async () => {
              const dateButton = page.getByRole("button", {
                name: format(applicationDate, "PPP"),
              })
              await expect(dateButton).toBeVisible()
              await screenshot(testInfo, dateButton)

              await dateButton.click()
              const datePicker = page.getByRole("dialog")
              await expect(datePicker).toBeVisible()
              await screenshot(testInfo, datePicker)

              const tomorrow = addDays(applicationDate, 1)
              const dateOption = page.getByRole("button", {
                name: format(tomorrow, "EEEE, MMMM do, yyyy"),
              })
              await screenshot(testInfo, dateOption)
              await dateOption.click()

              await page.keyboard.press("Escape")
              await expect(page.getByRole("dialog")).toBeHidden()
              await screenshot(testInfo, page)
            })

            await test.step("##### Application Status", async () => {
              const statusSelect = page.getByRole("combobox", {
                name: "Application Status",
              })
              await expect(statusSelect).toBeVisible()
              await screenshot(testInfo, statusSelect)
              await statusSelect.click()

              const selectOptions = page.getByRole("listbox")
              await expect(selectOptions).toBeVisible()
              await screenshot(testInfo, selectOptions)

              const interviewOption = page.getByRole("option", {
                name: "Interview",
              })
              await expect(interviewOption).toBeVisible()
              await screenshot(testInfo, interviewOption)
              await interviewOption.click()
            })

            await test.step("##### Add a Contact", async () => {
              const addContactButton = page.getByRole("button", {
                name: "Add a contact",
              })
              await expect(addContactButton).toBeVisible()
              await screenshot(testInfo, addContactButton)
              await addContactButton.click()

              const firstNameInput = page.getByRole("textbox", {
                name: "First Name",
              })
              await expect(firstNameInput).toBeVisible()
              await firstNameInput.fill("Bugs")
              await screenshot(testInfo, firstNameInput)

              const lastNameInput = page.getByRole("textbox", {
                name: "Last Name",
              })
              await expect(lastNameInput).toBeVisible()
              await lastNameInput.fill("Bunny")
              await screenshot(testInfo, lastNameInput)

              const roleInput = page.getByRole("textbox", {
                name: "Role",
              })
              await expect(roleInput).toBeVisible()
              await roleInput.fill("Wascally Wabbit")
              await screenshot(testInfo, roleInput)

              const emailInput = page.getByRole("textbox", {
                name: "Email",
              })
              await expect(emailInput).toBeVisible()
              await emailInput.fill("bugs@bunny.com")
              await screenshot(testInfo, emailInput)
              const createButton = page.getByRole("button", {
                name: "Create a contact",
              })
              await expect(createButton).toBeVisible()
              await screenshot(testInfo, createButton)
              await createButton.click()

              const contactCard = page.getByRole("heading", {
                name: "Bugs Bunny",
              })
              await expect(contactCard).toBeVisible()
              await screenshot(testInfo, contactCard)
            })

            await test.step("##### Remove a contact", async () => {
              const contactCard = page.getByRole("listitem").filter({
                hasText: "Wile E. Coyote",
              })
              await expect(contactCard).toBeVisible()
              await screenshot(testInfo, contactCard)

              await contactCard.hover()

              const removeButton = page.getByRole("button", {
                name: "Delete contact Wile E. Coyote",
              })
              await expect(removeButton).toBeVisible()
              await screenshot(testInfo, removeButton)
              await removeButton.click()

              await expect(contactCard).not.toBeVisible()
              await screenshot(testInfo, page)
            })

            await test.step("##### Submit the form", async () => {
              const submitButton = page.getByRole("button", {
                name: "Update",
              })
              await expect(submitButton).toBeVisible()
              await screenshot(testInfo, submitButton)
              await submitButton.click()
            })

            await test.step("You should be redirected to the application page where you can see the updated information.", async () => {
              const heading = page.getByRole("heading", {
                name: "All Applications",
              })
              await expect(heading).toBeVisible()
              await screenshot(testInfo, heading)

              const companyRow = page
                .getByRole("row")
                .filter({ hasText: companyName })

              await expect(companyRow).toContainText(`${companyName} - Edited`)
              await expect(companyRow).toContainText("Senior Software Engineer")
              await expect(companyRow).toContainText("Interview")
              await expect(companyRow).toContainText("Bugs Bunny")
              await expect(companyRow).toContainText("150000-200000")
              await screenshot(testInfo, companyRow)
            })
          })

          test("Cancel an in-progress application edit", async ({
            page,
          }, testInfo) => {
            const { companyName } = await createApplication(page)
            await test.step("On the application's detail edit page.", async () => {
              await page
                .getByRole("link", {
                  name: `View details for ${companyName} Software Engineer`,
                })
                .click()
              await expect(
                page.getByRole("heading", { name: "Software Engineer" }),
              ).toBeVisible()
              await page.getByRole("link", { name: "Edit" }).click()

              const heading = page.getByRole("heading", {
                name: "Edit Software Engineer",
              })
              await expect(heading).toBeVisible()
              await screenshot(testInfo, page)
            })

            await test.step("If you make a change to one of the fields in the form.", async () => {
              const jobTitleInput = page.getByRole("textbox", {
                name: "Job Title",
              })
              await expect(jobTitleInput).toBeVisible()
              await jobTitleInput.fill("Rockstar Software Engineer!")
              await screenshot(testInfo, jobTitleInput)
            })

            await test.step("And decide to cancel the edit, you can by clicking the cancel button.", async () => {
              const cancelButton = page.getByRole("link", {
                name: "Cancel",
              })
              await expect(cancelButton).toBeVisible()
              await screenshot(testInfo, cancelButton)
              await cancelButton.click()
            })

            await test.step("You should be redirected back to the application detail page and your changes will not be saved.", async () => {
              const heading = page.getByRole("heading", {
                name: "Software Engineer",
              })
              await expect(heading).toBeVisible()
              await screenshot(testInfo, heading)
            })
          })

          test("Delete an application", async ({ page }, testInfo) => {
            const { companyName } = await createApplication(page)
            await test.step("While on an application's detail page", async () => {
              await page
                .getByRole("link", {
                  name: `View details for ${companyName} Software Engineer`,
                })
                .click()
              const heading = page.getByRole("heading", {
                name: "Software Engineer",
              })
              await expect(heading).toBeVisible()
              await screenshot(testInfo, page)
            })

            await test.step("Click on the delete button to open the delete confirmation dialog.", async () => {
              const deleteButton = page.getByRole("button", {
                name: "Delete",
              })
              await expect(deleteButton).toBeVisible()
              await screenshot(testInfo, deleteButton)
              await deleteButton.click()
              const dialog = page.getByRole("dialog", {
                name: "Are you absolutely sure?",
              })
              await expect(dialog).toBeVisible()
              await screenshot(testInfo, dialog)
            })

            await test.step(`##### To dismiss the dialog
              ###### Click on the Nevermind button`, async () => {
              const neverMindButton = page.getByRole("button", {
                name: "Nevermind",
              })
              await expect(neverMindButton).toBeVisible()
              await screenshot(testInfo, neverMindButton)
              await neverMindButton.click()
              await expect(
                page.getByRole("dialog", { name: "Are you absolutely sure?" }),
              ).not.toBeVisible()

              await page
                .getByRole("button", {
                  name: "Delete",
                })
                .click()
            })

            await test.step("###### Click outside of the dialog", async () => {
              await page.click("body", { position: { x: 0, y: 0 } })
              await expect(
                page.getByRole("dialog", { name: "Are you absolutely sure?" }),
              ).not.toBeVisible()

              await page
                .getByRole("button", {
                  name: "Delete",
                })
                .click()
            })

            await test.step("###### Press the escape key", async () => {
              await page.keyboard.press("Escape")
              await expect(
                page.getByRole("dialog", { name: "Are you absolutely sure?" }),
              ).not.toBeVisible()

              await page
                .getByRole("button", {
                  name: "Delete",
                })
                .click()
            })

            await test.step("###### Click the X button in the top right of the dialog", async () => {
              const closeButton = page.getByRole("button", { name: "Close" })
              await expect(closeButton).toBeVisible()
              await screenshot(testInfo, closeButton)
              await closeButton.click()
              await expect(
                page.getByRole("dialog", { name: "Are you absolutely sure?" }),
              ).not.toBeVisible()

              await page
                .getByRole("button", {
                  name: "Delete",
                })
                .click()
            })

            await test.step(`##### To confirm the deletion of the application.
              Click on the \"Yes, Delete it!\" button`, async () => {
              const confirmButton = page.getByRole("button", {
                name: "Yes, Delete it",
              })
              await expect(confirmButton).toBeVisible()
              await screenshot(testInfo, confirmButton)
              await confirmButton.click()
            })

            await test.step("You should be redirected back to the applications page and the deleted application will no longer be listed.", async () => {
              const heading = page.getByRole("heading", {
                name: "All Applications",
              })
              await expect(heading).toBeVisible()
              await screenshot(testInfo, heading)

              const companyRow = page.getByText(companyName)

              await expect(companyRow).not.toBeVisible()
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
