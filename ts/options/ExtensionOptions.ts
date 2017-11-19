import { HandlerType } from '../handlers/HandlerType';

export class ExtensionOptions
{
	private readonly _defaultHandlerType: HandlerType = HandlerType.Imgur;

	private readonly _storage: browser.storage.StorageObject;

	constructor(storage: browser.storage.StorageObject)
	{
		this._storage = storage;

		if (!this.HandlerType)
		{
			this.HandlerType = this._defaultHandlerType;
		}
	}

	get HandlerType(): HandlerType
	{
		return this._storage["HandlerType"] as HandlerType;
	}

	set HandlerType(value: HandlerType)
	{
		this._storage["HandlerType"] = value;
	}

	get Storage(): browser.storage.StorageObject
	{
		return this._storage;
	}
}