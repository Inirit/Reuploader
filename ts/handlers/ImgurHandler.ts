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
		const authorizationHeader = await this.GetAuthorizationHeader();

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
					Authorization: authorizationHeader,
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

	private async GetAuthorizationHeader(): Promise<string>
	{
		let authorizationHeader: string;
		const accessToken = await ImgurOptions.GetAccessToken();

		if (accessToken)
		{
			authorizationHeader = `Bearer ${accessToken}`;

			console.debug(`Using access token for Imgur upload`);
		}
		else
		{
			const clientId = await ImgurOptions.ClientId;
			authorizationHeader = `Client-ID ${clientId}`;

			console.debug(`Using client id for Imgur upload`);
		}

		return authorizationHeader;
	}
}

export default ImgurHandler;
