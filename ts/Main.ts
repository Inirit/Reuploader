import { ExtensionOptions } from './options/ExtensionOptions';
import { ImgurHandler } from './handlers/ImgurHandler';
import { HandlerType } from './handlers/HandlerType';
import { IHandler } from './handlers/IHandler';
import { PomfHandler } from './handlers/PomfHandler';
import * as $ from 'jquery';

function HandleOnCreated()
{
	if (browser.runtime.lastError)
	{
		console.error(`Error: ${browser.runtime.lastError}`);
	}
}

async function CopyToClipboard(data: string)
{
	// Is this really the best way to do this? Surely there's a more direct way.
	const input = document.createElement('input');
	input.style.position = 'fixed';
	input.style.opacity = '0';
	input.value = data;

	document.body.appendChild(input);
	input.select();
	document.execCommand('Copy');
	document.body.removeChild(input);

	const notificationId = await browser.notifications.create(
		`copy_complete_${Date.now()}`, {
			"type": "basic",
			"title": browser.i18n.getMessage("extensionName"),
			"iconUrl": "./images/up_arrow.png",
			"message": browser.i18n.getMessage("notificationMessageCopyToClipboard", data)
		}
	);

	setTimeout(() =>
	{
		browser.notifications.clear(notificationId);
	}, 5000);
}

async function HandleGeneralError(errorMessage: string)
{
	const notificationId = await browser.notifications.create(
		`reupload_failed_${Date.now()}`, {
			"type": "basic",
			"title": browser.i18n.getMessage("extensionName"),
			"iconUrl": "./images/up_arrow.png",
			"message": `${errorMessage}`
		}
	);

	setTimeout(() =>
	{
		browser.notifications.clear(notificationId);
	}, 10000);
}

async function HandleReuploadOnClick(info: browser.contextMenus.OnClickData, tab: browser.tabs.Tab)
{
	if (info.menuItemId === "reuploadMenuItem")
	{
		const currentOptions = await ExtensionOptions.GetCurrentOptions();

		let handler: IHandler;

		switch (+currentOptions.HandlerType)
		{
			case HandlerType.Imgur:
				handler = new ImgurHandler();
				break;
			case HandlerType.Pomf:
				handler = new PomfHandler();
				break;
			default:
				HandleGeneralError(browser.i18n.getMessage("errorHandlerTypeNotSupported", HandlerType[currentOptions.HandlerType]));
				break;
		}

		if (handler)
		{
			if (info.srcUrl)
			{
				handler.ReuploadImage(info.srcUrl).then(uploadedUrl =>
				{
					if (uploadedUrl)
					{
						CopyToClipboard(uploadedUrl);
					}
				}
				);
			}
			else
			{
				HandleGeneralError(browser.i18n.getMessage("errorImageSourceUrl"));
			}
		}
	}
}

async function Initialize()
{
	console.debug(`Initializing...`);

	browser.contextMenus.create(
		{
			id: "reuploadMenuItem",
			title: browser.i18n.getMessage("reuploadMenuItemLabel"),
			contexts: ["image"]
		}, (HandleOnCreated));

	browser.contextMenus.onClicked.addListener(HandleReuploadOnClick);

	console.debug(`Initialization complete.`);
}

Initialize();