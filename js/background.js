function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    }
    else {
        console.log("Item created successfully");
    }
}
function onRemoved() {
    console.log("Item removed successfully");
}
function onError(error) {
    console.log(`Error: ${error}`);
}
function uploadImage(data) {
    let xhttpUpload = new XMLHttpRequest();
    xhttpUpload.open('POST', 'https://pomf.cat/upload.php');
    xhttpUpload.onreadystatechange = function () {
        if (xhttpUpload.readyState === XMLHttpRequest.DONE && xhttpUpload.status === 200) {
            console.log("I did the thing");
            uploadImage(xhttpUpload.response);
        }
    };
}
function getImage(url) {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', url);
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            console.log("I did the thing");
            uploadImage(xhttp.response);
        }
    };
    xhttp.send();
}
browser.contextMenus.create({
    id: "menu1",
    title: browser.i18n.getMessage("menu1Title"),
    contexts: ["image"]
}, onCreated);
