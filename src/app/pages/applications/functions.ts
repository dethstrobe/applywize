"use server"

import { Contact } from "@generated/prisma/client"
import { requestInfo } from "rwsdk/worker"
import { db } from "@/db"

export const createApplication = async (formData: FormData) => {
  try {
    const { ctx } = requestInfo

    if (!ctx.user) throw new Error("User not found")

    const contacts = JSON.parse(formData.get("contacts") as string) as Contact[]

    await db.application.create({
      data: {
        user: {
          connect: {
            id: ctx.user.id,
          },
        },
        status: {
          connect: {
            id: Number.parseInt(formData.get("status") as string, 10),
          },
        },
        company: {
          create: {
            name: formData.get("company") as string,
            contacts: {
              connect: contacts,
            },
          },
        },
        salaryMin: formData.get("salaryMin") as string,
        salaryMax: formData.get("salaryMax") as string,
        jobTitle: formData.get("jobTitle") as string,
        jobDescription: formData.get("jobDescription") as string,
        postingUrl: formData.get("url") as string,
        dateApplied: formData.get("dateApplied") as string,
      },
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

export const createContact = async (formData: FormData) => {
  try {
    const { ctx } = requestInfo

    const companyId = formData.get("companyId") as string

    await db.contact.create({
      data: {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        role: formData.get("role") as string,
        user: {
          connect: {
            id: ctx.user?.id ?? "",
          },
        },
        ...(companyId
          ? {
              company: {
                connect: {
                  id: companyId,
                },
              },
            }
          : {}),
      },
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

export const deleteContact = async (id: string) => {
  try {
    await db.contact.delete({
      where: {
        id,
      },
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

export const deleteApplication = async (id: string) => {
  try {
    await db.application.delete({
      where: {
        id,
      },
    })

    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: error as Error }
  }
}

export const updateApplication = async (formData: FormData) => {
  try {
    await db.application.update({
      where: {
        id: formData.get("id") as string,
      },
      data: {
        salaryMin: formData.get("salaryMin") as string,
        salaryMax: formData.get("salaryMax") as string,
        jobTitle: formData.get("jobTitle") as string,
        jobDescription: formData.get("jobDescription") as string,
        postingUrl: formData.get("url") as string,
        dateApplied: formData.get("dateApplied") as string,
        company: {
          update: {
            name: formData.get("company") as string,
          },
        },
        status: {
          connect: {
            id: Number.parseInt(formData.get("statusId") as string, 10),
          },
        },
      },
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}
