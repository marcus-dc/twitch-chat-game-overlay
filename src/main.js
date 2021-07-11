const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
const utils = require('./utils');

// Windows
let initWin;
let appWin;
let customizer;

let tray;

const createWindow = () => {
  initWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (process.env.NODE_ENV.trim() !== 'production') initWin.webContents.openDevTools();

  initWin.loadFile('./index.html');
};

app.whenReady().then(() => {
  createWindow();
  console.log(`> App ready`);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('initAppWin', (evt, arg) => {
  appWin = new BrowserWindow({
    ...utils.getSizeAndPosition(initWin),
    frame: false,
    alwaysOnTop: arg.alwaysOnTop,
    opacity: arg.opacity || .75,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  appWin.setIgnoreMouseEvents(true);
  appWin.loadURL(arg.url);
  initWin.close();

  tray = new Tray(path.join(__dirname, './assets/twitch.ico'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Always on Top',
      checked: arg.alwaysOnTop,
      type: 'checkbox',
      click: (menuItem) => {
        appWin.setAlwaysOnTop(menuItem.checked, 'normal');
        appWin.setVisibleOnAllWorkspaces(true);
        appWin.setFullScreenable(false);
      }
    },
    {
      label: 'Customize',
      click: () => {
        customizer = new BrowserWindow({
          ...utils.getSizeAndPosition(appWin),
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
          }
        });

        customizer.loadFile('./customizer.html');
      }
    },
    {
      label: 'Exit',
      role: 'quit'
    }
  ]);

  tray.setContextMenu(contextMenu);
});

ipcMain.on('customize', (evt, arg) => {
  if (arg === 'position') {
    const { width, height, x, y } = utils.getSizeAndPosition(customizer);

    appWin.setSize(width, height);
    appWin.setPosition(x, y);

    customizer.close();
  } else {
    appWin.setOpacity(arg);
  }
});