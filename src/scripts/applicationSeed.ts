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
              },
            },
          },
        },
        status: {
          connect: { id: 1 },
        },
        user: { connect: { id: "e2ac4ee8-591e-4b92-a2e4-ea95c7da0f60" } },
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
