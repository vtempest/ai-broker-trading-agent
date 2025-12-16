"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Users, UserPlus, Trash2 } from "lucide-react";
import { createTeam, getUserTeams, inviteMemberToTeam, removeMemberFromTeam } from "@/lib/actions/teams";

export function TeamsManager() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [creating, setCreating] = useState(false);

  // Invite state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await getUserTeams();
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;
    
    setCreating(true);
    try {
      const result = await createTeam(newTeamName, newTeamDesc);
      if (result.success) {
        toast.success("Team created successfully");
        setIsCreateOpen(false);
        setNewTeamName("");
        setNewTeamDesc("");
        fetchTeams();
      } else {
        toast.error(result.error || "Failed to create team");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setCreating(false);
    }
  };

  const handleInvite = async (teamId: string) => {
    if (!inviteEmail.trim()) return;
    
    setInviting(true);
    try {
      const result = await inviteMemberToTeam(teamId, inviteEmail);
      if (result.success) {
        toast.success("Member invited successfully");
        setInviteEmail("");
        setSelectedTeamId(null);
        fetchTeams();
      } else {
        toast.error(result.error || "Failed to invite member");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (teamId: string, userId: string) => {
      if(!confirm("Are you sure you want to remove this member?")) return;

      try {
          const result = await removeMemberFromTeam(teamId, userId);
          if (result.success) {
              toast.success("Member removed");
              fetchTeams();
          } else {
              toast.error(result.error || "Failed to remove member");
          }
      } catch (error) {
          toast.error("An error occurred");
      }
  };

  if (loading) {
    return <div>Loading teams...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Teams</h2>
          <p className="text-muted-foreground">Manage your teams and collaborate with others</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Create a team to share strategies and signals.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Alpha Squad"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description (Optional)</Label>
                <Input
                  id="desc"
                  placeholder="What is this team for?"
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTeam} disabled={creating}>
                {creating ? "Creating..." : "Create Team"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {teams.length === 0 ? (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mb-4 opacity-50" />
                    <p>You haven&apos;t joined any teams yet.</p>
                </CardContent>
            </Card>
        ) : (
            teams.map((team) => (
            <Card key={team.id}>
                <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{team.name}</CardTitle>
                        <CardDescription>{team.description}</CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {team.members?.length || 0} members
                    </div>
                </div>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Members</h4>
                    <div className="space-y-2">
                    {team.members?.map((member: any) => (
                        <div key={member.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                    {member.user.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{member.user.name}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                                </div>
                            </div>
                            {member.role !== "lead" && (
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(team.id, member.user.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                        </div>
                    ))}
                    </div>

                    <div className="pt-4 border-t">
                        <Label>Add Member</Label>
                        <div className="flex gap-2 mt-2">
                            <Input 
                                placeholder="user@example.com" 
                                value={selectedTeamId === team.id ? inviteEmail : ""}
                                onChange={(e) => {
                                    setSelectedTeamId(team.id);
                                    setInviteEmail(e.target.value);
                                }}
                            />
                            <Button 
                                variant="secondary" 
                                onClick={() => handleInvite(team.id)}
                                disabled={inviting || !inviteEmail || selectedTeamId !== team.id}
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Invite
                            </Button>
                        </div>
                    </div>
                </div>
                </CardContent>
            </Card>
            ))
        )}
      </div>
    </div>
  );
}
