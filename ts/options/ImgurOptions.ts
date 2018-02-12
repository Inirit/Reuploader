import ExtensionOptionsBase from "./ExtensionOptionsBase";

class ImgurOptions extends ExtensionOptionsBase
{
	public static readonly ClientId: string = "4a4f81163ed1219";

	private static readonly _defaultOptions: browser.storage.StorageObject = {
		"AccessToken": undefined,
		"ExpiresIn": undefined,
		"TokenType": undefined,
		"RefreshToken": undefined,
		"AccountName": undefined,
		"AccountId": undefined
	};

	private static readonly _accessTokenName = "AccessToken";
	private static readonly _expiresInName = "ExpiresIn";
	private static readonly _tokenTypeName = "TokenType";
	private static readonly _refreshTokenName = "RefreshToken";
	private static readonly _accountNameName = "AccountName";
	private static readonly _accountIdName = "AccountId";

	public static async GetAccessToken(): Promise<string>
	{
		const value = await this.GetOption<string>(this._accessTokenName, this._defaultOptions);

		return value;
	}

	public static async GetExpiresIn(): Promise<string>
	{
		const value = await this.GetOption<string>(this._expiresInName, this._defaultOptions);

		return value;
	}

	public static async GetTokenType(): Promise<string>
	{
		const value = await this.GetOption<string>(this._tokenTypeName, this._defaultOptions);

		return value;
	}

	public static async GetRefreshToken(): Promise<string>
	{
		const value = await this.GetOption<string>(this._refreshTokenName, this._defaultOptions);

		return value;
	}

	public static async GetAccountName(): Promise<string>
	{
		const value = await this.GetOption<string>(this._accountNameName, this._defaultOptions);

		return value;
	}

	public static async GetAccountId(): Promise<string>
	{
		const value = await this.GetOption<string>(this._accountIdName, this._defaultOptions);

		return value;
	}

	public static async SetAuthInfo(authResponse: string)
	{
		const params = this.GetParamsFromResponseUrl(authResponse);

		await this.SetAccessToken(params["access_token"]);
		await this.SetExpiresIn(params["expires_in"]);
		await this.SetTokenType(params["token_type"]);
		await this.SetRefreshToken(params["refresh_token"]);
		await this.SetAccountName(params["account_username"]);
		await this.SetAccountId(params["account_id"]);
	}

	private static async SetAccessToken(value: string)
	{
		await this.SetOption(this._accessTokenName, value);
	}

	private static async SetExpiresIn(value: string)
	{
		await this.SetOption(this._expiresInName, value);
	}

	private static async SetTokenType(value: string)
	{
		await this.SetOption(this._tokenTypeName, value);
	}

	private static async SetRefreshToken(value: string)
	{
		await this.SetOption(this._refreshTokenName, value);
	}

	private static async SetAccountName(value: string)
	{
		await this.SetOption(this._accountNameName, value);
	}

	private static async SetAccountId(value: string)
	{
		await this.SetOption(this._accountIdName, value);
	}

	private static GetParamsFromResponseUrl(response: string): Array<string>
	{
		const values: Array<string> = [];

		if (!response)
		{
			return values;
		}

		const params = response.slice(response.indexOf('#') + 1).split('&');

		for (let i = 0; i < params.length; i++)
		{
			const param = params[i].split('=');
			values.push(param[0]);
			values[param[0]] = param[1];
		}
		return values;
	}
}

export default ImgurOptions;
