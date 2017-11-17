import $ from 'jquery';

function onCreated()
{
	if (browser.runtime.lastError)
	{
		console.log(`Error: ${browser.runtime.lastError}`);
	} else
	{
		console.log("Item created successfully");
	}
}

function onRemoved()
{
	console.log("Item removed successfully");
}

function onError(error: string)
{
	console.log(`Error: ${error}`);
}

function uploadImage(imageData: Blob)
{
	let formData = new FormData();
	formData.append('files[]', imageData, "image.jpg");

	console.log(formData.get('files[]'));

	let jqXHR = $.ajax(
		{
			url: 'https://pomf.cat/upload.php',
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
					// For handling the progress of the upload
					myXhr.upload.addEventListener('progress', function (e)
					{
						if (e.lengthComputable)
						{
							$('progress').attr({
								value: e.loaded,
								max: e.total,
							});

							console.log(`Progress: ${e.loaded}, ${e.total}`);
						}
					}, false);
				}
				return myXhr;
			}
		})
		.done(data =>
		{
			console.log("Image upload complete!");
			console.log(data);
		})
		.fail((jqXHR, textStatus, error) =>
		{
			console.error(`Image upload failed! Status: ${textStatus}, Error: ${error}`);
		});
}

function getImage(url: string)
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

			uploadImage(data);
		})
		.fail((jqXHR, textStatus, error) =>
		{
			console.error(`Image download failed! Status: ${textStatus}, Error: ${error}`);
		});
}

browser.contextMenus.create({
	id: "reuploadImageMenuItem",
	title: browser.i18n.getMessage("reuploadImageMenuItemLabel"),
	contexts: ["image"]
}, onCreated);

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
				console.debug(`Image selected. SrcUrl: ${info.srcUrl}, TabId: ${tab.id}`);

				getImage(info.srcUrl);
			}

			break;
	}
});