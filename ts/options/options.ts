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
	const optionElement = $("#handlers");

	handlers.forEach(handler =>
	{
		optionElement.append($(`<option value="${handler}">${HandlerType[handler]}</option>`));
	});

	const currentOptions = await ExtensionOptions.GetCurrentOptions();

	$(`option[value=${currentOptions.HandlerType}]`).prop("selected", true); 0

	document.querySelector("form").addEventListener("submit", SaveOptions);
}

$(document).ready(() =>
{
	InitializeOptionsForm();
});