import { IHandler } from './IHandler';
import { HandlerType } from './HandlerType';

export abstract class HandlerBase implements IHandler
{
	abstract HandlerType: HandlerType;
	abstract UploadImage(image: Blob, callback: (uploadedUrl: string) => void): void;

	FetchImage(url: string, callback: (image: Blob) => void): void
	{
		$.ajax(
			{
				url: url,
				type: "GET",
				xhr: function ()
				{
					var myXhr = $.ajaxSettings.xhr();
					myXhr.responseType = "blob";
					return myXhr;
				}
			})
			.done((data: Blob) =>
			{
				console.debug(`Image download complete. Size: ${data.size}, Type: ${data.type}`);

				callback(data);
			})
			.fail((jqXHR, textStatus, error) =>
			{
				console.error(`Image download failed! Status: ${textStatus}, Error: ${error}`);
			});
	}
}