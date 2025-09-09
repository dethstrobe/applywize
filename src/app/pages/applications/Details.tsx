import type { RequestInfo } from "rwsdk/worker"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb"
import { InteriorLayout } from "@/app/layouts/InteriorLayout"
import { link } from "@/app/shared/links"
import { db } from "@/db"
import { Badge, type badgeVariants } from "@/app/components/ui/badge"
import type { VariantProps } from "class-variance-authority"
import { Button } from "@/app/components/ui/button"
import { Icon } from "@/app/components/Icon"
import { ContactCard } from "@/app/components/ContactCard"
import { DeleteApplicationButton } from "@/app/components/DeleteApplicationButton"

export const Details = async ({ params }: RequestInfo) => {
  const application = await db.application.findUnique({
    where: { id: params.id },
    include: { status: true, company: { include: { contacts: true } } },
  })

  return (
    <InteriorLayout>
      <div className="breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={link("/applications")}>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {application?.jobTitle} {application?.company.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="px-page-side">
        <header className="flex justify-between border-b-1 border-border pb-6 mb-12">
          <div>
            <div className="flex items-center gap-5 mb-1">
              <h1 className="page-title">{application?.jobTitle}</h1>
              <Badge
                variant={
                  application?.status?.status.toLowerCase() as VariantProps<
                    typeof badgeVariants
                  >["variant"]
                }
                aria-label={`Application status: ${application?.status?.status}`}
              >
                {application?.status?.status}
              </Badge>
            </div>
            <p>
              <span className="text-zinc-500">at</span>{" "}
              {application?.company.name}
            </p>
          </div>
          <div>
            <Button asChild>
              <a
                href={application?.postingUrl ?? ""}
                target="_blank"
                rel="noreferrer"
                className=" flex items-center gap-2"
              >
                View Application <Icon id="external-link" size={16} />
              </a>
            </Button>
          </div>
        </header>
        <div className="two-column-grid">
          <div>
            <section className="mb-12" aria-label="Job Description">
              <p>{application?.jobDescription}</p>
            </section>
            <div className="flex items-center gap-5">
              <Button variant="secondary" asChild>
                <a
                  href={link("/applications/:id/edit", {
                    id: application?.id ?? "",
                  })}
                >
                  <Icon id="edit" size={16} /> Edit
                </a>
              </Button>
              <DeleteApplicationButton applicationId={application?.id ?? ""} />
            </div>
          </div>
          <aside>
            <section className="box" aria-labelledby="compensation-heading">
              <h3 className="mb-4" id="compensation-heading">
                Compensation
              </h3>
              <div className="flex items-center gap-6">
                <Icon id="salary" size={32} />
                <div className="text-small">
                  <p className="text-zinc-500">Salary</p>
                  <p className="font-bold">
                    {application?.salaryMin} - {application?.salaryMax}
                  </p>
                </div>
              </div>
            </section>
            <section className="box" aria-labelledby="contacts-heading">
              <h3 id="contacts-heading">Contacts</h3>
              <p className="input-description">
                Invite your team members to collaborate.
              </p>
              {application?.company.contacts && (
                <ul className="mb-4" aria-labelledby="contacts-heading">
                  {application.company.contacts.map((contact) => (
                    <li key={contact.id}>
                      <ContactCard contact={contact} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>
        </div>
      </div>
    </InteriorLayout>
  )
}
