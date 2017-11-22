import { IHandler } from './IHandler';
import { HandlerType } from './HandlerType';

export abstract class HandlerBase implements IHandler
{
	abstract HandlerType: HandlerType;

	abstract HandleUpload(image: Blob): Promise<string>;

	public async ReuploadImage(originalImageUrl: string): Promise<string>
	{
		const image: Blob = await this.FetchImage(originalImageUrl);
		const uploadedUrl = await this.UploadImage(image);

		return uploadedUrl;
	}

	protected async UploadImage(image: Blob): Promise<string>
	{
		const notificationId = await browser.notifications.create(
			`reupload_progress_${Date.now()}`, {
				"type": "basic",
				"title": browser.i18n.getMessage("extensionName"),
				"iconUrl": "./images/up_arrow.png",
				"message": browser.i18n.getMessage("notificationMessageReuploadProgress", HandlerType[this.HandlerType])
			}
		)

		setTimeout(() =>
		{
			browser.notifications.clear(notificationId);
		}, 5000);

		const uploadedUrl = await this.HandleUpload(image);

		await browser.notifications.clear(notificationId);

		return uploadedUrl;
	}

	protected async FetchImage(url: string): Promise<Blob>
	{
		let blob: Blob;

		await $.ajax(
			{
				url: url,
				method: "GET",
				xhr: this.GetFetchXhr
			}).then((data: Blob) =>
			{
				console.debug(`Image fetch complete. Size: ${data.size}, Type: ${data.type}`);

				blob = data;
			},
			(jqXHR, textStatus, error) =>
			{
				this.HandleFetchError(jqXHR, textStatus, error);
			});

		return blob;
	}

	protected GetUploadXhr(): XMLHttpRequest
	{
		const xhr = $.ajaxSettings.xhr();

		if (xhr.upload)
		{
			xhr.upload.addEventListener('progress', function (e)
			{
				if (e.lengthComputable)
				{
					const percentage = e.loaded / e.total * 100;

					console.debug(`Progress: ${percentage}%`);
				}
			}, false);
		}

		return xhr;
	}

	protected GetFetchXhr(): XMLHttpRequest
	{
		const xhr = $.ajaxSettings.xhr();

		xhr.responseType = "blob";

		return xhr;
	}

	protected async HandleGeneralError(errorMessage: string)
	{
		const notificationId = await browser.notifications.create(
			`reupload_failed_${Date.now()}`, {
				"type": "basic",
				"title": browser.i18n.getMessage("extensionName"),
				"iconUrl": "./images/up_arrow.png",
				"message": `${errorMessage}`
			}
		);

		setTimeout(() =>
		{
			browser.notifications.clear(notificationId);
		}, 10000);
	}

	protected async HandleUploadError(jqXHR: JQuery.jqXHR, textStatus: JQuery.Ajax.ErrorTextStatus, error: string)
	{
		await this.HandleGeneralError(browser.i18n.getMessage("errorImageFailedToUpload", [textStatus, error]));
	}

	protected async HandleFetchError(jqXHR: JQuery.jqXHR, textStatus: JQuery.Ajax.ErrorTextStatus, error: string)
	{
		await this.HandleGeneralError(browser.i18n.getMessage("errorImageFailedToDownload", [textStatus, error]));
	}
}