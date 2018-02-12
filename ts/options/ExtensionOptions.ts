import { HandlerType } from "../handlers/HandlerType";

export interface IExtensionOptions
{
	HandlerType: HandlerType;

	ImgurAuthKey: string;

	RawStorage: browser.storage.StorageObject;
}

export class ExtensionOptions implements IExtensionOptions
{
	private static readonly _defaultOptions: browser.storage.StorageObject = {
		"HandlerType": `${HandlerType.Imgur}`
	};

	public static EnabledHandlers: HandlerType[] = [
		HandlerType.Imgur,
		HandlerType.Pomf,
		HandlerType.PostImage
	];

	private readonly _currentOptions: browser.storage.StorageObject;

	constructor(options: browser.storage.StorageObject)
	{
		this._currentOptions = options;
	}

	public static async GetCurrentOptions(): Promise<IExtensionOptions>
	{
		const options = await browser.storage.local.get(this._defaultOptions);

		return new ExtensionOptions(options);
	}

	public static async UpdateCurrentOptions(options: IExtensionOptions)
	{
		await browser.storage.local.set(options.RawStorage);
	}

	get HandlerType(): HandlerType
	{
		const value = this._currentOptions["HandlerType"];

		if (value)
		{
			return value as HandlerType;
		}
		else
		{
			return null;
		}
	}

	set HandlerType(value: HandlerType)
	{
		this._currentOptions["HandlerType"] = `${value}`;
	}

	get ImgurAuthKey(): string
	{
		const value = this._currentOptions["ImgurAuthKey"];

		if (value)
		{
			return value as string;
		}
		else
		{
			return null;
		}
	}

	set ImgurAuthKey(value: string)
	{
		this._currentOptions["ImgurAuthKey"] = `${value}`;
	}

	get RawStorage(): browser.storage.StorageObject
	{
		return this._currentOptions;
	}
}
