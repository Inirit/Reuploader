# Reuploader

A web extension for quickly and easily rehosting images.

## Release

Currently released for Firefox.

* [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reuploader/)

## Building

Source is mostly TypeScript with modules being managed by npm. Webpack is leveraged to transpile to JavaScript and combine scripts into a single bundle file.

### Requirements

These will need to be installed as command line accessible tools.

* [npm](https://www.npmjs.com/)
* [webpack](https://www.npmjs.com/package/webpack)

If using Firefox, an additional tool can be installed.

* [web-ext](https://www.npmjs.com/package/web-ext)

### Steps

Execute from command line at root directory:

    > npm install
    > webpack

### Running

Every browser is different, so you'll have to consult their documentation on how to load a temporary extension.

Once the extension is installed in the browser, just right click on an image hosted by any webpage and select the Reuploader menu item in the context menu.

### Debugging

I've had a difficult time trying to debug the extension when temporarily installed in Firefox. The "Browser Toolbox" seems to show some runtime info, but it's not great. Unfortunately I mostly just fall back on print debugging.
