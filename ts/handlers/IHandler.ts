import { HandlerType } from './HandlerType';

export interface IHandler
{
	HandlerType: HandlerType;

	ReuploadImage(originalImageUrl: string): Promise<string>;
}