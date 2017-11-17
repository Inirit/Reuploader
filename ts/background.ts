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

function uploadImage(imageData)
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
			console.error(`Image upload failed! ${textStatus}, ${error}`);
		});
}

function getImage(url)
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
		.done(data =>
		{
			console.log("I did the thing");

			uploadImage(data);
		})
		.fail(() =>
		{
			console.error("I failed the thing");
		});
}

browser.contextMenus.create({
	id: "menu1",
	title: browser.i18n.getMessage("menu1Title"),
	contexts: ["image"]
}, onCreated);

browser.contextMenus.onClicked.addListener((info, tab) =>
{
	console.log("Item " + info.menuItemId + " clicked " +
		"in tab " + tab.id);

	switch (info.menuItemId)
	{
		case "menu1":
			getImage(info.srcUrl);
			break;
	}
});