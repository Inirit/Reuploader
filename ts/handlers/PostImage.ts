import * as blobUtil from "blob-util";

import HandlerBase from "./HandlerBase";
import HandlerType from "./HandlerType";

/*
The functionality for this service is based on the network traffic from their Windows screen cap tool:
http://postimages.org/app.
*/

class PostImageData
{
	// Probably just an API key assigned to their screen cap tool
	public key: string = "8ca0b57a6bb9c4c33cd9e7ab8e6a7f05";

	// I don't know what this is
	public o: string = "2b819584285c102318568238c7d4a4c7";

	// I don't know what this is
	public m: string = "fb733cccce28e7db3ff9f17d7ccff3d1";

	// API usage can be denied based on version number, may need to update this in the future
	public version: string = "1.0.1";

	// Name of the image after being uploaded
	public name: string = "image";

	// This doesn't seem to matter (e.g. a png will be uploaded as a png), but the value is required.
	public type: string = "jpg";

	// The image data as a base64 string
	public image: string;

	constructor(imageBase64: string)
	{
		this.image = imageBase64;
	}
}

class PostImageHandler extends HandlerBase
{
	// Determined by observing network traffic from their screencap tool
	private readonly _uploadUrl: string = "http://api.postimage.org/1/upload";

	get HandlerType(): HandlerType
	{
		return HandlerType.PostImage;
	}

	public async HandleUpload(image: Blob): Promise<string>
	{
		const dataUrl = await blobUtil.blobToBase64String(image);
		const uploadData = new PostImageData(dataUrl);

		const ajaxSettings: JQuery.AjaxSettings<any> = {
			url: this._uploadUrl,
			method: "POST",
			data: uploadData,
			xhr: this.GetUploadXhr
		};

		let uploadedUrl: string;

		await $.ajax(ajaxSettings).then(
			(data) =>
			{
				const xml = $(data);
				const link = xml.find("hotlink");

				if (link && link.length > 0)
				{
					uploadedUrl = link.text();
				}
				else
				{
					console.error("Upload to PostImage faile but with a successful status code, potentially requires updating handling.");
					console.error(data);

					this.HandleGeneralError("Failed to upload image due to an unknown error.");
				}
			},
			(jqXHR, textStatus, error) =>
			{
				this.HandleUploadError(jqXHR, textStatus, error);
			});

		return uploadedUrl;
	}
}

export default PostImageHandler;
