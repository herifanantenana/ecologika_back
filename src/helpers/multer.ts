import fs, { PathLike} from 'fs';
import { Request } from "express";
import path from "path";

enum ImageMimeType {
	JPG = "image/jpeg",
	PNG = "image/png",
	GIF = "image/gif",
	BMP = "image/bmp",
	SVG = "image/svg+xml",
	WEBP = "image/webp",
	ICO = "image/x-icon",
}

enum DocumentMimeType {
	PDF = "application/pdf",
	DOC = "application/msword",
	DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	XLS = "application/vnd.ms-excel",
	XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	PPT = "application/vnd.ms-powerpoint",
	PPTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	TXT = "text/plain",
	CSV = "text/csv",
	HTML = "text/html",
	JSON = "application/json",
	XML = "application/xml",
}

enum AudioMimeType {
	MP3 = "audio/mpeg",
	WAV = "audio/wav",
	OGG = "audio/ogg",
	AAC = "audio/aac",
	MIDI = "audio/midi",
	FLAC = "audio/flac",
}

enum VideoMimeType {
	MP4 = "video/mp4",
	WEBM = "video/webm",
	OGG = "video/ogg",
	AVI = "video/x-msvideo",
	MOV = "video/quicktime",
	MKV = "video/x-matroska",
}

enum ArchiveMimeType {
	ZIP = "application/zip",
	RAR = "application/vnd.rar",
	TAR = "application/x-tar",
	GZ = "application/gzip",
	BZ2 = "application/x-bzip2",
	SEVEN_ZIP = "application/x-7z-compressed",
}

enum ApplicationMimeType {
	EXE = "application/vnd.microsoft.portable-executable",
	MSI = "application/x-ms-installer",
	APK = "application/vnd.android.package-archive",
	DMG = "application/x-apple-diskimage",
}

enum FontMimeType {
	TTF = "font/ttf",
	OTF = "font/otf",
	WOFF = "font/woff",
	WOFF2 = "font/woff2",
}

enum OtherMimeType {
	EPUB = "application/epub+zip",
	ICS = "text/calendar",
	JS = "application/javascript",
	CSS = "text/css",
}

export const validMimeTypes = new Set<String>([
	...Object.values(ImageMimeType),
	...Object.values(ImageMimeType),
	...Object.values(DocumentMimeType),
	...Object.values(AudioMimeType),
	...Object.values(VideoMimeType),
	...Object.values(ArchiveMimeType),
	...Object.values(ApplicationMimeType),
	...Object.values(FontMimeType),
	...Object.values(OtherMimeType),
]);

export const getTypeCategoryFile = (mimeType: string, fieldName: string) => {
	return `${mimeType.split('/')[0].concat("s")}/${fieldName}`;
}

export const getPathDestination = (mimeType: string, fieldName: string) => {
	return path.resolve(__dirname, "../../uploads", getTypeCategoryFile(mimeType, fieldName));
}
export const getUrlFile = (req: Request, file: Express.Multer.File) => {
	return `${req.protocol}://${req.get("host")}/${getTypeCategoryFile(file.mimetype, file.fieldname)}/${file.filename.split(' ').join('_')}`;
}

export const secureFolder = async (path: PathLike) => {
	try {
		await fs.promises.access(path, fs.constants.F_OK);
	} catch (err) {
		return fs.promises.mkdir(path, { recursive: true });
	}
}
