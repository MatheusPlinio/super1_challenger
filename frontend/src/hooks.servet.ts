import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('auth_token');

    if (token) {
        event.locals.user = { id: 1, name: 'Matheus', email: 'test@test.com' };
    } else {
        event.locals.user = null;
    }

    if (event.url.pathname.startsWith('/cart') && !event.locals.user) {
        throw redirect(303, '/auth/login');
    }

    return resolve(event);
};
