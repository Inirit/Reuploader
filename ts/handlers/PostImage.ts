import { HandlerBase } from './HandlerBase';
import { HandlerType } from './HandlerType';
import * as blobUtil from 'blob-util'

export class PostImageHandler extends HandlerBase
{
	private readonly _uploadUrl: string = 'http://api.postimage.org/1/upload';

	get HandlerType(): HandlerType
	{
		return HandlerType.PostImage;
	}

	public async HandleUpload(image: Blob): Promise<string>
	{
		const dataUrl = await blobUtil.blobToBase64String(image);

		const uploadData =
			{
				key: "8ca0b57a6bb9c4c33cd9e7ab8e6a7f05",
				o: "2b819584285c102318568238c7d4a4c7",
				m: "fb733cccce28e7db3ff9f17d7ccff3d1",
				version: "1.0.1",
				name: "image",
				type: "jpg",
				image: dataUrl
			}

		let uploadedUrl: string;

		await $.ajax(
			{
				url: this._uploadUrl,
				method: 'POST',
				data: uploadData,
				xhr: this.GetUploadXhr
			}).then(data =>
			{
				const xml = $(data);
				const link = xml.find("hotlink");

				if (link && link.length > 0)
				{
					uploadedUrl = link.text();
				}
				else
				{
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