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
	const handlersLabelElement = $("#menu-handler-select-container");
	const handlersSelectElement = $("#handlers");

	handlersLabelElement.prepend(browser.i18n.getMessage("optionsMenuHandlerSelectionLabel"));

	ExtensionOptions.EnabledHandlers.forEach(handler =>
	{
		handlersSelectElement.append($(`<option value="${handler}">${HandlerType[handler]}</option>`));
	});

	$(`option[value=${currentOptions.HandlerType}]`).prop("selected", true);
}

function InitializeSaveButton()
{

}

function UnhideBody()
{
	const bodyContainerElement = $("#body-container");
	bodyContainerElement.addClass("unhidden");
	bodyContainerElement.removeClass("hidden");
}

function InitializeMainMenu()
{
	// Menu title
	const menuTitle = $("#menu-title");
	menuTitle.text(browser.i18n.getMessage("optionsMenuTitle"));

	// Save button
	const saveButton = $("#menu-save-button");
	saveButton.text(browser.i18n.getMessage("optionsSaveButton"));
	saveButton.click(HandleSaveOptions);
}

function HandleImgurAuth(e)
{
	e.preventDefault();

	console.debug("Imgur auth... ");
}

function InitializeImgurMenu()
{
	// Imgur menu title
	const imgurMenuTitle = $("#imgur-menu-title");
	imgurMenuTitle.text(browser.i18n.getMessage("optionsImgurMenuTitle"));

	// Imgur auth button
	const imgurAuthButton = $("#imgur-auth-button");
	imgurAuthButton.text(browser.i18n.getMessage("optionsImgurMenuAuthButton"));
	imgurAuthButton.click(HandleImgurAuth);
}

async function InitializeOptions()
{
	console.debug("Initializing options...");

	const currentOptions = await ExtensionOptions.GetCurrentOptions();
	await InitializeHandlersOptions(currentOptions);

	InitializeMainMenu();
	InitializeImgurMenu();

	UnhideBody();

	console.debug("Options initialized!");
}

$(document).ready(() =>
{
	InitializeOptions();
});
