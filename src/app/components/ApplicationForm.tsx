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
import { createApplication } from "@/app/pages/applications/functions"

interface Props {
  statuses: ApplicationStatus[]
}

export const ApplicationForm = ({ statuses }: Props) => {
  const handleSubmit = async (formData: FormData) => {
    const result = await createApplication(formData)

    if (result.success) {
      window.location.href = "/applications"
    } else {
      console.error(result.error)
    }
  }

  return (
    <form action={handleSubmit} aria-labelledby="company-info-heading">
      <div className="grid grid-cols-2 gap-[200px] px-page-side mb-[75px]">
        <section>
          <h2 id="company-info-heading">Company Information</h2>
          <fieldset className="field">
            <label htmlFor="company">Company</label>
            <p className="input-description">What company caught your eye?</p>
            <input type="text" id="company" name="company" />
          </fieldset>

          <fieldset className="field">
            <label htmlFor="jobTitle">Job Title</label>
            <p className="input-description">What's the job you're after?</p>
            <input type="text" id="jobTitle" name="jobTitle" />
          </fieldset>

          <fieldset className="field">
            <label htmlFor="jobDescription">
              Job Description / Requirements
            </label>
            <p className="input-description">What are they looking for?</p>
            <input type="text" id="jobDescription" name="jobDescription" />
          </fieldset>

          <fieldset className="field">
            <div className="label">Salary Range</div>
            <p className="input-description">What does the pay look like?</p>
            <div className="flex gap-4">
              <div className="flex-1 label-inside">
                <label htmlFor="salaryMin">Min</label>
                <input type="text" id="salaryMin" name="salaryMin" />
              </div>
              <div className="flex-1 label-inside">
                <label htmlFor="salaryMax">Max</label>
                <input type="text" id="salaryMax" name="salaryMax" />
              </div>
            </div>
          </fieldset>

          <fieldset className="field">
            <label htmlFor="url">Application URL</label>
            <p className="input-description">Where can we apply?</p>
            <input type="text" id="url" name="url" />
          </fieldset>
          <div className="field">
            <Button type="submit">Create</Button>
          </div>
        </section>

        <div>
          <div className="box">
            <label htmlFor="dateApplied">Application submission date</label>
            <DatePicker name="dateApplied" />
          </div>
          <div className="box">
            <label htmlFor="application-status">Application Status</label>
            <Select name="status">
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
            <h3>Contacts</h3>
            <p className="input-description">
              Invite your team members to collaborate.
            </p>
            <div>Contact Card Placeholder</div>
          </div>
        </div>
      </div>
    </form>
  )
}
