
const errors = require('restify-errors');
const fs = require('fs');
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const postSchema = require('../validators/postRequest');
ajv.addSchema(postSchema, 'postSchema');
/*var validate = ajv.compile(schema);
var valid = validate(data);
if (!valid) console.log(validate.errors);*/

function errorResponse(schemaErrors) {
  let errors = schemaErrors.map((error) => {
    return {
      path: error.dataPath,
      message: error.message
    }
  })
  return {
    status: 'failed',
    errors: errors
  }
}

const validatePostDelayParams = function(req, res, next) {
    console.log("validatePostDelayParams()");
    return validatePostParams(postSchema, req, res, next);
}

const validatePostParams = function(schema, req, res, next) {
    console.log("validatePostParams()");
    const status = ajv.validate(schema, req.params);
    console.log(ajv.errors);
    if(!status) {
        console.log("validatePostParams() - nok");
        return res.send(errorResponse(ajv.errors));
    }
    console.log("validatePostParams() - ok");
    return next();
}

const handleGetDelayRequest = function(req, res, next) {
    console.log("handleGetDelayRequest()");
    const data = fs.readFileSync("/sys/class/ledclass/led03/led_attr", 'UTF-8');
    console.log(data);
    res.json({delay: Number(data.split("\n")[0])});
    return next();
};

const handlePostDelayRequest = function(req, res, next) {
    console.log("handlePostDelayRequest()");
    const {value} = req.params;
    console.log(value);
    fs.writeFileSync("/sys/class/ledclass/led03/led_attr", value);
    res.send(200);
    return next();
};

const handlePostStartRequest = function(req, res, next) {
    console.log("handlePostStartRequest()");
    fs.writeFileSync("/sys/class/ledclass/led03/led_attr", "on");
    res.send(200);
    return next();
 };

 const handlePostStopRequest = function(req, res, next) {
    console.log("handlePostStopRequest()");
    fs.writeFileSync("/sys/class/ledclass/led03/led_attr", "off");
    res.send(200);
    return next();
};


module.exports = function(server) {

	server.post('/blink/delay',
        validatePostDelayParams,
        handlePostDelayRequest,
	);

	server.post('/blink/start',
        handlePostStartRequest,
	);

	server.post('/blink/stop',
        handlePostStopRequest,
	);

	server.get('/blink/delay',
        handleGetDelayRequest,
    );

};    