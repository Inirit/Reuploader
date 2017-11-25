import { ExtensionOptions, IExtensionOptions } from './ExtensionOptions';
import { HandlerType } from '../handlers/HandlerType';
import * as $ from 'jquery';

async function HandleSaveOptions(e)
{
	e.preventDefault();

	const currentOptions = await ExtensionOptions.GetCurrentOptions();

	currentOptions.HandlerType = $("#handlers").val() as HandlerType;

	await ExtensionOptions.UpdateCurrentOptions(currentOptions);
}

async function InitializeHandlersOptions(currentOptions: IExtensionOptions)
{
	const handlersLabelElement = $("#handlers-label");
	const handlersSelectElement = $("#handlers");

	handlersLabelElement.prepend(browser.i18n.getMessage("optionsHandlersLabel"));

	ExtensionOptions.EnabledHandlers.forEach(handler =>
	{
		handlersSelectElement.append($(`<option class="options" value="${handler}">${HandlerType[handler]}</option>`));
	});

	$(`option[value=${currentOptions.HandlerType}]`).prop("selected", true);
}

function InitializeSaveButton()
{
	const saveElement = $("#save");
	saveElement.text(browser.i18n.getMessage("optionsSave"));
}

function UnhideOptionsForm()
{
	const formElement = $("form.options");
	formElement.submit(HandleSaveOptions);
	formElement.addClass("unhidden");
	formElement.removeClass("hidden");
}

async function InitializeOptionsForm()
{
	console.debug("Initializing options form...");

	const currentOptions = await ExtensionOptions.GetCurrentOptions();
	await InitializeHandlersOptions(currentOptions);
	InitializeSaveButton();
	UnhideOptionsForm();

	console.debug("Options form initialized!");
}

$(document).ready(() =>
{
	InitializeOptionsForm();
});