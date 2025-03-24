const { ipcRenderer } = require('electron')

window.exports = {
  saveData: (key, data) => {
    return window.utools.dbStorage.setItem(key, data)
  },
  
  getData: (key) => {
    return window.utools.dbStorage.getItem(key)
  },
  
  removeData: (key) => {
    return window.utools.dbStorage.removeItem(key)
  }
}

console.log('preload.js loaded')
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded')
}) 