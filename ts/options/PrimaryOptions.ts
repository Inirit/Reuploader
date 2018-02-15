import HandlerType from "../handlers/HandlerType";
import ExtensionOptionsBase from "./ExtensionOptionsBase";

class PrimaryOptions extends ExtensionOptionsBase
{
	public static EnabledHandlers: HandlerType[] = [
		HandlerType.Imgur,
		HandlerType.Pomf,
		HandlerType.PostImage
	];

	private static readonly _handlerTypeName = "HandlerType";

	private static readonly _defaultOptions: browser.storage.StorageObject = {
		HandlerType: `${HandlerType.Imgur}`
	};

	public static async GetHandlerType(): Promise<HandlerType>
	{
		const handler = await this.GetOption<HandlerType>(this._handlerTypeName, this._defaultOptions);

		return handler;
	}

	public static async SetHandlerType(value: HandlerType)
	{
		await this.SetOption(this._handlerTypeName, value);
	}
}

export default PrimaryOptions;
