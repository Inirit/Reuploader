import { HandlerBase } from './HandlerBase';
import { HandlerType } from './HandlerType';

export class ImgurHandler extends HandlerBase
{
	private readonly _uploadUrl: string = "https://api.imgur.com/3/image";
	private readonly _clientId: string = "4a4f81163ed1219";

	get HandlerType(): HandlerType
	{
		return HandlerType.Imgur;
	}

	public UploadImage(image: Blob, callback: (uploadedUrl: string) => void): void
	{
		console.debug(`Uploading with handler type '${HandlerType[this.HandlerType]}'`);

		const formData = new FormData();
		formData.append('image', image, "image.jpg");

		$.ajax(
			{
				url: this._uploadUrl,
				method: 'POST',
				data: formData,
				cache: false,
				contentType: false,
				processData: false,
				headers: {
					Authorization: `Client-ID ${this._clientId}`,
					Accept: 'application/json'
				},
				xhr: function ()
				{
					var myXhr = $.ajaxSettings.xhr();
					if (myXhr.upload)
					{
						myXhr.upload.addEventListener('progress', function (e)
						{
							if (e.lengthComputable)
							{
								console.debug(`Progress: ${e.loaded}, ${e.total}`);
							}
						}, false);
					}
					return myXhr;
				}
			})
			.done(result =>
			{
				console.debug("Image upload complete!");

				const link: string = result.data.link;

				callback(link);
			})
			.fail((jqXHR, textStatus, error) =>
			{
				console.error(`Image upload failed! Status: ${textStatus}, Error: ${error}`);
			});
	}
}