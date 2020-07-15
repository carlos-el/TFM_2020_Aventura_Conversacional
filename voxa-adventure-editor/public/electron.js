const electron = require("electron");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;

// Create Electron main window
function createWindow() {
    mainWindow = new BrowserWindow({ width: 1000, height: 680 });
    // Load development server or index.html file if the project is already built.
    mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);
    // if (isDev) {
    //     mainWindow.webContents.openDevTools();
    //   }
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});