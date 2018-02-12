import ImgurOptions from "../options/ImgurOptions";
import HandlerBase from "./HandlerBase";
import HandlerType from "./HandlerType";

class ImgurHandler extends HandlerBase
{
	private readonly _uploadUrl: string = "https://api.imgur.com/3/image";

	get HandlerType(): HandlerType
	{
		return HandlerType.Imgur;
	}

	public async HandleUpload(image: Blob): Promise<string>
	{
		const clientId = await ImgurOptions.ClientId;
		const formData = new FormData();
		formData.append("image", image, "image.jpg");

		let uploadedUrl: string;

		await $.ajax(
			{
				url: this._uploadUrl,
				method: "POST",
				data: formData,
				cache: false,
				contentType: false,
				processData: false,
				headers: {
					Authorization: `Client-ID ${clientId}`,
					Accept: "application/json"
				},
				xhr: this.GetUploadXhr
			}).then(result =>
			{
				if (result && result.data && result.data.link)
				{
					uploadedUrl = result.data.link;
				}
				else
				{
					this.HandleGeneralError("Failed to upload image, unexpected response format from service.");
				}
			},
			(jqXHR, textStatus, error) =>
			{
				this.HandleUploadError(jqXHR, textStatus, error);
			});

		return uploadedUrl;
	}
}

export default ImgurHandler;
