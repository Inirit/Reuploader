import { ExtensionOptions } from './options/ExtensionOptions';
import { ImgurHandler } from './handlers/ImgurHandler';
import { HandlerType } from './handlers/HandlerType';
import { IHandler } from './handlers/IHandler';
import { PomfHandler } from './handlers/PomfHandler';
import * as $ from 'jquery';

function OnCreated()
{
	if (browser.runtime.lastError)
	{
		console.error(`Error: ${browser.runtime.lastError}`);
	} else
	{
		console.debug("Item created successfully");
	}
}

function CopyToClipboard(data: string)
{
	console.debug(`Copying to clipboard: ${data}`);

	// Is this really the best way to do this? Surely there's a more direct way.
	const input = document.createElement('input');
	input.style.position = 'fixed';
	input.style.opacity = '0';
	input.value = data;

	document.body.appendChild(input);
	input.select();
	document.execCommand('Copy');
	document.body.removeChild(input);

	browser.notifications.create(
		"copy_complete", {
			"type": "basic",
			"title": "Reuploader",
			"message": `Copied ${data} to clipboard`
		}
	).then(id =>
	{
		setTimeout(() =>
		{
			console.debug(`Clearing notification with id ${id}`);

			browser.notifications.clear(id);
		}, 5000);
	});
}

function GetMenuId(handlerType: HandlerType): string
{
	return `menuItem_${HandlerType[handlerType]}`;
}

function Initialize()
{
	console.debug(`Initializing...`);

	browser.contextMenus.create(
		{
			id: "reuploadMenuItem",
			title: browser.i18n.getMessage("reuploadMenuItemLabel"),
			contexts: ["image"]
		}, OnCreated);

	browser.contextMenus.onClicked.addListener((info, tab) =>
	{
		if (info.menuItemId === "reuploadMenuItem")
		{
			browser.storage.local.get(new ExtensionOptions({}).Storage).then(result =>
			{
				const currentOptions = new ExtensionOptions(result);

				let handler: IHandler;

				console.debug(`Storage returned handler type ${HandlerType[currentOptions.HandlerType]}`);

				switch (+currentOptions.HandlerType)
				{
					case HandlerType.Imgur:
						handler = new ImgurHandler();
						break;
					case HandlerType.Pomf:
						handler = new PomfHandler();
						break;
					default:
						console.error(`Unable to select a handler class for handler type ${currentOptions.HandlerType}`);
						break;
				}

				if (handler)
				{
					console.debug(`Using handler type ${HandlerType[handler.HandlerType]}`);

					if (info.srcUrl)
					{
						console.debug(`Image selected, SrcUrl: ${info.srcUrl}, TabId: ${tab.id}`);

						handler.FetchImage(
							info.srcUrl,
							(image: Blob) => handler.UploadImage(image, CopyToClipboard));
					}
					else
					{
						console.error(`Image was selected, but src url could not be found!`);
					}
				}
			});
		}
	});

	console.debug(`Initialization complete.`);
}

Initialize();