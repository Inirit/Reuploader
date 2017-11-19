import { HandlerBase } from './HandlerBase';
import { HandlerType } from './HandlerType';

export class ImgurHandler extends HandlerBase
{
	get HandlerType(): HandlerType
	{
		return HandlerType.Imgur;
	}

	public UploadImage(image: Blob, callback: (uploadedUrl: string) => void): void
	{
		console.debug(`Uploading with handler type '${this.HandlerType}'`);

		const formData = new FormData();
		formData.append('files[]', image, "image.jpg");
	}
}