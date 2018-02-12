import HandlerType from "./HandlerType";

interface IHandler
{
	HandlerType: HandlerType;

	ReuploadImage(originalImageUrl: string): Promise<string>;
}

export default IHandler;
