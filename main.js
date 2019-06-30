const {app, BrowserWindow} = require('electron')
const url = require('url');
const path = require('path');

let win;

function createWindow() {
    //Create the browser windows
    win = new BrowserWindow({
        width: 800,
        height: 800,
        icon: `file://${__dirname}/dist/assets/logo.png`
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    //uncomment below to open the devtools.
    win.webContents.openDevTools()

    win.on('closed', function() {
        win = null
    })
}

//Create window on electron initialization
app.on('ready', createWindow)

//Quit when all windows are closed
app.on('window-all-closed', function(){

    //On macOs specific close process
    if(process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if(win == null){
        createWindow()
    }
})