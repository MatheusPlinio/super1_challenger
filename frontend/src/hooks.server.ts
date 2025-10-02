import { JWT_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('auth_token');

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: number; in: string; email: string };
            event.locals.authToken = token;
        } catch (err) {
            event.locals.user = null;
            event.cookies.delete('auth_token', { path: '/' });
        }
    } else {
        event.locals.user = null;
    }

    if (event.url.pathname.startsWith('/cart') && !event.locals.user) {
        throw redirect(303, '/auth/login');
    }

    return resolve(event);
};
