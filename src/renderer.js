const { ipcRenderer } = require('electron');

'use strict';

const url = document.getElementById('url');
const form = document.getElementById('form');

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  ipcRenderer.send('asynchronous-message', url.value);
});
