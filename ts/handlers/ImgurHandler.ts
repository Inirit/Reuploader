import ImgurOptions from "../options/ImgurOptions";
import HandlerBase from "./HandlerBase";
import HandlerType from "./HandlerType";

class ImgurHandler extends HandlerBase
{
	private readonly _baseUrl: string = "https://api.imgur.com";

	get HandlerType(): HandlerType
	{
		return HandlerType.Imgur;
	}

	public async HandleUpload(image: Blob): Promise<string>
	{
		if (await this.NeedsRefresh())
		{
			try
			{
				await this.RefreshImgurAuth();
			}
			catch (e)
			{
				this.HandleGeneralError(`Failed to upload image, authentication expired but refresh failed. ${e.message}`);

				await ImgurOptions.ClearAuthInfo();

				return null;
			}
		}

		const authorizationHeader = await this.GetAuthorizationHeader();

		const formData = new FormData();
		formData.append("image", image, "image.jpg");

		const ajaxSettings: JQuery.AjaxSettings<any> = {
			url: `${this._baseUrl}/3/image`,
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
		};

		let uploadedUrl: string;

		await $.ajax(ajaxSettings).then(
			(result) =>
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

	private async RefreshImgurAuth()
	{
		console.debug("Imgur auth refresh... ");

		const redirectURL = browser.identity.getRedirectURL();
		const clientId = await ImgurOptions.ClientId;
		const refreshToken = await ImgurOptions.GetRefreshToken();

		const body = {
			grant_type: "refresh_token",
			client_id: ImgurOptions.ClientId,
			client_secret: ImgurOptions.ClientSecret,
			refresh_token: refreshToken
		};

		const ajaxSettings: JQuery.AjaxSettings<any> = {
			url: `${this._baseUrl}/oauth2/token`,
			method: "POST",
			data: JSON.stringify(body),
			cache: false,
			contentType: "application/json",
			processData: false,
			headers: {
				Accept: "application/json"
			}
		};

		let authInfo: string[];

		await $.ajax(ajaxSettings).then(
			(result) =>
			{
				if (result)
				{
					authInfo = result;
				}
			},
			(jqXHR, textStatus, error) =>
			{
				console.debug(`${textStatus} - ${error}`);
			});

		if (!authInfo)
		{
			throw new Error("Failed to refresh auth, response was empty.");
		}

		await ImgurOptions.SetAuthInfo(authInfo);
	}

	private async NeedsRefresh(): Promise<boolean>
	{
		const currentTime = Date.now();
		const expirationTime = await ImgurOptions.GetExpirationTime();
		const needsRefresh = expirationTime && expirationTime <= currentTime;

		return needsRefresh;
	}
}

export default ImgurHandler;
