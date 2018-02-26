import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";

import ExtensionOptionsBase from "./ExtensionOptionsBase";

class ImgurOptions extends ExtensionOptionsBase
{
	public static readonly ClientId: string = "4a4f81163ed1219";
	public static readonly ClientSecret: string = "20e4c6d9d9cbc2554f08bd2c8c450b271cda7bb8";

	private static readonly _defaultOptions: browser.storage.StorageObject = {
		AccessToken: undefined,
		ExpirationTime: undefined,
		TokenType: undefined,
		RefreshToken: undefined,
		AccountName: undefined,
		AccountId: undefined
	};

	private static readonly _accessTokenName = "AccessToken";
	private static readonly _expirationTime = "ExpirationTime";
	private static readonly _tokenTypeName = "TokenType";
	private static readonly _refreshTokenName = "RefreshToken";
	private static readonly _accountNameName = "AccountName";
	private static readonly _accountIdName = "AccountId";

	private static _authStateChange = new SimpleEventDispatcher<boolean>();

	public static get onAuthStateChange(): ISimpleEvent<boolean>
	{
		return this._authStateChange.asEvent();
	}

	public static async GetAccessToken(): Promise<string>
	{
		const value = await this.GetOption<string>(this._accessTokenName, this._defaultOptions);

		return value;
	}

	public static async GetExpirationTime(): Promise<number>
	{
		const value = await this.GetOption<number>(this._expirationTime, this._defaultOptions);

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

	public static async SetAuthInfo(authInfo: string[])
	{
		const currentAuthState = await this.IsAuthed();

		if (authInfo["error"])
		{
			this.ClearAuthInfo();

			console.debug(`SetAuthInfo failed with error: ${authInfo["error"]}`);
			throw new Error(`SetAuthInfo failed with error: ${authInfo["error"]}`);
		}

		await this.SetAccessToken(authInfo["access_token"]);
		await this.SetExpirationTime(authInfo["expires_in"]);
		await this.SetTokenType(authInfo["token_type"]);
		await this.SetRefreshToken(authInfo["refresh_token"]);
		await this.SetAccountName(authInfo["account_username"]);

		const newAuthState = await this.IsAuthed();

		if ((newAuthState && authInfo["account_id"]) || !newAuthState)
		{
			await this.SetAccountId(authInfo["account_id"]);
		}

		if (currentAuthState !== newAuthState)
		{
			this._authStateChange.dispatch(newAuthState);
		}
	}

	public static async ClearAuthInfo()
	{
		await this.SetAuthInfo(new Array<string>());
	}

	public static async IsAuthed(): Promise<boolean>
	{
		let isAuthed: boolean;

		if (await this.GetAccessToken())
		{
			isAuthed = true;
		}
		else
		{
			isAuthed = false;
		}

		return isAuthed;
	}

	private static async SetAccessToken(value: string)
	{
		await this.SetOption(this._accessTokenName, value);
	}

	private static async SetExpirationTime(value: string)
	{
		let expirationTime: number;

		if (value)
		{
			const expiresInMs = parseInt(value, 10) * 1000;
			const currentTime = Date.now();

			expirationTime = currentTime + expiresInMs;
		}

		await this.SetOption(this._expirationTime, expirationTime);
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
}

export default ImgurOptions;
