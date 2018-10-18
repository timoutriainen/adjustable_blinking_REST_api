const Ajv = require('ajv');
const Gpio = require('pigpio').Gpio;
const debug = require('debug')('pwm');
const postSpeedReqSchema = require('../validators/postSpeedRequest');
const postRotationReqSchema = require('../validators/postRotationRequest');
const MotorApi = require('../services/motor-api');

const led = new Gpio(4, { mode: Gpio.OUTPUT });
const left = new Gpio(17, { mode: Gpio.OUTPUT });
const right = new Gpio(27, { mode: Gpio.OUTPUT });

const pwm = MotorApi.create({ led, right, left });

const ajv = new Ajv({ allErrors: true });
ajv.addSchema(postSpeedReqSchema, 'postSchema');

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
  debug('validatePostParams()');
  const status = ajv.validate(schema, req.params);
  if (ajv.errors) {
    debug(ajv.errors);
  }
  if (!status) {
    debug('validatePostParams() - nok');
    return res.send(createErrorResponse(ajv.errors));
  }
  debug('validatePostParams() - ok');
  return next();
};

const validatePostDirectionParams = (req, res, next) => {
  debug('validatePostDirectionParams()');
  return validatePostParams(postRotationReqSchema, req, res, next);
};

const validatePostSpeedParams = (req, res, next) => {
  debug('validatePostSpeedParams()');
  return validatePostParams(postSpeedReqSchema, req, res, next);
};

const handleGetRotationRequest = (req, res, next) => {
  debug('handleGetRotationRequest()');
  const rotation = pwm.getRotation();
  debug(`rotation: ${rotation}`);
  res.json({ rotation });
  return next();
};

const handlePostRotationRequest = (req, res, next) => {
  debug('handlePostRotationRequest()');
  const { rotation } = req.params;
  debug(`new rotation: ${rotation}`);
  pwm.setRotation(rotation);
  res.json({ rotation });
  return next();
};

const handleGetSpeedRequest = (req, res, next) => {
  debug('handleGetSpeedRequest()');
  const speed = pwm.getSpeed();
  debug(`speed is ${speed}`);
  res.json({ speed });
  return next();
};

const handlePostSpeedRequest = (req, res, next) => {
  debug('handlePostSpeedRequest()');
  const { speed } = req.params;
  pwm.setSpeed(speed)
  res.json({ speed });
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
