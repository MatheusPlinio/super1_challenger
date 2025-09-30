import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('auth_token');

    if (token) {
        try {
            const res = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                const user = await res.json();
                event.locals.user = user;
            } else {
                event.locals.user = null;
                event.cookies.delete('auth_token', { path: '/' });
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    if (event.url.pathname.startsWith('/cart') && !event.locals.user) {
        throw redirect(303, '/auth/login');
    }

    return resolve(event);
};