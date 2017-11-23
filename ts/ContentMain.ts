async function OnMessage(messageEvent)
{
	const input = document.createElement('input');
	input.style.position = 'fixed';
	input.style.opacity = '0';
	input.value = messageEvent.url;

	const added = document.body.appendChild(input);
	added.select();

	const copyResult = document.execCommand('Copy');

	console.debug(`Copy result: ${copyResult}`);

	document.body.removeChild(added);
}

async function Initialize()
{
	console.debug(`Initializing...`);

	browser.runtime.onMessage.addListener(OnMessage)

	console.debug(`Initialization complete.`);
}

Initialize();