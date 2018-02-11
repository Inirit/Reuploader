import * as $ from "jquery";

import { HandlerType } from "../handlers/HandlerType";
import { ExtensionOptions, IExtensionOptions } from "./ExtensionOptions";

async function HandleSaveOptions(e)
{
	e.preventDefault();

	const currentOptions = await ExtensionOptions.GetCurrentOptions();

	currentOptions.HandlerType = $("#handlers").val() as HandlerType;

	await ExtensionOptions.UpdateCurrentOptions(currentOptions);
}

async function InitializeHandlersOptions(currentOptions: IExtensionOptions)
{
	const handlersLabelElement = $("#handlers-select-container");
	const handlersSelectElement = $("#handlers");

	handlersLabelElement.prepend(browser.i18n.getMessage("optionsHandlersLabel"));

	ExtensionOptions.EnabledHandlers.forEach(handler =>
	{
		handlersSelectElement.append($(`<option value="${handler}">${HandlerType[handler]}</option>`));
	});

	$(`option[value=${currentOptions.HandlerType}]`).prop("selected", true);
}

function InitializeSaveButton()
{
	const saveElement = $("#handlers-save");
	saveElement.text(browser.i18n.getMessage("optionsSave"));
	saveElement.click(HandleSaveOptions);
}

function UnhideOptionsForm()
{
	const bodyContainerElement = $("#body-container");
	bodyContainerElement.addClass("unhidden");
	bodyContainerElement.removeClass("hidden");
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
