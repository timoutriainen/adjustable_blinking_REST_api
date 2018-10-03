
const fs = require('fs');
const Ajv = require('ajv');
const postSchema = require('../validators/motorRequest');

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

const handleGetDirectionRequest = (req, res, next) => {
  traceLog('handleGetDirectionRequest()');
  const data = fs.readFileSync('/sys/class/ledclass/led03/led_attr', 'UTF-8');
  traceLog(data);
  res.json({ delay: Number(data.split('\n')[0]) });
  return next();
};

const handleGetSpeedRequest = (req, res, next) => {
  traceLog('handleGetSpeedRequest()');
  const data = fs.readFileSync('/sys/class/ledclass/led03/led_attr', 'UTF-8');
  traceLog(data);
  res.json({ delay: Number(data.split('\n')[0]) });
  return next();
};

const handlePostDirectionRequest = (req, res, next) => {
  traceLog('handlePostDirectionRequest()');
  const { value } = req.params;
  traceLog(`new delay: ${value}`);
  fs.writeFileSync('/sys/class/ledclass/led03/led_attr', value);
  res.json({ delay: value });
  return next();
};

const handlePostSpeedRequest = (req, res, next) => {
  traceLog('handlePostSpeedRequest()');
  fs.writeFileSync('/sys/class/ledclass/led03/led_attr', 'on');
  res.send(200);
  return next();
};

module.exports = (server) => {
  server.post('/motor/direction',
    validatePostDirectionParams,
    handlePostDirectionRequest);

  server.get('/motor/direction',
    handleGetDirectionRequest);

  server.post('/motor/speed',
    validatePostSpeedParams,
    handlePostSpeedRequest);

  server.get('/motor/speed',
    handleGetSpeedRequest);
};
