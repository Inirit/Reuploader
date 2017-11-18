import { HandlerType } from './HandlerType';

export interface IHandler
{
	HandlerType: HandlerType;

	UploadImage(image: Blob, callback: (uploadedUrl: string) => void): void;

	FetchImage(url: string, callback: (image: Blob) => void): void;
}