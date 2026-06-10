export type AuthCredentials = { email: string; password: string };
export type RegisterInput = AuthCredentials & { displayName?: string };
