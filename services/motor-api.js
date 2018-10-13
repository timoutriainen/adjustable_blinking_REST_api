const debug = require('debug')('motor-api');

const ROTATION_LEFT = 'left';
const ROTATION_RIGHT = 'right';
const ROTATION_NONE = 'none';
const SPEED_ZERO = 0;

let dependencies;
let speed;
let rotation;

function MotorApi(motorIo) {
    dependencies = motorIo;
    debug('MotorApi: dependencies: %o', dependencies);
    MotorApi.prototype.setSpeed(SPEED_ZERO);
    setRotationToNone();
}

MotorApi.prototype.getSpeed = function() {
    return speed;
}

MotorApi.prototype.setSpeed = function(newSpeed) {
    if (newSpeed > 255 || newSpeed < 0) {
        debug(`invalid speed ${newSpeed}`);
        return;
    }
    speed = newSpeed;
    dependencies.led.pwmWrite(speed);
}

const setRotationToNone = function() {
    debug('setRotationToNone()');
    rotation = ROTATION_NONE;
    dependencies.right.digitalWrite(0);
    dependencies.left.digitalWrite(0);
}

const setRotationToLeft = function() {
    debug('setRotationToLeft()');
    rotation = ROTATION_LEFT;
    dependencies.right.digitalWrite(0);
    dependencies.left.digitalWrite(1);
}

const setRotationToRight = function() {
    debug('setRotationToRight()');
    rotation = ROTATION_RIGHT;
    dependencies.left.digitalWrite(0);
    dependencies.right.digitalWrite(1);
}

MotorApi.prototype.setRotation = function(rotation) {
    debug(`setRotation(${rotation})`);
    if (rotation !== ROTATION_LEFT && rotation !== ROTATION_RIGHT & rotation !== ROTATION_NONE) {
        debug('invalid rotation value');
        return;
    }
    if (rotation === ROTATION_LEFT) {
        return setRotationToLeft();
    }
    if (rotation === ROTATION_RIGHT) {
        return setRotationToRight();
    }
    setRotationToNone();
}

MotorApi.prototype.getRotation = function() {
    return rotation;
}

function create(motorIo) {
    return new MotorApi(motorIo);
}

module.exports = { create };