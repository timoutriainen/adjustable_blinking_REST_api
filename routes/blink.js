
const fs = require('fs');
const Ajv = require('ajv');
const postSchema = require('../validators/postRequest');

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

const validatePostDelayParams = (req, res, next) => {
  traceLog('validatePostDelayParams()');
  return validatePostParams(postSchema, req, res, next);
};

const handleGetDelayRequest = (req, res, next) => {
  traceLog('handleGetDelayRequest()');
  const data = fs.readFileSync('/sys/class/ledclass/led03/led_attr', 'UTF-8');
  traceLog(data);
  res.json({ delay: Number(data.split('\n')[0]) });
  return next();
};

const handlePostDelayRequest = (req, res, next) => {
  traceLog('handlePostDelayRequest()');
  const { value } = req.params;
  traceLog(`new delay: ${value}`);
  fs.writeFileSync('/sys/class/ledclass/led03/led_attr', value);
  res.json({ delay: value });
  return next();
};

const handlePostStartRequest = (req, res, next) => {
  traceLog('handlePostStartRequest()');
  fs.writeFileSync('/sys/class/ledclass/led03/led_attr', 'on');
  res.send(200);
  return next();
};

const handlePostStopRequest = (req, res, next) => {
  traceLog('handlePostStopRequest()');
  fs.writeFileSync('/sys/class/ledclass/led03/led_attr', 'off');
  res.send(200);
  return next();
};


module.exports = (server) => {
  server.post('/blink/delay',
    validatePostDelayParams,
    handlePostDelayRequest);

  server.post('/blink/start',
    handlePostStartRequest);

  server.post('/blink/stop',
    handlePostStopRequest);

  server.get('/blink/delay',
    handleGetDelayRequest);
};
