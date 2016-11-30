/*global describe, it, beforeEach, expect, spyOn*/

const BaseStep = require('../../../server/game/gamesteps/basestep.js');
const GamePipeline = require('../../../server/game/gamepipeline.js');

describe('the GamePipeline', function() {
    var pipeline;
    var step = new BaseStep(null);
    var player = {};
    var arg = {};
    var method = {};

    beforeEach(function() {
        pipeline = new GamePipeline();
    });

    describe('the handleMenuCommand() function', function() {
        describe('when the pipeline is empty', function() {
            beforeEach(() => {
                pipeline.initialise([]);
            });

            it('should return false', function() {
                expect(pipeline.handleMenuCommand(player, arg, method)).toBe(false);
            });
        });

        describe('when the step returns false', () => {
            beforeEach(() => {
                pipeline.initialise([step]);
                spyOn(step, 'onMenuCommand').and.returnValue(false);
            });

            it('should call the onMenuCommand handler', () => {
                pipeline.handleMenuCommand(player, arg, method);
                expect(step.onMenuCommand).toHaveBeenCalledWith(player, arg, method);
            });

            it('should return false', function() {
                expect(pipeline.handleMenuCommand(player, arg, method)).toBe(false);
            });
        });

        describe('when the step returns true', () => {
            beforeEach(() => {
                pipeline.initialise([step]);
                spyOn(step, 'onMenuCommand').and.returnValue(true);
            });

            it('should call the onMenuCommand handler', () => {
                pipeline.handleMenuCommand(player, arg, method);
                expect(step.onMenuCommand).toHaveBeenCalledWith(player, arg, method);
            });

            it('should return true', function() {
                expect(pipeline.handleMenuCommand(player, arg, method)).toBe(true);
            });
        });
    });
});
