var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');

var status = {redis: false};
var redis = new require('ioredis')(8000, 'averr.in');
redis.on('connect', function(){
    status.redis = true;
});
redis.subscribe('notifications');

require('crash-reporter').start();
var mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

app.on('ready', function() {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    mainWindow.loadUrl('file://' + __dirname + '/index.html');
    mainWindow.webContents.on('did-finish-load', function(){
        mainWindow.webContents.send('system-message', {message: '> Application is ready.'});
        if(status.redis){
            mainWindow.webContents.send('system-message', {message: '> Redis connected.'});
        }else{
            mainWindow.webContents.send('system-message', {message: '> Redis not connected.', type: 'error'});
        }
    });

    redis.on('message', function(channel, message) {
        mainWindow.webContents.send('redis-message', {message: message, channel: channel});
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
