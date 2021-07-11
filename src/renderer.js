const { ipcRenderer } = require('electron');

'use strict';

const url = document.getElementById('url');
const form = document.getElementById('form');
const alwaysOnTop = document.getElementById('alwaysOnTop');
const opacity = document.getElementById('opacity');

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  ipcRenderer.send('initAppWin', { url: url.value, alwaysOnTop: alwaysOnTop.checked, opacity: opacity.value / 100 });
});
