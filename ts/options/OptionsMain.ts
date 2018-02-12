import * as $ from "jquery";

import HandlerType from "../handlers/HandlerType";
import ImgurOptions from "./ImgurOptions";
import PrimaryOptions from "./PrimaryOptions";

async function HandleSaveOptions(e)
{
	e.preventDefault();

	const currentHandlerType = $("#handlers").val() as HandlerType;

	await PrimaryOptions.SetHandlerType(currentHandlerType);
}

async function InitializeHandlersOptions()
{
	const handlersLabelElement = $("#menu-handler-select-container");
	const handlersSelectElement = $("#handlers");

	handlersLabelElement.prepend(browser.i18n.getMessage("optionsMenuHandlerSelectionLabel"));

	PrimaryOptions.EnabledHandlers.forEach(handler =>
	{
		handlersSelectElement.append($(`<option value="${handler}">${HandlerType[handler]}</option>`));
	});

	const currentHandlerType = await PrimaryOptions.GetHandlerType();

	$(`option[value=${currentHandlerType}]`).prop("selected", true);

	handlersSelectElement.change(SetSecondaryMenu)
}

function SetSecondaryMenu()
{
	const handlerType = $("#handlers").val() as HandlerType;

	const noneOptions = $("#none-menu-container");
	const imgurOptions = $("#imgur-menu-container-container");

	const a = "";

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
	const response = await browser.identity.launchWebAuthFlow({
		url: `https://api.imgur.com/oauth2/authorize?response_type=token&client_id=4a4f81163ed1219&redirect_uri=${encodeURIComponent(redirectURL)}`,
		interactive: true
	});

	const decodedResponse = decodeURIComponent(response);

	console.debug(`Decoded response: ${decodedResponse}`);

	await ImgurOptions.SetAuthInfo(decodedResponse);

	await SetImgurMenuState();
}

async function HandleImgurUnauth(e)
{
	e.preventDefault();

	console.debug("Imgur unauth... ");

	await ImgurOptions.SetAuthInfo(undefined);
	await SetImgurMenuState();
}

async function SetImgurMenuState()
{
	let toHide = $("#imgur-authenticated-container");
	let toUnhide = $("#imgur-not-authenticated-container");

	if (await ImgurOptions.GetAccessToken())
	{
		const temp = toHide;
		toHide = toUnhide;
		toUnhide = temp;

		$("#imgur-account-info").text(`${await ImgurOptions.GetAccountName()} (${await ImgurOptions.GetAccountId()})`);
		$("#imgur-auth-info").text(`${await ImgurOptions.GetAccessToken()}`);
	}

	toHide.addClass("display-none");
	toUnhide.removeClass("display-none");
}

async function InitializeImgurMenu()
{
	// Imgur menu title
	const imgurMenuTitle = $("#imgur-menu-title");
	imgurMenuTitle.text(browser.i18n.getMessage("optionsImgurMenuTitle"));

	// Imgur auth button
	const imgurAuthButton = $("#imgur-auth-button");
	imgurAuthButton.text(browser.i18n.getMessage("optionsImgurMenuAuthButton"));
	imgurAuthButton.click(HandleImgurAuth);

	// Imgur unauth button
	const imgurUnauthButton = $("#imgur-unauth-button");
	imgurUnauthButton.text(browser.i18n.getMessage("optionsImgurMenuUnauthButton"));
	imgurUnauthButton.click(HandleImgurUnauth);

	await SetImgurMenuState();
}

async function InitializeOptions()
{
	console.debug("Initializing options...");

	await InitializeHandlersOptions();

	InitializeMainMenu();
	await InitializeImgurMenu();
	SetSecondaryMenu();

	UnhideBody();

	console.debug("Options initialized!");
}

$(document).ready(() =>
{
	InitializeOptions();
});
