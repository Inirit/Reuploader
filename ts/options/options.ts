import { ExtensionOptions } from './ExtensionOptions';
import { HandlerType } from '../handlers/HandlerType';
import * as $ from 'jquery';

async function SaveOptions(e)
{
	const currentOptions = await ExtensionOptions.GetCurrentOptions();

	currentOptions.HandlerType = $("#handlers").val() as number;

	await ExtensionOptions.UpdateCurrentOptions(currentOptions);
}

async function InitializeOptionsForm()
{
	console.debug("Initializing options form");

	const handlers = [HandlerType.Imgur, HandlerType.Pomf]
	const handlersSelectElement = $("#handlers");

	handlers.forEach(handler =>
	{
		handlersSelectElement.append($(`<option class="options" value="${handler}">${HandlerType[handler]}</option>`));
	});

	const currentOptions = await ExtensionOptions.GetCurrentOptions();

	$(`option[value=${currentOptions.HandlerType}]`).prop("selected", true);

	document.querySelector("form").addEventListener("submit", SaveOptions);
}

$(document).ready(() =>
{
	InitializeOptionsForm();
});