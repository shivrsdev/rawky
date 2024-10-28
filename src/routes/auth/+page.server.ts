import { prisma } from '$lib/server/database';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import * as argon2 from 'argon2';

const generateToken = async (username: string) => {
    return await argon2.hash(username+'.'+Math.random()+'.'+Math.random()+'.'+Math.random());
};

export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		if(!username || !email || !password)
			return fail(422, { missingFields: true });

		const user = await prisma.user.findUnique({
			where: {
				username: username,
				email: email
			}
		});

		if (!user) return fail(401, { incorrect: true });

		const authorized = argon2.verify(user.passwordHashed, password);

		if (!authorized) return fail(401, { incorrect: true });

        const newAccessToken = await generateToken(username);

        await prisma.user.update({
            where: user,
            data: {
                accessToken: newAccessToken
            }
        });

		cookies.set('accessToken', newAccessToken, { path: '/' });

		throw redirect(302, '/messages');
	},
	register: async ({ cookies, request }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		if(!username || !email || !password)
			return fail(422, { missingFields: true });

		const user = await prisma.user.findFirst({
			where: {
				OR: [{ username: username }, { email: email }]
			}
		});

		if (user) return fail(409, { userAlreadyExists: true });

        const newAccessToken = await generateToken(username);
		const color = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");

        await prisma.user.create({
            data: {
                username: username,
                email: email,
                passwordHashed: await argon2.hash(password),
                accessToken: newAccessToken,
				color: color
            }
        });

        cookies.set('accessToken', newAccessToken, { path: '/' });

		throw redirect(302, '/messages');
	}
};
