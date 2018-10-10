
const fs = require('fs');
const Ajv = require('ajv');
const postSchema = require('../validators/motorRequest');
const Pwm = require('../services/pwm');
const Gpio = require('pigpio').Gpio;
const led = new Gpio(4, {mode: Gpio.OUTPUT});

const pwm = Pwm.create(led);

const ajv = new Ajv({ allErrors: true });
ajv.addSchema(postSchema, 'postSchema');

function traceLog(trace) {
  console.log(trace);
}

function createErrorResponse(schemaErrors) {
  const listOfErrors = schemaErrors.map(error => ({
    path: error.dataPath,
    message: error.message,
  }));

  return {
    status: 'failed',
    listOfErrors,
  };
}

const validatePostParams = (schema, req, res, next) => {
  traceLog('validatePostParams()');
  const status = ajv.validate(schema, req.params);
  if (ajv.errors) {
    traceLog(ajv.errors);
  }
  if (!status) {
    traceLog('validatePostParams() - nok');
    return res.send(createErrorResponse(ajv.errors));
  }
  traceLog('validatePostParams() - ok');
  return next();
};

const validatePostDirectionParams = (req, res, next) => {
  traceLog('validatePostDirectionParams()');
  return validatePostParams(postSchema, req, res, next);
};

const validatePostSpeedParams = (req, res, next) => {
  traceLog('validatePostSpeedParams()');
  return validatePostParams(postSchema, req, res, next);
};

const handleGetRotationRequest = (req, res, next) => {
  traceLog('handleGetRotationRequest()');
  const rotationDirection = pwm.getRotation();
  traceLog(`rotation: ${rotationDirection}`);
  res.json({ rotation: rotationDirection });
  return next();
};

const handleGetSpeedRequest = (req, res, next) => {
  traceLog('handleGetSpeedRequest()');
  const newSpeed = pwm.getSpeed();
  traceLog(newSpeed);
  res.json({ speed: newSpeed });
  return next();
};

const handlePostRotationRequest = (req, res, next) => {
  traceLog('handlePostRotationRequest()');
  const { value } = req.params;
  traceLog(`new delay: ${value}`);
  fs.writeFileSync('/sys/class/ledclass/led03/led_attr', value);
  res.json({ delay: value });
  return next();
};

const handlePostSpeedRequest = (req, res, next) => {
  traceLog('handlePostSpeedRequest()');
  const { speed } = req.params;
  pwm.setSpeed(speed)
  res.send(200);
  return next();
};

module.exports = (server) => {
  server.post('/motor/rotation',
    validatePostDirectionParams,
    handlePostRotationRequest);

  server.get('/motor/rotation',
    handleGetRotationRequest);

  server.post('/motor/speed',
    validatePostSpeedParams,
    handlePostSpeedRequest);

  server.get('/motor/speed',
    handleGetSpeedRequest);
};
