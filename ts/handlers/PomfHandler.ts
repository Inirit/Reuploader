import { HandlerBase } from './HandlerBase';
import { HandlerType } from './HandlerType';

export class PomfHandler extends HandlerBase
{
	private readonly _uploadUrl: string = 'https://pomf.cat/upload.php';
	private readonly _uploadPrefix: string = 'https://a.pomf.cat/';

	get HandlerType(): HandlerType
	{
		return HandlerType.Pomf;
	}

	public UploadImage(image: Blob, callback: (uploadedUrl: string) => void): void
	{
		const formData = new FormData();
		formData.append('files[]', image, "image.jpg");

		$.ajax(
			{
				url: this._uploadUrl,
				method: 'POST',
				data: formData,
				cache: false,
				contentType: false,
				processData: false,
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
			.done(data =>
			{
				console.debug("Image upload complete!");

				const uploadedFile = data.files[0]
				const uploadedFileName = uploadedFile.url;

				callback(`${this._uploadPrefix}${uploadedFileName}`);
			})
			.fail((jqXHR, textStatus, error) =>
			{
				console.error(`Image upload failed! Status: ${textStatus}, Error: ${error}`);
			});
	}
}