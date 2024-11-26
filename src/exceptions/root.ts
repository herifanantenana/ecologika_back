export enum ErrorCode {
	USER_NOT_FOUND = 1001,
	USER_ALREADY_EXIST = 1002,
	INCORRECT_PASSWORD = 1003,
	INVALID_FILE_UPLOAD = 4004,
	FILE_NOT_FOUND = 4005,
	UNAUTHORIZED = 3001,
	INVALID_TOKEN = 5001,
	TOKEN_EXPIRED = 5002,
	UNPROCESSABLE_ENTITY = 9000,
	INTERNAL_EXCEPTION = 9001
}

export class HttpException extends Error {
	public message: string;
	public errorCode: ErrorCode;
	public statusHttp: number;
	public errors: any

	public constructor(message: string, errorCode: ErrorCode, statusHttp: number, errors?: any) {
		super(message);
		this.message = message;
		this.errorCode = errorCode;
		this.statusHttp = statusHttp;
		this.errors = errors;
	}
}
