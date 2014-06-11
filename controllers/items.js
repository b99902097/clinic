var fs = require('fs');

// GET /:id
exports.visit = function(req, res){
    res.render('canvas', {canvasId: req.params.id});
};

// POST /:id
exports.save = function(req, res){
    var newImg = req.body;
    var imgContent = newImg.img.replace(/^data:image\/png;base64,/, '');
    var fileName = 'public/' + req.params.id + '.png';
    fs.writeFileSync(fileName, imgContent, 'base64', function(err){ console.log(err); });
    res.json({path: '/' + req.params.id + '.png'});
};
