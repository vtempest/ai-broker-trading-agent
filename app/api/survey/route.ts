
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, name } = body

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            )
        }

        // Check if user exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        })

        const surveyData = JSON.stringify(body)

        if (existingUser) {
            // Update existing user with survey response
            await db.update(users)
                .set({
                    surveyResponse: surveyData,
                    updatedAt: new Date(),
                    // Update name/phone/org if they were provided and missing? 
                    // For now, let's just update the survey response.
                })
                .where(eq(users.id, existingUser.id))

            return NextResponse.json({ success: true, id: existingUser.id, status: "updated" })
        } else {
            // Create new user
            const id = uuidv4()
            await db.insert(users).values({
                id,
                name: name || email.split("@")[0], // Fallback name
                email,
                surveyResponse: surveyData,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            return NextResponse.json({ success: true, id, status: "created" })
        }

    } catch (error) {
        console.error("Error submitting survey:", error)
        return NextResponse.json(
            { error: "Failed to submit survey" },
            { status: 500 }
        )
    }
}
