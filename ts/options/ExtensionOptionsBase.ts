abstract class ExtensionOptionsBase
{
	protected static async GetOptions(defaultOptions: browser.storage.StorageObject): Promise<browser.storage.StorageObject>
	{
		const options = await browser.storage.local.get(defaultOptions);

		return options;
	}

	protected static async GetOption<T extends browser.storage.StorageValue>(name: string, defaultOptions: browser.storage.StorageObject)
	{
		const options = await this.GetOptions(defaultOptions);
		const value = options[name];

		console.debug(`Got '${name}' with value '${value}'`);

		return value as T;
	}

	protected static async SetOption(name: string, value: browser.storage.StorageValue)
	{
		console.debug(`Setting '${name}' to '${value}'`);

		if (value)
		{
			const options = await browser.storage.local.get(name);
			options[name] = value;

			await browser.storage.local.set(options);
		}
		else
		{
			await browser.storage.local.remove(name);
		}
	}
}

export default ExtensionOptionsBase;
