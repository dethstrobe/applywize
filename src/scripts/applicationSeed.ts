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
                userId: "1f4144b2-7d80-41bd-a420-98d931e5b320",
              },
            },
          },
        },
        status: {
          connect: { id: 1 },
        },
        user: { connect: { id: "b96ba2e8-682b-4202-9128-a24eec84f000" } },
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
