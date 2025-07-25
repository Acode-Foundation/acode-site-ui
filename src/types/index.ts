export type userRole = "user" | "admin";

export interface User {
    id: number,
    name: string,
    role: userRole,
    email: string,
    github: string,
    website: string,
    verified: number,
    threshold: number,
    created_at: string,
    updated_at: string
}