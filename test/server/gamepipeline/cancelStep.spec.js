/*global describe, it, beforeEach, expect, jasmine*/

const GamePipeline = require('../../../server/game/gamepipeline.js');

describe('the GamePipeline', function() {
    var pipeline;
    var step;

    beforeEach(function() {
        pipeline = new GamePipeline();
    });

    describe('the cancelStep() function', function() {
        describe('when the next step is normal', function() {
            beforeEach(() => {
                step = jasmine.createSpy('step');
                pipeline.initialise([step]);
            });

            it('should remove the step', function() {
                pipeline.cancelStep();
                expect(pipeline.length).toBe(0);
            });
        });

        describe('when the next step is cancellable', function() {
            beforeEach(() => {
                step = jasmine.createSpyObj('step', ['cancelStep', 'isComplete']);
                pipeline.initialise([step]);
            });

            it('should call cancelStep on the step', function() {
                pipeline.cancelStep();
                expect(step.cancelStep).toHaveBeenCalled();
            });

            it('should keep the step if it is not complete', () => {
                step.isComplete.and.returnValue(false);
                pipeline.cancelStep();
                expect(pipeline.length).toBe(1);
            });

            it('should remove the step if it is complete', () => {
                step.isComplete.and.returnValue(true);
                pipeline.cancelStep();
                expect(pipeline.length).toBe(0);
            });
        });
    });
});
