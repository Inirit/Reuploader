# Reuploader

[![Build Status](https://travis-ci.org/Inirit/Reuploader.svg?branch=master)](https://travis-ci.org/Inirit/Reuploader) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/70acff441d81487380ae4923d0f819f3)](https://www.codacy.com/app/Inirit/Reuploader?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Inirit/Reuploader&amp;utm_campaign=Badge_Grade)

A web extension for quickly and easily rehosting images.

## Release

Currently released as an alpha and only for Firefox. May support other browsers later.

* [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reuploader/)

## Status

* Nov. 20
  * Alpha release has been published to Firefox addon hub
* Nov. 19
  * Basic feature set is now implemented.
  * Nothing has been published yet, but I'm hoping to do so soon.
  * Code still needs some cleanup
* Nov. 15
  * Still in early development, plus I don't know how to make web extensions.
  * I hate JavaScript.

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

## Running

I do not know how to load a web extension in all browsers nor do I know which browsers this extension currently works with.

If using Firefox, you can load a build from the command line.

    > web-ext run

If not using Firefox, you'll have to figure it out.

Once installed, just right click on an image hosted by any webpage and select one of the Reuploader menu items in the context menu.

## Debugging

I don't know, just do print debugging or something. Maybe your browser's developer console will let you step through the transpiled JavaScript, it may even let you monitor network traffic from the extension if you're lucky.
