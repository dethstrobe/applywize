import { EditApplicationForm } from "@/app/components/EditApplicationForm"
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
import type { RequestInfo } from "rwsdk/worker"

export const Edit = async ({ params }: RequestInfo) => {
  const application = await db.application.findUnique({
    where: { id: params.id },
    include: { status: true, company: { include: { contacts: true } } },
  })
  const statuses = await db.applicationStatus.findMany()
  if (!application) {
    return <p className="text-red-500">Error loading application</p>
  }
  return (
    <InteriorLayout>
      <div className="breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={link("/applications")}>
                Applications
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={link("/applications/:id", { id: application?.id ?? "" })}
              >
                {application?.jobTitle} {application?.company.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Application</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mx-page-side pb-6 mb-8 border-b-1 border-border">
        <h1 className="page-title">Edit {application?.jobTitle}</h1>
        <p className="page-description">
          Edit the details of this job application.
        </p>
      </div>
      <EditApplicationForm statuses={statuses} application={application} />
    </InteriorLayout>
  )
}
