
const errors = require('restify-errors');
const fs = require('fs');
var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});
/*var validate = ajv.compile(schema);
var valid = validate(data);
if (!valid) console.log(validate.errors);*/

const validatePostParams = function(req, res, next) {
    console.log("validatePostParams()");
    return next();
}

const validateGetParams = function(req, res, next) {
    console.log("validateGetParams()");
    return next();
}

const handleGetRequest = function(req, res, next) {
    console.log("handleGetRequest()");
    const data = fs.readFileSync("/sys/class/ledclass/led03/led_attr", 'UTF-8');
    res.json({delay: Number(data.split("\n")[0])});
    return next();
};

const handlePostRequest = function(req, res, next) {
    console.log("handlePostRequest()");
    const {command} = req.params;
    console.log(command);
    if(command == "stop") {
        fs.writeFileSync("/sys/class/ledclass/led03/led_attr", "off");
        res.send(200);
        return next();
    }
    if(command == "start") {
        fs.writeFileSync("/sys/class/ledclass/led03/led_attr", "on");
        res.send(200);
        return next();
    }
};

module.exports = function(server) {

	server.post('/blink/:command',
        validatePostParams,
        handlePostRequest,
	);

	server.get('/blink',
        validateGetParams,
        handleGetRequest,
    );

};    