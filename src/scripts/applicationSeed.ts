import { db, setupDb } from "@/db"
import { defineScript } from "rwsdk/worker"

export default defineScript(async ({ env }) => {
  setupDb(env)

  const createApplication = async () => {
    await db.application.create({
      data: {
        company: {
          create: {
            name: "RedwoodSDK",
            contacts: {
              create: {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                role: "Hiring Manager",
                userId: "7d4bd4da-3c6d-4936-b29c-68482393ce89",
              },
            },
          },
        },
        status: {
          connect: { id: 1 },
        },
        user: { connect: { id: "7d4bd4da-3c6d-4936-b29c-68482393ce89" } },
        salaryMin: "100000",
        salaryMax: "120000",
        jobTitle: "Software Engineer",
        jobDescription: "Software Engineer",
        postingUrl: "https://redwoodjs.com",
        dateApplied: new Date(),
      },
    })
  }

  await createApplication()

  console.log("🌱 Finished seeding")
})
