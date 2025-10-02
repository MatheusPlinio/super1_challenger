import type { User } from "$lib/types/user";

export function isAuthenticated(authToken: string | null): boolean {
    return !!authToken;
}

export async function getUser(authToken: string | null): Promise<User | null> {
    if (!authToken) return null;

    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        if (!res.ok) return null;
        const user = await res.json() as User;
        return user;
    } catch (err) {
        console.error('[auth] failed to fetch user', err);
        return null;
    }
}
