'use strict';
const url = require('url');
const electron = require('electron');

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	});

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	// mainWindow =  new electron.BrowserWindow({
	// 	width: 600,
	// 	height: 400
	// });
	mainWindow = createMainWindow();
	mainWindow.loadURL(url.format({
		hostname: 'localhost',
		protocol: 'http:',
		port: '2000',
		slashes: true
	}));

	//Get access to the loaded webpage
	const contents = mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.executeJavaScript(
		`
		const shell = require('electron').shell;
		document.getElementById('app').addEventListener("click", (event) => {
			event.preventDefault();
			if(event.target.tagName === 'A') {
				shell.openExternal(event.target.href);
			}
		});
		`
	);
	});
	mainWindow.on('closed', onClosed);
});
