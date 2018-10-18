const debug = require('debug')('motor-api');

const ROTATION_LEFT = 'left';
const ROTATION_RIGHT = 'right';
const ROTATION_NONE = 'none';
const SPEED_ZERO = 0;

let dependencies;
let speed;
let rotation;

const setRotationToNone = () => {
  debug('setRotationToNone()');
  rotation = ROTATION_NONE;
  dependencies.right.digitalWrite(0);
  dependencies.left.digitalWrite(0);
};

const setRotationToLeft = () => {
  debug('setRotationToLeft()');
  rotation = ROTATION_LEFT;
  dependencies.right.digitalWrite(0);
  dependencies.left.digitalWrite(1);
};

const setRotationToRight = () => {
  debug('setRotationToRight()');
  rotation = ROTATION_RIGHT;
  dependencies.left.digitalWrite(0);
  dependencies.right.digitalWrite(1);
};

function MotorApi(motorIo) {
  dependencies = motorIo;
  debug('MotorApi: dependencies: %o', dependencies);
  MotorApi.prototype.setSpeed(SPEED_ZERO);
  setRotationToNone();
}

MotorApi.prototype.getSpeed = function getSpeed() {
  return speed;
};

MotorApi.prototype.setSpeed = (newSpeed) => {
  if (newSpeed > 255 || newSpeed < 0) {
    debug(`invalid speed ${newSpeed}`);
    return;
  }
  debug(`setSpeed(${newSpeed})`);
  speed = newSpeed;
  dependencies.led.pwmWrite(speed);
};

MotorApi.prototype.setRotation = (newRotation) => {
  debug(`setRotation(${newRotation})`);
  if (newRotation !== ROTATION_LEFT
    && newRotation !== ROTATION_RIGHT
    && newRotation !== ROTATION_NONE) {
    debug('invalid rotation value');
    return;
  }
  if (newRotation === ROTATION_LEFT) {
    setRotationToLeft();
    return;
  }
  if (newRotation === ROTATION_RIGHT) {
    setRotationToRight();
    return;
  }
  setRotationToNone();
};

MotorApi.prototype.getRotation = function getRotation() {
  return rotation;
};

function create(motorIo) {
  return new MotorApi(motorIo);
}

module.exports = { create };
