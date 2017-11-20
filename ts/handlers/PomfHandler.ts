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
					xhr: function ()
					{
						var myXhr = $.ajaxSettings.xhr();

						if (myXhr.upload)
						{
							myXhr.upload.addEventListener('progress', function (e)
							{
								if (e.lengthComputable)
								{
									const percentage = e.loaded / e.total;

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
				.done(data =>
				{
					console.debug("Image upload complete!");

					const uploadedFile = data.files[0];
					const uploadedFileName = uploadedFile.url;

					callback(`${this._uploadPrefix}${uploadedFileName}`);
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
				})
		});
	}
}