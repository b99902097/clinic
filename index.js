var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');

var items = require('./controllers/items');

var app = express();

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
 * expose all files under 'public' folder to app. When a browser requires static files, it will find under this folder.
 * (therefore we put index.html at 'public')
 */
app.use(express.static('./public'));
app.use(logger('dev'));
app.use(bodyParser());

app.get('/:id', items.visit);
app.post('/:id', items.save);

app.listen(app.get('port'), function(){
    console.log('Express server started at port ' + app.get('port'));
});
