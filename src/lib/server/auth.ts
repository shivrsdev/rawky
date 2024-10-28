import type { User } from '@prisma/client';
import { prisma } from './database';
import type { Cookies } from '@sveltejs/kit';

export const validateToken = async (cookies: Cookies): Promise<User | null> => {
	const accessToken = cookies.get('accessToken');

	if (!accessToken) return null;

	if (accessToken === 'logged-out')
		// They are tryna trick our systems...
		return null;

	const user = await prisma.user.findUnique({
		where: {
			accessToken: accessToken
		}
	});

	return user;
};
