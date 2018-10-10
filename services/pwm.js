const debug = require('debug')('pwm');

const ROTATION_STOPPED = 0;
const ROTATION_LEFT = 1;
const ROTATION_RIGHT = 2;
const SPEED_ZERO = 0;

let dependencies;
let speed;
let rotation;

function Pwm(pwmIo) {
    debug('Pwm(%o)', pwmIo);
    io = pwmIo;
    speed = SPEED_ZERO;
    rotation = ROTATION_STOPPED;
}

Pwm.prototype.getSpeed = function() {
    return speed;
}

Pwm.prototype.setSpeed = function(newSpeed) {
    if (newSpeed > 255 || newSpeed < 0) {
        return;
    }
    speed = newSpeed;
    io.pwmWrite(speed);
}

Pwm.prototype.setRotationToLeft = function() {
    rotation = ROTATION_LEFT;
}

Pwm.prototype.setRotationToRight = function() {
    rotation = ROTATION_RIGHT;
}

Pwm.prototype.getRotation = function() {
    return rotation;
}

function create(pwmIo) {
    return new Pwm(pwmIo);
}

module.exports = { create };