# Reuploader

A web extension for quickly and easily rehosting images.

Still in early development, plus I don't know how to make web extensions.

## Building

Source is mostly TypeScript with modules being managed by npm. Webpack is leveraged to transpile to JavaScript and combine scripts into a single bundle file.

### Requirements

These will need to be installed as command line accessible tools.

* [npm](https://www.npmjs.com/)
* [webpack](https://www.npmjs.com/package/webpack)

### Steps

Execute from command line at root directory:

    > npm install
    > webpack

## Running

I don't know which browsers the extension currently works on nor do I know how to load a local extension on most of them, I've just been using Firefox for now.

* Load the extension in your favorite browser
* Right click on an image and select the Reupload option

## Debugging

I don't know, just do print debugging or something. Maybe your browser's developer console will let you step through the transpiled JavaScript, it may even let you monitor network traffic from the extension if you're lucky.