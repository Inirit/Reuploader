import { ExtensionOptions } from './options/ExtensionOptions';
import { ImgurHandler } from './handlers/ImgurHandler';
import { HandlerType } from './handlers/HandlerType';
import { IHandler } from './handlers/IHandler';
import { PomfHandler } from './handlers/PomfHandler';
import { PostImageHandler } from './handlers/PostImage';
import * as $ from 'jquery';

function HandleOnCreated()
{
	if (browser.runtime.lastError)
	{
		console.error(`Error: ${browser.runtime.lastError}`);
	}
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
			case HandlerType.PostImage:
				handler = new PostImageHandler();
				break;
			default:
				HandleGeneralError(browser.i18n.getMessage("errorHandlerTypeNotSupported", HandlerType[currentOptions.HandlerType]));
				break;
		}

		if (handler)
		{
			if (info.srcUrl)
			{
				const uploadedUrl = await handler.ReuploadImage(info.srcUrl);

				if (uploadedUrl)
				{
					await browser.tabs.sendMessage(tab.id, { "url": uploadedUrl });

					const notificationId = await browser.notifications.create(
						`copy_complete_${Date.now()}`, {
							"type": "basic",
							"title": browser.i18n.getMessage("extensionName"),
							"iconUrl": "./images/up_arrow.png",
							"message": browser.i18n.getMessage("notificationMessageCopyToClipboard", uploadedUrl)
						}
					);

					setTimeout(() =>
					{
						browser.notifications.clear(notificationId);
					}, 5000);
				}
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