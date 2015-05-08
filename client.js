var ipc = require('ipc');
var ty = 24;
var tx = 8;
var stage;

function init() {
    stage = new createjs.Stage("demoCanvas");
    ipc.on('system-message', function(event) {
        var color = {
            undefined: '#5577ff',
            error: '#cc0000'
        }[event.type];
        // if(event.type === 'error'){
        //     color = '#cc0000';
        // }
        print(event.message, {color: color});
    });
    ipc.on('redis-message', function(event) {
        print(event.message);
    });
}

function print(line, params){
    params = params || {};
    line = line.split('');
    var x = tx;
    var y = ty;

    function printLetter(){
        var letter = line.shift();
        var text = new createjs.Text(letter, params.font || "14px Inconsolata", params.color || "#ff7700");
        text.x = x;
        text.y = y;
        text.textBaseline = "alphabetic";
        stage.addChild(text);
        stage.update();
        x += text.getMeasuredWidth();
        if(!line.length){
            createjs.Ticker.removeEventListener("tick", printLetter);
        }
    }

    createjs.Ticker.addEventListener("tick", printLetter);
    ty += 16;
}
