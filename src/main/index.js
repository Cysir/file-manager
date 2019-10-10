import { app,MenuItem, BrowserWindow,Menu,Tray } from 'electron'
let path = require('path')
const { ipcMain } = require('electron')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
var contextMenu
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.on('close', (event) => {
    mainWindow.hide();
    mainWindow.setSkipTaskbar(true);
    event.preventDefault();
  });
  createTray()
}
let tray = null;
function createTray() {
console.log("加载图片地址")
  // tray = new Tray('C:\\Users\\zcy\\Documents\\ZCY_Project\\B\\file-manager\\build\\icons\\icon.ico');
  let mpath = path.join(__dirname, '../../static/icons/task_logo.png')
  if(process.env.NODE_ENV !== 'development'){
    mpath = path.join(__dirname,'./static/icons/task_logo.png')
  }
  console.log("测试地址,",mpath)
  tray = new Tray(mpath);

   contextMenu = Menu.buildFromTemplate([{
     label:"未登录",id:0
   },
    {click:()=>{
        mainWindow.minimize()
      },label:'最小化'},
     {label:'退出登录',click:()=>{
        mainWindow.webContents.send('MsgExitLogin')
         mainWindow.show();
         mainWindow.setSkipTaskbar(true);
       }},
    { label: '退出', click: () => { mainWindow.destroy(); app.quit(); } },
  ])
  tray.setToolTip('重点工作任务智能助手')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {

    if (mainWindow.isVisible()) {
      // console.log('窗口是否聚',mainWindow.isFocused())
      if (mainWindow.isFocused()){
        mainWindow.hide()
        mainWindow.setSkipTaskbar(false)
      }
      else{
        mainWindow.focus()
      }

    } else {
      mainWindow.show();
      mainWindow.setSkipTaskbar(true);
    }
  })
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
//接收弹窗

ipcMain.on('indexMessage', (event, arg) => {
  console.log('aaa',arg) // prints "ping"
  tray.displayBalloon({title:"您有一条新信息",content:arg})
  // event.reply('asynchronous-reply', 'pong')
})
//接收用户信息

ipcMain.on('MsgUserInfo', (event, arg) => {
  console.log('aaa',arg) // prints "ping"
  console.log(contextMenu.getMenuItemById(0))
  contextMenu.getMenuItemById(0).label='当前用户：'+arg
  // contextMenu.insert(0,new MenuItem({label:'当前用户：'+arg}))
  // event.reply('asynchronous-reply', 'pong')
})
