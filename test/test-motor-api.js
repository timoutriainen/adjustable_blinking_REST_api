const debug = require('debug')('pwm');
const { assert } = require('chai');
const MotorApi = require('../services/motor-api');

let motor;
const fakeIo = {
  led: {
    pwmWrite: (value) => {
      debug(`led::pwmWrite(${value})`);
    },
  },
  right: {
    digitalWrite: (value) => {
      debug(`right::digitalWrite(${value})`);
    },
  },
  left: {
    digitalWrite: (value) => {
      debug(`left::digitalWrite(${value})`);
    },
  },
};

describe('MotorApi#Rotation', function () {
  beforeEach(function () {
    motor = MotorApi.create(fakeIo);
  });
  it('should be none initially', function () {
    assert(motor.getRotation() === 'none', 'rotation is initially none');
  });
  it('should change to left when set', function () {
    motor.setRotation('left');
    assert(motor.getRotation() === 'left', 'rotation is left');
  });
  it('should change to right when set', function () {
    motor.setRotation('right');
    assert(motor.getRotation() === 'right', 'rotation is right');
  });
  it('should not change to invalid value when set', function () {
    motor.setRotation('right');
    motor.setRotation('foobar');
    assert(motor.getRotation() === 'right', 'rotation is right');
  });
  it('should change to none when set', function () {
    motor.setRotation('right');
    motor.setRotation('none');
    assert(motor.getRotation() === 'none', 'rotation is none');
  });
});

describe('MotorApi#Speed', function () {
  beforeEach(function () {
    motor = MotorApi.create(fakeIo);
  });
  it('should be zero initially', function () {
    assert(motor.getSpeed() === 0, 'speed is initially zero');
  });
  it('should change to 100 when set', function () {
    motor.setSpeed(100);
    assert(motor.getSpeed() === 100, 'speed is 100');
  });
  it('should not change to invalid value 256 when set', function () {
    motor.setSpeed(100);
    motor.setSpeed(256);
    assert(motor.getSpeed() === 100, 'speed is 100');
  });
  it('should not change to invalid value -1 when set', function () {
    motor.setSpeed(100);
    motor.setSpeed(-1);
    assert(motor.getSpeed() === 100, 'speed is 100');
  });
});