import { ExtensionOptions } from './ExtensionOptions';
import { HandlerType } from '../handlers/HandlerType';
import * as $ from 'jquery';

function SaveOptions(e)
{
	const options = new ExtensionOptions({});
	options.HandlerType = $("#handlers").val() as number;

	console.debug(`Saving options: HandlerType ${HandlerType[options.HandlerType]}`);

	browser.storage.local.set(options.Storage);
}

function InitializeOptionsForm()
{
	console.debug("Initializing options form");

	const handlers = [HandlerType.Imgur, HandlerType.Pomf]
	const optionElement = $("#handlers");

	handlers.forEach(handler =>
	{
		optionElement.append($(`<option value="${handler}">${HandlerType[handler]}</option>`));
	});
}

$(document).ready(function ()
{
	InitializeOptionsForm();

	browser.storage.local.get(new ExtensionOptions({}).Storage).then(result =>
	{
		const currentOptions = new ExtensionOptions(result);

		$(`option[value=${currentOptions.HandlerType}]`).prop("selected", true);

		document.querySelector("form").addEventListener("submit", SaveOptions);
	});
});