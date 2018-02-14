(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('blob-util')) :
	typeof define === 'function' && define.amd ? define(['blob-util'], factory) :
	(factory(global.blobUtil));
}(this, (function (blobUtil) { 'use strict';

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
        const values = [];
        if (!response) {
            return values;
        }
        const params = response.slice(response.indexOf('#') + 1).split('&');
        for (let i = 0; i < params.length; i++) {
            const param = params[i].split('=');
            values.push(param[0]);
            values[param[0]] = param[1];
        }
        return values;
    }
}
ImgurOptions.ClientId = "4a4f81163ed1219";
ImgurOptions._defaultOptions = {
    "AccessToken": undefined,
    "ExpiresIn": undefined,
    "TokenType": undefined,
    "RefreshToken": undefined,
    "AccountName": undefined,
    "AccountId": undefined
};
ImgurOptions._accessTokenName = "AccessToken";
ImgurOptions._expiresInName = "ExpiresIn";
ImgurOptions._tokenTypeName = "TokenType";
ImgurOptions._refreshTokenName = "RefreshToken";
ImgurOptions._accountNameName = "AccountName";
ImgurOptions._accountIdName = "AccountId";

class HandlerBase {
    async ReuploadImage(originalImageUrl) {
        const image = await this.FetchImage(originalImageUrl);
        const uploadedUrl = await this.UploadImage(image);
        return uploadedUrl;
    }
    async UploadImage(image) {
        const notificationId = await browser.notifications.create(`reupload_progress_${Date.now()}`, {
            type: "basic",
            title: browser.i18n.getMessage("extensionName"),
            iconUrl: "./images/up_arrow.png",
            message: browser.i18n.getMessage("notificationMessageReuploadProgress", HandlerType$1[this.HandlerType])
        });
        setTimeout(() => {
            browser.notifications.clear(notificationId);
        }, 5000);
        const uploadedUrl = await this.HandleUpload(image);
        await browser.notifications.clear(notificationId);
        return uploadedUrl;
    }
    async FetchImage(imageUrl) {
        let blob;
        await $.ajax({
            url: imageUrl,
            method: "GET",
            xhr: this.GetFetchXhr
        }).then((data) => {
            console.debug(`Image fetch complete. Size: ${data.size}, Type: ${data.type}`);
            blob = data;
        }, (jqXHR, textStatus, error) => {
            this.HandleFetchError(jqXHR, textStatus, error);
        });
        return blob;
    }
    GetUploadXhr() {
        const xhr = $.ajaxSettings.xhr();
        if (xhr.upload) {
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    const percentage = e.loaded / e.total * 100;
                    console.debug(`Progress: ${percentage}%`);
                }
            }, false);
        }
        return xhr;
    }
    GetFetchXhr() {
        const xhr = $.ajaxSettings.xhr();
        xhr.responseType = "blob";
        return xhr;
    }
    async HandleGeneralError(errorMessage) {
        const notificationId = await browser.notifications.create(`reupload_failed_${Date.now()}`, {
            type: "basic",
            title: browser.i18n.getMessage("extensionName"),
            iconUrl: "./images/up_arrow.png",
            message: `${errorMessage}`
        });
        setTimeout(() => {
            browser.notifications.clear(notificationId);
        }, 10000);
    }
    async HandleUploadError(jqXHR, textStatus, error) {
        await this.HandleGeneralError(browser.i18n.getMessage("errorImageFailedToUpload", [textStatus, error]));
    }
    async HandleFetchError(jqXHR, textStatus, error) {
        await this.HandleGeneralError(browser.i18n.getMessage("errorImageFailedToDownload", [textStatus, error]));
    }
}

class ImgurHandler extends HandlerBase {
    constructor() {
        super(...arguments);
        this._uploadUrl = "https://api.imgur.com/3/image";
    }
    get HandlerType() {
        return HandlerType$1.Imgur;
    }
    async HandleUpload(image) {
        const authorizationHeader = await this.GetAuthorizationHeader();
        const formData = new FormData();
        formData.append("image", image, "image.jpg");
        let uploadedUrl;
        await $.ajax({
            url: this._uploadUrl,
            method: "POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            headers: {
                Authorization: authorizationHeader,
                Accept: "application/json"
            },
            xhr: this.GetUploadXhr
        }).then(result => {
            if (result && result.data && result.data.link) {
                uploadedUrl = result.data.link;
            }
            else {
                this.HandleGeneralError("Failed to upload image, unexpected response format from service.");
            }
        }, (jqXHR, textStatus, error) => {
            this.HandleUploadError(jqXHR, textStatus, error);
        });
        return uploadedUrl;
    }
    async GetAuthorizationHeader() {
        let authorizationHeader;
        const accessToken = await ImgurOptions.GetAccessToken();
        if (accessToken) {
            authorizationHeader = `Bearer ${accessToken}`;
            console.debug(`Using access token for Imgur upload`);
        }
        else {
            const clientId = await ImgurOptions.ClientId;
            authorizationHeader = `Client-ID ${clientId}`;
            console.debug(`Using client id for Imgur upload`);
        }
        return authorizationHeader;
    }
}

class PomfHandler extends HandlerBase {
    constructor() {
        super(...arguments);
        this._uploadUrl = "https://pomf.cat/upload.php";
        this._uploadPrefix = "https://a.pomf.cat/";
    }
    get HandlerType() {
        return HandlerType$1.Pomf;
    }
    async HandleUpload(image) {
        const formData = new FormData();
        formData.append("files[]", image, "image.jpg");
        let uploadedUrl;
        await $.ajax({
            url: this._uploadUrl,
            method: "POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            xhr: this.GetUploadXhr
        }).then((data) => {
            if (data && data.files) {
                const uploadedFile = data.files[0];
                const uploadedFileName = uploadedFile.url;
                uploadedUrl = `${this._uploadPrefix}${uploadedFileName}`;
            }
            else {
                this.HandleGeneralError("Failed to upload image, unexpected response format from service.");
            }
        }, (jqXHR, textStatus, error) => {
            this.HandleUploadError(jqXHR, textStatus, error);
        });
        return uploadedUrl;
    }
}

class PostImageData {
    constructor(imageBase64) {
        this.key = "8ca0b57a6bb9c4c33cd9e7ab8e6a7f05";
        this.o = "2b819584285c102318568238c7d4a4c7";
        this.m = "fb733cccce28e7db3ff9f17d7ccff3d1";
        this.version = "1.0.1";
        this.name = "image";
        this.type = "jpg";
        this.image = imageBase64;
    }
}
class PostImageHandler extends HandlerBase {
    constructor() {
        super(...arguments);
        this._uploadUrl = "http://api.postimage.org/1/upload";
    }
    get HandlerType() {
        return HandlerType$1.PostImage;
    }
    async HandleUpload(image) {
        const dataUrl = await blobUtil.blobToBase64String(image);
        const uploadData = new PostImageData(dataUrl);
        let uploadedUrl;
        await $.ajax({
            url: this._uploadUrl,
            method: "POST",
            data: uploadData,
            xhr: this.GetUploadXhr
        }).then((data) => {
            const xml = $(data);
            const link = xml.find("hotlink");
            if (link && link.length > 0) {
                uploadedUrl = link.text();
            }
            else {
                console.error("Upload to PostImage faile but with a successful status code, potentially requires updating handling.");
                console.error(data);
                this.HandleGeneralError("Failed to upload image due to an unknown error.");
            }
        }, (jqXHR, textStatus, error) => {
            this.HandleUploadError(jqXHR, textStatus, error);
        });
        return uploadedUrl;
    }
}

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
    "HandlerType": `${HandlerType$1.Imgur}`
};

function HandleOnCreated() {
    if (browser.runtime.lastError) {
        console.error(`Error: ${browser.runtime.lastError}`);
    }
}
async function HandleGeneralError(errorMessage) {
    const notificationId = await browser.notifications.create(`reupload_failed_${Date.now()}`, {
        type: "basic",
        title: browser.i18n.getMessage("extensionName"),
        iconUrl: "./images/up_arrow.png",
        message: `${errorMessage}`
    });
    setTimeout(() => {
        browser.notifications.clear(notificationId);
    }, 10000);
}
async function HandleReuploadOnClick(info, tab) {
    if (info.menuItemId === "reuploadMenuItem") {
        const currentHandler = await PrimaryOptions.GetHandlerType();
        let handler;
        switch (+currentHandler) {
            case HandlerType$1.Imgur:
                handler = new ImgurHandler();
                break;
            case HandlerType$1.Pomf:
                handler = new PomfHandler();
                break;
            case HandlerType$1.PostImage:
                handler = new PostImageHandler();
                break;
            default:
                HandleGeneralError(browser.i18n.getMessage("errorHandlerTypeNotSupported", HandlerType$1[currentHandler]));
                break;
        }
        if (handler) {
            if (info.srcUrl) {
                const uploadedUrl = await handler.ReuploadImage(info.srcUrl);
                if (uploadedUrl) {
                    await browser.tabs.sendMessage(tab.id, { url: uploadedUrl });
                    const notificationId = await browser.notifications.create(`copy_complete_${Date.now()}`, {
                        type: "basic",
                        title: browser.i18n.getMessage("extensionName"),
                        iconUrl: "./images/up_arrow.png",
                        message: browser.i18n.getMessage("notificationMessageCopyToClipboard", uploadedUrl)
                    });
                    setTimeout(() => {
                        browser.notifications.clear(notificationId);
                    }, 5000);
                }
            }
            else {
                HandleGeneralError(browser.i18n.getMessage("errorImageSourceUrl"));
            }
        }
    }
}
async function Initialize() {
    console.debug(`Initializing...`);
    browser.contextMenus.create({
        id: "reuploadMenuItem",
        title: browser.i18n.getMessage("reuploadMenuItemLabel"),
        contexts: ["image"]
    }, (HandleOnCreated));
    browser.contextMenus.onClicked.addListener(HandleReuploadOnClick);
    console.debug(`Initialization complete.`);
}
Initialize();

})));
//# sourceMappingURL=background.bundle.js.map
