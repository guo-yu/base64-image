var fs = require('fs'),
    path = require('path');

var checkBase64 = function(raw) {
    return raw && typeof(raw) == 'string' && raw.match(/^data:image\/png;base64,/)
}

module.exports = function(dir) {
    return function(req, res, next) {
        var raw = req.body.base64;
        var filename = req.params.filename ? req.params.filename : 'demo.png';
        if (checkBase64(raw)) {
            var base64 = raw.replace(/^data:image\/png;base64,/, ""),
                abs = path.join(dir,filename);
            fs.writeFile(abs, base64, 'base64', function(err) {
                if (!err) {
                    res.locals.image = {
                        name: filename,
                        abs: abs
                    }
                    next();
                } else {
                    next(err);
                }
            });
        } else {
            next();
        }
    }
}