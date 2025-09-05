"use client"

import { ApplicationStatus } from "@generated/prisma/client"
import { Button } from "./ui/button"
import { DatePicker } from "./ui/datepicker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { updateApplication } from "@/app/pages/applications/functions"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet"
import { Icon } from "./Icon"
import { ContactForm } from "./ContactForm"
import { useState } from "react"
import { ContactCard } from "./ContactCard"
import type { ApplicationWithRelations } from "../pages/applications/List"
import Link from "@theme/DocSidebarItem/Link"
import { link } from "../shared/links"

interface Props {
  statuses: ApplicationStatus[]
  application: ApplicationWithRelations
}

export const EditApplicationForm = ({ statuses, application }: Props) => {
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false)
  const handleSubmit = async (formData: FormData) => {
    formData.append("contacts", JSON.stringify(application))
    const result = await updateApplication(formData)

    if (result.success) {
      window.location.href = "/applications"
    } else {
      console.error(result.error)
    }
  }

  return (
    <form action={handleSubmit} aria-labelledby="company-info-heading">
      <div className="px-page-side two-column-grid">
        <section>
          <input type="hidden" name="id" value={application.id} />
          <h2 id="company-info-heading">Company Information</h2>
          <fieldset className="field">
            <label htmlFor="company">Company</label>
            <p className="input-description">What company caught your eye?</p>
            <input
              type="text"
              id="company"
              name="company"
              defaultValue={application.company.name}
            />
          </fieldset>

          <fieldset className="field">
            <label htmlFor="jobTitle">Job Title</label>
            <p className="input-description">What's the job you're after?</p>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              defaultValue={application.jobTitle ?? ""}
            />
          </fieldset>

          <fieldset className="field">
            <label htmlFor="jobDescription">
              Job Description / Requirements
            </label>
            <p className="input-description">What are they looking for?</p>
            <input
              type="text"
              id="jobDescription"
              name="jobDescription"
              defaultValue={application.jobDescription ?? ""}
            />
          </fieldset>

          <fieldset className="field">
            <div className="label">Salary Range</div>
            <p className="input-description">What does the pay look like?</p>
            <div className="flex gap-4">
              <div className="flex-1 label-inside">
                <label htmlFor="salaryMin">Min</label>
                <input
                  type="text"
                  id="salaryMin"
                  name="salaryMin"
                  defaultValue={application.salaryMin ?? ""}
                />
              </div>
              <div className="flex-1 label-inside">
                <label htmlFor="salaryMax">Max</label>
                <input
                  type="text"
                  id="salaryMax"
                  name="salaryMax"
                  defaultValue={application.salaryMax ?? ""}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="field">
            <label htmlFor="url">Application URL</label>
            <p className="input-description">Where can we apply?</p>
            <input
              type="text"
              id="url"
              name="url"
              defaultValue={application.postingUrl ?? ""}
            />
          </fieldset>
          <div className="field flex item-center gap-4">
            <Button type="submit">Update</Button>
            <Button variant="secondary" asChild>
              <a href={link("/applications/:id", { id: application.id })}>
                Cancel
              </a>
            </Button>
          </div>
        </section>

        <div>
          <div className="box">
            <label htmlFor="dateApplied">Application submission date</label>
            <DatePicker
              name="dateApplied"
              defaultValue={application.dateApplied?.toISOString() ?? ""}
            />
          </div>
          <div className="box">
            <label htmlFor="application-status">Application Status</label>
            <Select
              name="statusId"
              defaultValue={application.status.id.toString()}
            >
              <SelectTrigger id="application-status">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.id} value={status.id.toString()}>
                    {status.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="box">
            <h3 id="contacts-heading">Contacts</h3>
            <p className="input-description">
              Invite your team members to collaborate.
            </p>
            {application.company.contacts && (
              <ul className="mb-4" aria-labelledby="contacts-heading">
                {application.company.contacts.map((contact) => (
                  <li key={contact.id}>
                    <ContactCard contact={contact} isEditable />
                  </li>
                ))}
              </ul>
            )}
            <Sheet
              open={isContactSheetOpen}
              onOpenChange={setIsContactSheetOpen}
            >
              <SheetTrigger className="flex items-center gap-2 font-poppins text-sm font-bold bg-secondary py-3 px-6 rounded-md cursor-pointer">
                <Icon id="plus" size={16} />
                Add a Contact
              </SheetTrigger>
              <SheetContent className="pt-[100px] px-12">
                <SheetHeader>
                  <SheetTitle id="add-contact-title">Add Contact</SheetTitle>
                  <SheetDescription>
                    Add a Contact to this application.
                  </SheetDescription>
                  <ContactForm
                    closeSheet={() => setIsContactSheetOpen(false)}
                    companyId={application.company.id}
                  />
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </form>
  )
}
