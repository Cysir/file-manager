const { ipcRenderer } = require('electron')

export function sendMessage(ins,...data) {
    ipcRenderer.send(ins,data)
}
export function register(ins,callback) {
    ipcRenderer.on(ins,callback)
}
export function unregister(ins,callback) {
    ipcRenderer.removeListener(ins,callback)
}
export default {sendMessage,register,}