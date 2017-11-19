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
			id: GetMenuId(HandlerType.Pomf),
			title: browser.i18n.getMessage("pomfMenuItemLabel"),
			contexts: ["image"]
		}, OnCreated);

	browser.contextMenus.create(
		{
			id: GetMenuId(HandlerType.Imgur),
			title: browser.i18n.getMessage("imgurMenuItemLabel"),
			contexts: ["image"]
		}, OnCreated);

	browser.contextMenus.onClicked.addListener((info, tab) =>
	{
		let handler: IHandler;

		switch (info.menuItemId)
		{
			case GetMenuId(HandlerType.Pomf):
				handler = new PomfHandler();
				break;
			case GetMenuId(HandlerType.Imgur):
				console.error(`Handler type '${HandlerType[HandlerType.Imgur]}' is not yet supported`);
				//handler = new ImgurHandler();
				break;
		}

		if (handler)
		{
			if (!info.srcUrl)
			{
				console.error(`Image was selected, but src url could not be found!`);
			}
			else
			{
				console.debug(`Image selected, SrcUrl: ${info.srcUrl}, TabId: ${tab.id}`);

				handler.FetchImage(
					info.srcUrl,
					(image: Blob) => handler.UploadImage(image, CopyToClipboard));
			}
		}
	});

	console.debug(`Initialization complete.`);
}

Initialize();