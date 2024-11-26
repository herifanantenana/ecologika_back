import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException, UnauthorizedException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';
import { verifyToken } from '../helpers/jwtToken';
import { JWT_SECRET_KEY } from '../secrets';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token)
		throw new UnauthorizedException("Unauthorized access!", ErrorCode.UNAUTHORIZED);
	const payload = verifyToken(token, JWT_SECRET_KEY) as { userId: number };
	let user: User;
	try {
		user = await prismaClient.user.findFirstOrThrow({ where: { id: payload.userId } })
	} catch (error) {
		throw new NotFoundException("User not found!", ErrorCode.USER_NOT_FOUND, error)
	}
	delete (user as any).password;
	req.user = user;
	next();
}
