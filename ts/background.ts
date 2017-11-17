import $ from 'jquery';

enum HandlerType
{
	Pomf,
	Imgur
}

interface IHandler
{
	HandlerType: HandlerType;

	UploadImage(image: Blob, callback: (uploadedUrl: string) => void): void;

	FetchImage(url: string, callback: (image: Blob) => void): void;
}

abstract class HandlerBase implements IHandler
{
	abstract HandlerType: HandlerType;
	abstract UploadImage(image: Blob, callback: (uploadedUrl: string) => void): void;

	FetchImage(url: string, callback: (image: Blob) => void): void
	{
		$.ajax(
			{
				url: url,
				type: "GET",
				xhr: function ()
				{
					var myXhr = $.ajaxSettings.xhr();
					myXhr.responseType = "blob";
					return myXhr;
				}
			})
			.done((data: Blob) =>
			{
				console.debug(`Image download complete. Size: ${data.size}, Type: ${data.type}`);

				callback(data);
			})
			.fail((jqXHR, textStatus, error) =>
			{
				console.error(`Image download failed! Status: ${textStatus}, Error: ${error}`);
			});
	}
}

class PomfHandler extends HandlerBase
{
	private readonly _uploadUrl: string = 'https://pomf.cat/upload.php';
	private readonly _uploadPrefix: string = 'https://a.pomf.cat/';

	get HandlerType(): HandlerType
	{
		return HandlerType.Pomf;
	}

	public UploadImage(image: Blob, callback: (uploadedUrl: string) => void): void
	{
		let formData = new FormData();
		formData.append('files[]', image, "image.jpg");

		let jqXHR = $.ajax(
			{
				url: this._uploadUrl,
				type: 'POST',
				data: formData,
				cache: false,
				contentType: false,
				processData: false,
				xhr: function ()
				{
					var myXhr = $.ajaxSettings.xhr();
					if (myXhr.upload)
					{
						myXhr.upload.addEventListener('progress', function (e)
						{
							if (e.lengthComputable)
							{
								console.debug(`Progress: ${e.loaded}, ${e.total}`);
							}
						}, false);
					}
					return myXhr;
				}
			})
			.done(data =>
			{
				console.debug("Image upload complete!");

				let uploadedFile = data.files[0]
				let uploadedFileName = uploadedFile.url;

				callback(`${this._uploadPrefix}${uploadedFileName}`);
			})
			.fail((jqXHR, textStatus, error) =>
			{
				console.error(`Image upload failed! Status: ${textStatus}, Error: ${error}`);
			});
	}
}

function OnCreated()
{
	if (browser.runtime.lastError)
	{
		console.error(`Error: ${browser.runtime.lastError}`);
	} else
	{
		console.debug("Item created successfully");
	}
}

function DoSomethingWithNewUrl(uploadedUrl: string)
{
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

function Initialize()
{
	console.debug(`Initializing...`);

	browser.contextMenus.create(
		{
			id: "reuploadImageMenuItem",
			title: browser.i18n.getMessage("reuploadImageMenuItemLabel"),
			contexts: ["image"]
		}, OnCreated);

	browser.contextMenus.onClicked.addListener((info, tab) =>
	{
		switch (info.menuItemId)
		{
			case "reuploadImageMenuItem":
				if (!info.srcUrl)
				{
					console.error(`Image was selected, but src url could not be found!`);
				}
				else
				{
					console.debug(`Image selected.SrcUrl: ${info.srcUrl}, TabId: ${tab.id}`);

					let handler = new PomfHandler();

					handler.FetchImage(
						info.srcUrl,
						(image: Blob) => handler.UploadImage(image, DoSomethingWithNewUrl));
				}

				break;
		}
	});

	console.debug(`Initialization complete.`);
}

Initialize();