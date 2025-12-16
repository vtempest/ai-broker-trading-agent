export declare function createTeam(name: string, description?: string): Promise<{
    success: boolean;
    error: string;
    teamId?: undefined;
} | {
    success: boolean;
    teamId: `${string}-${string}-${string}-${string}-${string}`;
    error?: undefined;
}>;
export declare function getUserTeams(): Promise<never[]>;
export declare function inviteMemberToTeam(teamId: string, email: string): Promise<{
    success: boolean;
    error: string;
} | {
    success: boolean;
    error?: undefined;
}>;
export declare function removeMemberFromTeam(teamId: string, userId: string): Promise<{
    success: boolean;
    error?: undefined;
} | {
    success: boolean;
    error: string;
}>;
