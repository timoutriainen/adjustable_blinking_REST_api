const Pwm = require('../services/pwm');
const assert = require('chai').assert;
const debug = require('debug')('pwm');

let pwm;
var fakeIo = {
    pwmWrite: function(value) {
        debug('fakeIo::pwmWrite(' + value + ')');
    }
};

describe('Pwm#Rotation', function(){

    beforeEach(function(){
        pwm = Pwm.create(fakeIo);
    });
    it('should be stopped initially', function(){
        assert(pwm.getRotation() == 0, 'rotation is initially stopped');
    });
    it('should change to left when set', function(){
        pwm.setRotationToLeft();
        assert(pwm.getRotation() == 1, 'rotation is left');
    });
    it('should change to right when set', function(){
        pwm.setRotationToRight();
        assert(pwm.getRotation() == 2, 'rotation is right');
    });
})

describe('Pwm#Speed', function(){
    let pwm;
    beforeEach(function(){
        pwm = Pwm.create(fakeIo);
    });
    it('should be zero initially', function(){
        assert(pwm.getSpeed() == 0, 'speed is initially zero');
    });
    it('should change to 100 when set', function(){
        pwm.setSpeed(100);
        assert(pwm.getSpeed() == 100, 'speed is 100');
    });
    it('should not change to invalid value 256 when set', function(){
        pwm.setSpeed(100);
        pwm.setSpeed(256);
        assert(pwm.getSpeed() == 100, 'speed is 100');
    });
    it('should not change to invalid value -1 when set', function(){
        pwm.setSpeed(100);
        pwm.setSpeed(-1);
        assert(pwm.getSpeed() == 100, 'speed is 100');
    });
})