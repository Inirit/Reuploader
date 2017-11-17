System.register(["jquery"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function OnCreated() {
        if (browser.runtime.lastError) {
            console.error(`Error: ${browser.runtime.lastError}`);
        }
        else {
            console.debug("Item created successfully");
        }
    }
    function DoSomethingWithNewUrl(uploadedUrl) {
        console.debug(`UploadedUrl: ${uploadedUrl}`);
        const input = document.createElement('input');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        input.value = uploadedUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('Copy');
        document.body.removeChild(input);
    }
    function Initialize() {
        console.debug(`Initializing...`);
        browser.contextMenus.create({
            id: "reuploadImageMenuItem",
            title: browser.i18n.getMessage("reuploadImageMenuItemLabel"),
            contexts: ["image"]
        }, OnCreated);
        browser.contextMenus.onClicked.addListener((info, tab) => {
            switch (info.menuItemId) {
                case "reuploadImageMenuItem":
                    if (!info.srcUrl) {
                        console.error(`Image was selected, but src url could not be found!`);
                    }
                    else {
                        console.debug(`Image selected.SrcUrl: ${info.srcUrl}, TabId: ${tab.id}`);
                        let handler = new PomfHandler();
                        handler.FetchImage(info.srcUrl, (image) => handler.UploadImage(image, DoSomethingWithNewUrl));
                    }
                    break;
            }
        });
        console.debug(`Initialization complete.`);
    }
    var jquery_1, HandlerType, HandlerBase, PomfHandler;
    return {
        setters: [
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            }
        ],
        execute: function () {
            (function (HandlerType) {
                HandlerType[HandlerType["Pomf"] = 0] = "Pomf";
                HandlerType[HandlerType["Imgur"] = 1] = "Imgur";
            })(HandlerType || (HandlerType = {}));
            HandlerBase = class HandlerBase {
                FetchImage(url, callback) {
                    jquery_1.default.ajax({
                        url: url,
                        type: "GET",
                        xhr: function () {
                            var myXhr = jquery_1.default.ajaxSettings.xhr();
                            myXhr.responseType = "blob";
                            return myXhr;
                        }
                    })
                        .done((data) => {
                        console.debug(`Image download complete. Size: ${data.size}, Type: ${data.type}`);
                        callback(data);
                    })
                        .fail((jqXHR, textStatus, error) => {
                        console.error(`Image download failed! Status: ${textStatus}, Error: ${error}`);
                    });
                }
            };
            PomfHandler = class PomfHandler extends HandlerBase {
                constructor() {
                    super(...arguments);
                    this._uploadUrl = 'https://pomf.cat/upload.php';
                    this._uploadPrefix = 'https://a.pomf.cat/';
                }
                get HandlerType() {
                    return HandlerType.Pomf;
                }
                UploadImage(image, callback) {
                    let formData = new FormData();
                    formData.append('files[]', image, "image.jpg");
                    let jqXHR = jquery_1.default.ajax({
                        url: this._uploadUrl,
                        type: 'POST',
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        xhr: function () {
                            var myXhr = jquery_1.default.ajaxSettings.xhr();
                            if (myXhr.upload) {
                                myXhr.upload.addEventListener('progress', function (e) {
                                    if (e.lengthComputable) {
                                        console.debug(`Progress: ${e.loaded}, ${e.total}`);
                                    }
                                }, false);
                            }
                            return myXhr;
                        }
                    })
                        .done(data => {
                        console.debug("Image upload complete!");
                        let uploadedFile = data.files[0];
                        let uploadedFileName = uploadedFile.url;
                        callback(`${this._uploadPrefix}${uploadedFileName}`);
                    })
                        .fail((jqXHR, textStatus, error) => {
                        console.error(`Image upload failed! Status: ${textStatus}, Error: ${error}`);
                    });
                }
            };
            Initialize();
        }
    };
});
