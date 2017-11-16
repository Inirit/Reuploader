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

function uploadImage(data)
{
	let xhttpUpload = new XMLHttpRequest();

	xhttpUpload.open('POST', 'https://pomf.cat/upload.php');
	xhttpUpload.onreadystatechange = function ()
	{
		if (xhttpUpload.readyState === XMLHttpRequest.DONE && xhttpUpload.status === 200)
		{
			console.log("I did the thing");

			uploadImage(xhttpUpload.response);
		}
	}

}

function getImage(url)
{
	let jqXHR = $.get(url)
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