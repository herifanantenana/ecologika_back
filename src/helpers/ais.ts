import { Response } from "express";
import { NotFoundException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';
import { marked } from "marked";

export const fileToGenerativePart = (buffer: Buffer, mimeType: string) => {
	return {
		inlineData: {
			data: buffer.toString("base64"),
			mimeType,
		},
	};
}

export const sendContentHtml = (res: Response, content: string) => {
	if (!content)
		throw new NotFoundException("No content!", ErrorCode.UNPROCESSABLE_ENTITY);
	const contentHtml = marked(content);
	res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Converted Markdown</title>
        </head>
        <body>
            ${contentHtml}
        </body>
        </html>
    `);

}
