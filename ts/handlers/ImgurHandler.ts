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
		const formData = new FormData();
		formData.append('image', image, "image.jpg");

		browser.notifications.create(
			"reupload_progress", {
				"type": "basic",
				"title": `Reploader`,
				"iconUrl": "./images/notification.png",
				"message": `Reploading to ${HandlerType[this.HandlerType]}...`
			}
		).then(notificationId =>
		{
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
									const percentage = (e.loaded / e.total) * 100;

									console.debug(`Progress: ${percentage}%`);
								}
							}, false);
						}

						return myXhr;
					}
				}).always(() =>
				{
					browser.notifications.clear(notificationId);
				})
				.done(result =>
				{
					console.debug("Image upload complete!");

					const link: string = result.data.link;

					callback(link);
				})
				.fail((jqXHR, textStatus, error) =>
				{
					browser.notifications.create(
						"reupload_failed", {
							"type": "basic",
							"title": `Reploader`,
							"iconUrl": "./images/notification.png",
							"message": `Failed to upload image. ${textStatus} ${error}`
						}
					).then(failId =>
					{
						setTimeout(() =>
						{
							console.debug(`Clearing notification with id ${failId}`);

							browser.notifications.clear(failId);
						}, 10000);
					})
				});
		});
	}
}