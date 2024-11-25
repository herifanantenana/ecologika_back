import * as jwt from "jsonwebtoken";
import { UnauthorizedException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';

export const verifyToken = (token: string, secret: string) => {
	try {
		return jwt.verify(token, secret);
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError)
			throw new UnauthorizedException("Invalid token!", ErrorCode.INVALID_TOKEN, error);
		if (error instanceof jwt.JsonWebTokenError)
			throw new UnauthorizedException("Token expired!", ErrorCode.TOKEN_EXPIRED, error);
		console.log(error);

		throw error;
	}
}
