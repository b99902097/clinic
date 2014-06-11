var flag = 'marker';
var c = document.getElementById('Canvas');
var ctx = document.getElementById('Canvas').getContext('2d');  
var c_up = document.getElementById('upCanvas');
var up = document.getElementById('upCanvas').getContext('2d');
var drawMode = false;
var x, y, endX, endY;
var outOfCanvas = false;
var oriR, oriG, oriB;
var _color;
var upsize = 50;

$('#drawing').on('mouseout', function(event){
    outOfCanvas = true;
    if (flag === 'eraser'){
        up.clearRect(0, 0, c_up.width, c_up.height);
    }
});

$('body').on('mouseup', function(event){
    if (flag === 'text') {
        $('input[type=text]').focus();
    }
    if (outOfCanvas){
        endDrawing(event);
    }
});

$('#drawing').on('mousedown', function(event){
    outOfCanvas = false;
    x = endX = event.pageX - event.target.offsetLeft;
    y = endY = event.pageY - event.target.offsetTop;
    switch(flag) {
        case 'line':
            drawMode = true;
            break;
        case 'marker':
            drawMode = true;
            break;
        case 'circle':
            drawMode = true;
            break;
        case 'rectangle':
            drawMode = true;
            break;
        case 'eraser':
            drawMode = true;
            startEraser(event);
            break;
        case 'ellipse':
            drawMode = true;
            drawEllipse(event);
            break;
        case 'fill':
            drawMode = true;
            getRGBA(event);
            break;
        case 'text':
            printText(event);
            break;
        default:
            alert('nothing');
            break;
    }
});

function drawEllipse(event){
    x = endX = event.pageX - event.target.offsetLeft;
    y = endY = event.pageY - event.target.offsetTop;
}

function startEraser(event){
    x = endX = event.pageX - event.target.offsetLeft;
    y = endY = event.pageY - event.target.offsetTop;
    ctx.moveTo(x, y);
    ctx.beginPath();
    ctx.clearRect(endX-ctx.lineWidth/2, endY-ctx.lineWidth/2, ctx.lineWidth, ctx.lineWidth);
}

function getRGBA(event){
    x = event.pageX - event.target.offsetLeft;
    y = event.pageY - event.target.offsetTop;
    var oriData = ctx.getImageData(x, y, 1, 1).data;
    oriR = oriData[0];
    oriG = oriData[1];
    oriB = oriData[2];
    oriA = oriData[3];
}

function fillArea(px, py) {
    if (px <= 0 || py <= 0 || px >= c.width || py >= c.height)
        return;

    var pixel = ctx.getImageData(px, py, 1, 1);
    var pixelData = pixel.data;
    if (pixelData[0] != oriR || pixelData[1] != oriG || pixelData[2] != oriB || pixelData[3] != oriA)
        return;
    else {
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillRect(px, py, 1, 1);

        fillArea(px+1, py);
        fillArea(px-1, py);
        fillArea(px, py+1);
        fillArea(px, py-1);
    }
}

function printText(event) {
	$('div.placeholder').find('input').remove();

	x = event.pageX - event.target.offsetLeft;
	y = event.pageY - event.target.offsetTop;

	placeholder = $('div.placeholder');

	var input = $('<input type="text">').prependTo(placeholder);
	$('input[type=text]').focus();
	placeholder.css('font-size', (ctx.lineWidth*2)).css('font-family', 'wt011');
        placeholder.on('keypress', 'input', function(e){
            if (e.which === 13){
                var input = $(this);
                var div = $(this).parents('div');
                if (input.val() !== ""){
                    ctx.font = (ctx.lineWidth*2) + "px wt011";
                    //var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
                    //gradient.addColorStop("0.5", ctx.strokeStyle);
                    //gradient.addColorStop("1.0", "red");
                    //ctx.fillStyle = gradient;
                    ctx.fillStyle = ctx.strokeStyle;
                    ctx.fillText(input.val(), x, y + 5 + parseInt((ctx.lineWidth*2))/2);
                    input.remove();
                }
            }
        });

	placeholder.css('position', 'absolute');
	placeholder.css('left', x);
	placeholder.css('top', y + upsize);
}

$('#drawing').on('mousemove', function(event){
    outOfCanvas = false;
    if (flag === 'eraser'){
        up.clearRect(0, 0, c_up.width, c_up.height);
        up.beginPath();
        endX = event.pageX - event.target.offsetLeft;
        endY = event.pageY - event.target.offsetTop;
        up.rect(endX-ctx.lineWidth/2, endY-ctx.lineWidth/2, ctx.lineWidth, ctx.lineWidth);
        up.stroke();
        up.closePath();
    }
    if (!drawMode) return;
    
    if (flag === 'line') {
        up.clearRect(0, 0, c_up.width, c_up.height);
        up.beginPath();
        up.moveTo(x, y);
        endX = event.pageX - event.target.offsetLeft;
        endY = event.pageY - event.target.offsetTop;
        up.lineTo(endX, endY);
        up.stroke();
        up.closePath();
    }
    else if (flag === 'marker'){
		var nextX = event.pageX - event.target.offsetLeft; 
		var nextY = event.pageY - event.target.offsetTop;
		sendCurve(endX, endY, nextX, nextY);
        endX = nextX;
        endY = nextY;
    }
    else if (flag === 'circle'){
        up.clearRect(0, 0, c_up.width, c_up.height);
        up.beginPath();
        endX = event.pageX - event.target.offsetLeft;
        endY = event.pageY - event.target.offsetTop;
        var dist = (x-endX)*(x-endX)+(y-endY)*(y-endY);
        up.arc((x + endX)/2, (y + endY)/2, Math.sqrt(dist)/2, 0, 2 * Math.PI);
        up.stroke();
        up.closePath();
    }
    else if (flag === 'rectangle'){
        up.clearRect(0, 0, c_up.width, c_up.height);
        up.beginPath();
        endX = event.pageX - event.target.offsetLeft;
        endY = event.pageY - event.target.offsetTop;
        up.rect(x,y,(endX-x),(endY-y));
        up.stroke();
        up.closePath();
    }
    else if (flag === 'ellipse'){
        up.clearRect(0, 0, c_up.width, c_up.height);
        up.beginPath();
        endX = event.pageX - event.target.offsetLeft;
        endY = event.pageY - event.target.offsetTop;
        //left, right, top_, bottom;

        if(endX>x){
            left = x;
            right = endX;
        }else{
            left = endX;
            right = x;
        }
        w=(right-left)/2;
        if(endY>y){
            top_ = y;
            bottom = endY;
        }else{
            top_ = endY;
            bottom = y;
        }
        h=(bottom-top_)/2;

        p1 = {x: left, y: bottom+h/3};
        p2 = {x: right, y: bottom+h/3};
        p3 = {x: right, y: bottom-h};

        up.moveTo(left,top_+h);
        up.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y);

        p4 = {x: left, y: top_-h/3};
        p5 = {x: right, y: top_-h/3};
        p6 = {x: right, y: bottom-h};

        up.moveTo(left,top_+h);
        up.bezierCurveTo(p4.x,p4.y,p5.x,p5.y,p6.x,p6.y);

        up.stroke();
        up.closePath();
    }
    else if (flag === 'eraser'){
        endX = event.pageX - event.target.offsetLeft;
        endY = event.pageY - event.target.offsetTop;
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.clearRect(endX-ctx.lineWidth/2, endY-ctx.lineWidth/2, ctx.lineWidth, ctx.lineWidth);
    }
});

$('#drawing').on('mouseup', endDrawing);

function endDrawing(event) {
    if (!drawMode) return;
    if (flag === 'line'){
		drawStraightLine(x, y, endX, endY, ctx.lineWidth, _color);
		sendStraightLine(x, y, endX, endY);
        up.clearRect(0, 0, c_up.width, c_up.height);
    }
    else if (flag === 'circle'){
        dist = (x - endX) * (x - endX) + (y - endY) * (y - endY);
        sendCircle((x + endX)/2, (y + endY)/2, Math.sqrt(dist)/2);
        up.clearRect(0, 0, c_up.width, c_up.height);
    }
    else if (flag === 'rectangle'){
        sendRectangle(x, y, endX, endY);
        up.clearRect(0, 0, c_up.width, c_up.height);
    }
    else if (flag == 'fill'){
        fillArea(x, y);
    }
    else if (flag === 'ellipse'){
        drawEllipse(x,y,endX,endY,ctx.lineWidth,_color);
        sendEllipse(x,y,endX,endY);
        up.clearRect(0, 0, c_up.width, c_up.height);
    }
    else if (flag === 'eraser'){
        ctx.clearRect(endX-ctx.lineWidth/2, endY-ctx.lineWidth/2, ctx.lineWidth, ctx.lineWidth);
    }
    drawMode = false;
    ctx.closePath();
}

function drawCurve(x, y, endX, endY, width, color) {
	var origWidth = ctx.lineWidth;   ctx.lineWidth = width;
	var origColor = ctx.strokeStyle; ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(x, y);
	ctx.lineTo(endX, endY);
	ctx.stroke();

	ctx.lineWidth = origWidth;
	ctx.strokeStyle = origColor;
}

function drawStraightLine(x, y, endX, endY, width, color) {
	var origWidth = ctx.lineWidth;   ctx.lineWidth = width;
	var origColor = ctx.strokeStyle; ctx.strokeStyle = color;

	ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

	ctx.lineWidth = origWidth;
    ctx.strokeStyle = origColor;
}

function drawRectangle(x, y, endX, endY, width, color){
    var origWidth = ctx.lineWidth;   ctx.lineWidth = width;
    var origColor = ctx.strokeStyle; ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.rect(x, y, (endX-x), (endY-y));
    ctx.stroke();

    ctx.lineWidth = origWidth;
    ctx.strokeStyle = origColor;
}

function drawCircle(x, y, dist, width, color){
    var origWidth = ctx.lineWidth;   ctx.lineWidth = width;
    var origColor = ctx.strokeStyle; ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.arc(x, y, dist, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.lineWidth = origWidth;
    ctx.strokeStyle = origColor;
}

function drawEllipse(x,y,endX,endY,width,color){
    var origWidth = ctx.lineWidth;   ctx.lineWidth = width;
    var origColor = ctx.strokeStyle; ctx.strokeStyle = color;
    if(endX>x){
        left = x;
        right = endX;
    }else{
        left = endX;
        right = x;
    }
    w=(right-left)/2;
    if(endY>y){
        top_ = y;
        bottom = endY;
    }else{
        top_ = endY;
        bottom = y;
    }
    h=(bottom-top_)/2;
    
    p1 = {x: left, y: bottom+h/3};
    p2 = {x: right, y: bottom+h/3};
    p3 = {x: right, y: bottom-h};
    
    up.moveTo(left,top_+h);
    up.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y);
    
    p4 = {x: left, y: top_-h/3};
    p5 = {x: right, y: top_-h/3};
    p6 = {x: right, y: bottom-h};
    
    ctx.beginPath();
    ctx.moveTo(left,top_+h);
    ctx.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y);
    ctx.moveTo(left,top_+h);
    ctx.bezierCurveTo(p4.x,p4.y,p5.x,p5.y,p6.x,p6.y);
    ctx.stroke();
    
    ctx.lineWidth = origWidth;
    ctx.strokeStyle = origColor;
    
}

// 顏色
function rgbToSimpleColor(rgbStr) {
    var rgbNum = rgbStr.split('(')[1].split(')')[0].split(', ');
    var rgb = (rgbNum[0] << 16) | (rgbNum[1] << 8) | rgbNum[2];
    return '#' + (0x1000000 | rgb).toString(16).substring(1).toUpperCase();
}

function setColor(event, value){
    $('.selected').removeClass('selected');
    var newColor;
    if (value === 'div'){
        newColor = $(event.target).addClass('selected').css('background-color');
        $('input[name=fgColor]').attr('value', rgbToSimpleColor(newColor));
    }
    else {  // input[name=fgColor]
        newColor = value;
    }
    _color = newColor;
    if (flag !== 'eraser'){
        ctx.strokeStyle = newColor;
        up.strokeStyle = newColor;
    }
}

// 筆粗
function setWidth(WW){
    ctx.lineWidth = WW;
    if (flag !== 'eraser')
        up.lineWidth = WW;
    else 
        ctx.lineWidth *= 2;
    $('#lineWidth').text(WW);
}

// 清除畫面
$('#clear').on('click', function(event){
    ctx.clearRect(0, 0, c.width, c.height);
    myDataRef.remove();
});

// 儲存畫面
$('#export').on('click', function(){
    var imgContent = c.toDataURL('image/png');
    var imgObj = $('<img alt="the painting">').attr('src', imgContent);
    $('#exportImg').html(imgObj);
    $.ajax({
        type: 'POST',
        url: '/' + $('#drawing').attr('title'),
        data: {img: imgContent},
        success: function(data, status){
            console.log(data);
        },
        dataType: 'json'
    });
});

$('#marker').on('click', function(event){
    disableTools();
    flag = event.target.id;
});

$('#line').on('click', function(event){
    disableTools();
    flag = event.target.id;
});

$('#rectangle').on('click', function(event){
    disableTools();
    flag = event.target.id;
});

$('#circle').on('click', function(event){
    disableTools();
    flag = event.target.id;
});

$('#ellipse').on('click', function(event){
    disableTools();
    flag = event.target.id;
});

$('#fill').on('click', function(event){
	disableTools();
	flag = event.target.id;
});

$('#text').on('click', function(event){
    disableTools();
    flag = event.target.id;
});

$('#eraser').on('click', function(event){
    enableEraser();
    flag = event.target.id;
});

function disableTools(){
    if (flag === 'eraser'){
        ctx.lineWidth = ctx.lineWidth / 2;
        ctx.strokeStyle = _color;
        up.lineWidth = ctx.lineWidth;
        up.strokeStyle = _color;
        up.clearRect(0, 0, c_up.width, c_up.height);
        $('canvas').css('cursor', 'auto');
    }
    else if (flag === 'text') {
        $('div.placeholder').find('input').remove();
    }
}

function enableEraser(){
    ctx.lineWidth = ctx.lineWidth * 2;
    ctx.strokeStyle = '#FFFFFF';
    up.lineWidth = 1;
    up.strokeStyle = '#000000';
    $('canvas').css('cursor', 'none');
}

setWidth(5);
setColor(null, '#000000');
$('.btn').button();
$('#marker').button('toggle');

// Firebase
var canvasId = $('#drawing').attr('title');
var myDataRef = new Firebase('https://simple-painter.firebaseio.com/' + canvasId + '/draw');
myDataRef.on('child_added', function(snapshot) {
    var msg = snapshot.val();
    console.info(msg);
    switch (msg.tool){
        case 'rectangle':
            drawRectangle(msg.p1.x, msg.p1.y, msg.p2.x, msg.p2.y, msg.width, msg.color);
            break;
        case 'circle':
            drawCircle(msg.p1.x, msg.p1.y, msg.dist, msg.width, msg.color);
            break;
		case 'line':
			drawStraightLine(msg.p1.x, msg.p1.y, msg.p2.x, msg.p2.y, msg.width, msg.color);
			break;
		case 'marker':
			drawCurve(msg.p1.x, msg.p1.y, msg.p2.x, msg.p2.y, msg.width, msg.color);
			break;
        case 'ellipse':
             drawEllipse(msg.p1.x,msg.p1.y,msg.p2.x,msg.p2.y,msg.width,msg.color);
             break;
        default:
            console.info('not supported tool type "' + msg.tool + '"');
            break;
    }
});

myDataRef.on('value', function(snapshot) {
    var msg = snapshot.val();
    if (msg === null){
        ctx.clearRect(0, 0, c.width, c.height);
    }
});

function sendCurve(x, y, endX, endY) {
	myDataRef.push({tool: 'marker', p1: {x: x, y: y}, p2: {x: endX, y: endY}, color: _color, width: ctx.lineWidth});
}

function sendStraightLine(x, y, endX, endY) {
	myDataRef.push({tool: 'line', p1: {x: x, y: y}, p2: {x: endX, y: endY}, color: _color, width: ctx.lineWidth});
}

function sendRectangle(x, y, endX, endY){
    myDataRef.push({tool: 'rectangle', p1: {x: x, y: y}, p2: {x: endX, y: endY}, color: _color, width: ctx.lineWidth});
}

function sendCircle(x, y, dist){
    myDataRef.push({tool: 'circle', p1: {x: x, y: y}, dist: dist, color: _color, width: ctx.lineWidth});
}

function sendEllipse(x,y,endX,endY){
    myDataRef.push({tool: 'ellipse', p1: {x: x, y: y}, p2: {x: endX, y: endY}, color: _color, width: ctx.lineWidth});
}
