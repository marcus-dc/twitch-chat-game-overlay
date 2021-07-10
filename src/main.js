const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');

let win;
let customizer;
let tray;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    // opacity: .75,
    // alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (process.env.NODE_ENV !== 'production') win.webContents.openDevTools();

  win.loadFile('./index.html');
};

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('asynchronous-message', (evt, arg) => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    opacity: .75,
    // alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.setIgnoreMouseEvents(true);
  win.loadURL(arg);

  tray = new Tray(path.join(__dirname, './assets/twitch.ico'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Always on Top',
      type: 'checkbox',
      click: (menuItem) => {
        win.setAlwaysOnTop(menuItem.checked);
      }
    },
    {
      label: 'Customize',
      click: () => {
        customizer = new BrowserWindow({
          width: 800,
          height: 600,
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
    const [width, height] = customizer.getSize();
    const [x, y] = customizer.getPosition();

    win.setSize(width, height);
    win.setPosition(x, y);

    customizer.close();
  } else {
    win.setOpacity(arg);
  }
});