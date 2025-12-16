"use server";

import { db } from "@/lib/db";
import { organizations, teams, teamMembers, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

// For demo purposes, we might default to a single organization if auth isn't fully set up for multi-tenancy
// In a real app, we'd get the current user's org context
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function createTeam(name: string, description?: string) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session) {
        return { success: false, error: "Unauthorized" };
    }
    
    const userId = session.user.id;

    // 1. Get or create a default organization for the user if none exists
    let userOrg = await db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, userId),
      with: {
        organization: true
      }
    });

    let orgId = userOrg?.organizationId;

    if (!orgId) {
       // Create a default org for the user
       const newOrgId = randomUUID();
       // Fetch user name to name the org
       const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
       
       await db.insert(organizations).values({
         id: newOrgId,
         name: `${user?.name || "User"}'s Organization`,
         ownerId: userId,
         createdAt: new Date(),
         updatedAt: new Date(),
       });

       // Add user to org
       await db.insert(organizationMembers).values({
           id: randomUUID(),
           organizationId: newOrgId,
           userId: userId,
           role: "owner",
           joinedAt: new Date(),
       });
       
       orgId = newOrgId;
    }

    // 2. Create the team
    const teamId = randomUUID();
    await db.insert(teams).values({
      id: teamId,
      organizationId: orgId,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 3. Add creator as team lead
    await db.insert(teamMembers).values({
      id: randomUUID(),
      teamId,
      userId,
      role: "lead",
      joinedAt: new Date(),
    });

    revalidatePath("/dashboard/settings");
    return { success: true, teamId };
  } catch (error) {
    console.error("Failed to create team:", error);
    return { success: false, error: "Failed to create team" };
  }
}

export async function getUserTeams() {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session) {
        return [];
    }
    
    const userId = session.user.id;

    // Get all teams the user is a member of
    const memberships = await db.query.teamMembers.findMany({
      where: eq(teamMembers.userId, userId),
      with: {
        team: {
            with: {
                members: {
                    with: {
                        user: true
                    }
                }
            }
        },
      },
    });

    return memberships.map((m) => m.team);
  } catch (error) {
     console.error("Failed to get user teams:", error);
     return [];
  }
}

export async function inviteMemberToTeam(teamId: string, email: string) {
    try {
        // 1. Check if user exists
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) {
            return { success: false, error: "User not found. They must sign up first." };
        }

        // 2. Check if already a member
        const existingMember = await db.query.teamMembers.findFirst({
            where: and(
                eq(teamMembers.teamId, teamId),
                eq(teamMembers.userId, user.id)
            )
        });

        if (existingMember) {
            return { success: false, error: "User is already a member of this team." };
        }

        // 3. Add to team
        await db.insert(teamMembers).values({
            id: randomUUID(),
            teamId,
            userId: user.id,
            role: "member",
            joinedAt: new Date(),
        });

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to invite member:", error);
        return { success: false, error: "Failed to invite member" };
    }
}

export async function removeMemberFromTeam(teamId: string, userId: string) {
    try {
        await db.delete(teamMembers).where(
            and(
                eq(teamMembers.teamId, teamId),
                eq(teamMembers.userId, userId)
            )
        );
        
        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to remove member:", error);
        return { success: false, error: "Failed to remove member" };
    }
}

// Needed to check for organizationMembers table import above, realized I missed importing it in the top block
import { organizationMembers } from "@/lib/db/schema";
