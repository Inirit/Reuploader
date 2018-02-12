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

	handlersSelectElement.change(SetSecondaryMenu)
}

function SetSecondaryMenu()
{
	const handlerType = $("#handlers").val() as HandlerType;

	const noneOptions = $("#none-menu-container");
	const imgurOptions = $("#imgur-menu-container-container");

	if (handlerType == HandlerType.Imgur)
	{
		imgurOptions.removeClass("display-none");
		noneOptions.addClass("display-none");
	}
	else
	{
		imgurOptions.addClass("display-none");
		noneOptions.removeClass("display-none");
	}
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

async function HandleImgurAuth(e)
{
	e.preventDefault();

	console.debug("Imgur auth... ");

	const redirectURL = browser.identity.getRedirectURL();

	console.debug(redirectURL);

	const token = await browser.identity.launchWebAuthFlow({
		url: `https://api.imgur.com/oauth2/authorize?response_type=token&client_id=4a4f81163ed1219&redirect_uri=${encodeURIComponent(redirectURL)}`,
		interactive: true
	});

	const currentOptions = await ExtensionOptions.GetCurrentOptions();
	currentOptions.ImgurAuthKey = token;

	await ExtensionOptions.UpdateCurrentOptions(currentOptions);

	const imgurNotAuthContainer = $("#imgur-not-authenticated-container");
	imgurNotAuthContainer.addClass("display-none");

	const imgurAuthContainer = $("#imgur-authenticated-container");
	imgurAuthContainer.text(currentOptions.ImgurAuthKey);
	imgurAuthContainer.removeClass("display-none");
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
	SetSecondaryMenu();

	UnhideBody();

	console.debug("Options initialized!");
}

$(document).ready(() =>
{
	InitializeOptions();
});
