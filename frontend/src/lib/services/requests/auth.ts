import { PUBLIC_BACKEND_URL } from "$env/static/public";

export async function registerUser(name: string, email: string, password: string) {
    const res = await fetch(`${PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
        throw new Error('Failed to register');
    }

    return await res.json();
}

export async function loginUser(email: string, password: string) {
    const res = await fetch(`${PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    });

    if (!res.ok) {
        throw new Error('Failed to login');
    }

    return await res.json()
}