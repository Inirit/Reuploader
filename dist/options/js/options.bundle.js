(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
	typeof define === 'function' && define.amd ? define(['jquery'], factory) :
	(factory(global.$));
}(this, (function ($) { 'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

var HandlerType;
(function (HandlerType) {
    HandlerType[HandlerType["Pomf"] = 0] = "Pomf";
    HandlerType[HandlerType["Imgur"] = 1] = "Imgur";
    HandlerType[HandlerType["PostImage"] = 2] = "PostImage";
})(HandlerType || (HandlerType = {}));
var HandlerType$1 = HandlerType;

class ExtensionOptionsBase {
    static async GetOptions(defaultOptions) {
        const options = await browser.storage.local.get(defaultOptions);
        return options;
    }
    static async GetOption(name, defaultOptions) {
        const options = await this.GetOptions(defaultOptions);
        const value = options[name];
        console.debug(`Got '${name}' with value '${value}'`);
        return value;
    }
    static async SetOption(name, value) {
        console.debug(`Setting '${name}' to '${value}'`);
        if (value) {
            const options = await browser.storage.local.get(name);
            options[name] = value;
            await browser.storage.local.set(options);
        }
        else {
            await browser.storage.local.remove(name);
        }
    }
}

class UrlParams {
}
class ImgurOptions extends ExtensionOptionsBase {
    static async GetAccessToken() {
        const value = await this.GetOption(this._accessTokenName, this._defaultOptions);
        return value;
    }
    static async GetExpiresIn() {
        const value = await this.GetOption(this._expiresInName, this._defaultOptions);
        return value;
    }
    static async GetTokenType() {
        const value = await this.GetOption(this._tokenTypeName, this._defaultOptions);
        return value;
    }
    static async GetRefreshToken() {
        const value = await this.GetOption(this._refreshTokenName, this._defaultOptions);
        return value;
    }
    static async GetAccountName() {
        const value = await this.GetOption(this._accountNameName, this._defaultOptions);
        return value;
    }
    static async GetAccountId() {
        const value = await this.GetOption(this._accountIdName, this._defaultOptions);
        return value;
    }
    static async SetAuthInfo(authResponse) {
        const params = this.GetParamsFromResponseUrl(authResponse);
        await this.SetAccessToken(params["access_token"]);
        await this.SetExpiresIn(params["expires_in"]);
        await this.SetTokenType(params["token_type"]);
        await this.SetRefreshToken(params["refresh_token"]);
        await this.SetAccountName(params["account_username"]);
        await this.SetAccountId(params["account_id"]);
    }
    static async SetAccessToken(value) {
        await this.SetOption(this._accessTokenName, value);
    }
    static async SetExpiresIn(value) {
        await this.SetOption(this._expiresInName, value);
    }
    static async SetTokenType(value) {
        await this.SetOption(this._tokenTypeName, value);
    }
    static async SetRefreshToken(value) {
        await this.SetOption(this._refreshTokenName, value);
    }
    static async SetAccountName(value) {
        await this.SetOption(this._accountNameName, value);
    }
    static async SetAccountId(value) {
        await this.SetOption(this._accountIdName, value);
    }
    static GetParamsFromResponseUrl(response) {
        const values = new UrlParams();
        if (!response) {
            return values;
        }
        const params = response.slice(response.indexOf("#") + 1).split("&");
        for (const param of params) {
            const paramPair = param.split("=");
            values[paramPair[0]] = paramPair[1];
        }
        return values;
    }
}
ImgurOptions.ClientId = "4a4f81163ed1219";
ImgurOptions._defaultOptions = {
    AccessToken: undefined,
    ExpiresIn: undefined,
    TokenType: undefined,
    RefreshToken: undefined,
    AccountName: undefined,
    AccountId: undefined
};
ImgurOptions._accessTokenName = "AccessToken";
ImgurOptions._expiresInName = "ExpiresIn";
ImgurOptions._tokenTypeName = "TokenType";
ImgurOptions._refreshTokenName = "RefreshToken";
ImgurOptions._accountNameName = "AccountName";
ImgurOptions._accountIdName = "AccountId";

class PrimaryOptions extends ExtensionOptionsBase {
    static async GetHandlerType() {
        const handler = await this.GetOption(this._handlerTypeName, this._defaultOptions);
        return handler;
    }
    static async SetHandlerType(value) {
        await this.SetOption(this._handlerTypeName, value);
    }
}
PrimaryOptions.EnabledHandlers = [
    HandlerType$1.Imgur,
    HandlerType$1.Pomf,
    HandlerType$1.PostImage
];
PrimaryOptions._handlerTypeName = "HandlerType";
PrimaryOptions._defaultOptions = {
    HandlerType: `${HandlerType$1.Imgur}`
};

async function HandleSaveOptions(e) {
    e.preventDefault();
    const currentHandlerType = $("#handlers").val();
    await PrimaryOptions.SetHandlerType(currentHandlerType);
}
async function InitializeHandlersOptions() {
    const handlersLabelElement = $("#menu-handler-select-container");
    const handlersSelectElement = $("#handlers");
    handlersLabelElement.prepend(browser.i18n.getMessage("optionsMenuHandlerSelectionLabel"));
    PrimaryOptions.EnabledHandlers.forEach((handler) => {
        handlersSelectElement.append($(`<option value="${handler}">${HandlerType$1[handler]}</option>`));
    });
    const currentHandlerType = await PrimaryOptions.GetHandlerType();
    $(`option[value=${currentHandlerType}]`).prop("selected", true);
    handlersSelectElement.change(SetSecondaryMenu);
}
function SetSecondaryMenu() {
    const handlerType = $("#handlers").val();
    const noneOptions = $("#none-menu-container");
    const imgurOptions = $("#imgur-menu-container-container");
    if (handlerType == HandlerType$1.Imgur) {
        imgurOptions.removeClass("display-none");
        noneOptions.addClass("display-none");
    }
    else {
        imgurOptions.addClass("display-none");
        noneOptions.removeClass("display-none");
    }
}
function UnhideBody() {
    const bodyContainerElement = $("#body-container");
    bodyContainerElement.addClass("unhidden");
    bodyContainerElement.removeClass("hidden");
}
function InitializeMainMenu() {
    const menuTitle = $("#menu-title");
    menuTitle.text(browser.i18n.getMessage("optionsMenuTitle"));
    const saveButton = $("#menu-save-button");
    saveButton.text(browser.i18n.getMessage("optionsSaveButton"));
    saveButton.click(HandleSaveOptions);
}
async function HandleImgurAuth(e) {
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
async function HandleImgurUnauth(e) {
    e.preventDefault();
    console.debug("Imgur unauth... ");
    await ImgurOptions.SetAuthInfo(undefined);
    await SetImgurMenuState();
}
async function SetImgurMenuState() {
    let toHide = $("#imgur-authenticated-container");
    let toUnhide = $("#imgur-not-authenticated-container");
    if (await ImgurOptions.GetAccessToken()) {
        const temp = toHide;
        toHide = toUnhide;
        toUnhide = temp;
        $("#imgur-account-info").text(`${await ImgurOptions.GetAccountName()} (${await ImgurOptions.GetAccountId()})`);
        $("#imgur-auth-info").text(`${await ImgurOptions.GetAccessToken()}`);
    }
    toHide.addClass("display-none");
    toUnhide.removeClass("display-none");
}
async function InitializeImgurMenu() {
    const imgurMenuTitle = $("#imgur-menu-title");
    imgurMenuTitle.text(browser.i18n.getMessage("optionsImgurMenuTitle"));
    const imgurAuthButton = $("#imgur-auth-button");
    imgurAuthButton.text(browser.i18n.getMessage("optionsImgurMenuAuthButton"));
    imgurAuthButton.click(HandleImgurAuth);
    const imgurUnauthButton = $("#imgur-unauth-button");
    imgurUnauthButton.text(browser.i18n.getMessage("optionsImgurMenuUnauthButton"));
    imgurUnauthButton.click(HandleImgurUnauth);
    await SetImgurMenuState();
}
async function InitializeOptions() {
    console.debug("Initializing options...");
    await InitializeHandlersOptions();
    InitializeMainMenu();
    await InitializeImgurMenu();
    SetSecondaryMenu();
    UnhideBody();
    console.debug("Options initialized!");
}
$(document).ready(async () => {
    await InitializeOptions();
});

})));
//# sourceMappingURL=options.bundle.js.map
