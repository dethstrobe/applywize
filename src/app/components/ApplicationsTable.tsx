import { Icon } from "./Icon"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Badge, type badgeVariants } from "./ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Fragment, type FC } from "react"
import type { ApplicationWithRelations } from "../pages/applications/List"
import type { VariantProps } from "class-variance-authority"
import { link } from "../shared/links"

interface Props {
  applications: ApplicationWithRelations[]
}

export const ApplicationsTable: FC<Props> = ({ applications }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Status</TableHead>
        <TableHead>Date Applied</TableHead>
        <TableHead>Job Title</TableHead>
        <TableHead>Company</TableHead>
        <TableHead>Contact</TableHead>
        <TableHead>Salary Range</TableHead>
        <TableHead>View</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {applications.map((application) => (
        <TableRow key={application.id}>
          <TableCell>
            <Badge
              variant={
                application.status.status.toLocaleLowerCase() as VariantProps<
                  typeof badgeVariants
                >["variant"]
              }
            >
              {application.status.status}
            </Badge>
          </TableCell>
          <TableCell>
            {application.dateApplied?.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </TableCell>
          <TableCell>{application.jobTitle}</TableCell>
          <TableCell>{application.company.name}</TableCell>
          <TableCell className="flex items-center gap-2">
            {application.company.contacts.map((contact) => (
              <Fragment key={contact.id}>
                <Avatar>
                  <AvatarFallback>
                    {contact.firstName.charAt(0)}
                    {contact.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {contact.firstName} {contact.lastName}
              </Fragment>
            ))}
          </TableCell>
          <TableCell>
            {application.salaryMin}-{application.salaryMax}
          </TableCell>
          <TableCell>
            <a
              href={link("/applications/:id", { id: application.id })}
              aria-label={`View details for ${application.company.name} ${application.jobTitle}`}
            >
              <Icon id="view" />
            </a>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
