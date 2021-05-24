const {app, BrowserWindow, dialog} = require('electron');
const path = require('path');


let mainWindow

app.on('ready', createWindow);

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        webPreferences: {
            preload: path.join('file://',__dirname, 'preload.js'),
        },
        frame:false,//无边框
        transparent:true,//透明背景
        fullscreen:true,//默认全屏
    });
    //mainWindow.maximize();//默认最大化
    mainWindow.loadURL(path.join('file://',__dirname, 'main.html'));

    //开启网页调试工具
    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    mainWindow.on('resize',updateReply);

    mainWindow.on('move',updateReply);

    mainWindow.on('focus',Focus);

    mainWindow.on('blur',Blur);

    mainWindow.webContents.on('crashed', () => {
        const options={
            type:'info',
            title:'Renderer Process Crashed',
            message:'This process has crashed',
            buttons:['Reload','Close'],
        };
        dialog.showMessageBox(options,(index)=>{
            if(index===0) mainWindow.reload();
            else mainWindow.close();
        });
    });

    mainWindow.webContents.on('unresponsive',()=>{
        const options={
            type:'info',
            title:'Renderer Process Hanging',
            message:'This process has hanging',
            buttons:['Reload','Close'],
        };
        dialog.showMessageBox(options,(index)=>{
            if(index===0) mainWindow.reload();
            else mainWindow.close();
        });
    });

    mainWindow.webContents.on('responsive',()=>{
        //当窗口重新响应时执行事件
        const options={
            type:'info',
            title:'mainWindow Was Reload',
            message:'This window has reload',
            //buttons:['Reload','Close'],
        };
        dialog.showMessageBox(options,()=>{});
    });

};

function updateReply(){
    const message=`Size:${mainWindow.getSize()} Position:${mainWindow.getPosition()}`;
    console.log(message);
};

function Focus(){
    console.log('Wndow is onfocus');
};

function Blur(){
    console.log('Wndow is offfous');
};

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});