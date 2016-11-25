/*global describe, it, beforeEach, expect, spyOn*/

const BaseStep = require('../../../server/game/gamesteps/basestep.js');
const GamePipeline = require('../../../server/game/gamepipeline.js');

describe('the GamePipeline', function() {
    var pipeline;
    var step1 = new BaseStep(null);
    var step2 = new BaseStep(null);

    beforeEach(function() {
        pipeline = new GamePipeline();
    });

    describe('the continue() function', function() {
        describe('when the pipeline is empty', function() {
            beforeEach(() => {
                pipeline.initialise([]);
            });

            it('should return true', function() {
                expect(pipeline.continue()).toBe(true);
            });
        });

        describe('when a steps continue function returns false', () => {
            beforeEach(() => {
                spyOn(step1, 'continue').and.returnValue(false);
                spyOn(step2, 'continue').and.returnValue(true);
                pipeline.initialise([step1, step2]);
            });

            it('should return false', () => {
                expect(pipeline.continue()).toBe(false);
            });

            it('should not call continue on later steps', () => {
                pipeline.continue();
                expect(step2.continue).not.toHaveBeenCalled();
            });
        });

        describe('when a steps continue function returns true', () => {
            beforeEach(() => {
                spyOn(step1, 'continue').and.returnValue(true);
                spyOn(step2, 'continue').and.returnValue(true);
                pipeline.initialise([step1, step2]);
            });

            it('should return true', () => {
                expect(pipeline.continue()).toBe(true);
            });

            it('should call continue on each step', () => {
                pipeline.continue();
                expect(step1.continue).toHaveBeenCalled();
                expect(step2.continue).toHaveBeenCalled();
            });
        });

        describe('when a steps continue function lacks a return value', () => {
            beforeEach(() => {
                spyOn(step1, 'continue').and.returnValue(undefined);
                spyOn(step2, 'continue').and.returnValue(undefined);
                pipeline.initialise([step1, step2]);
            });

            it('should return true', () => {
                expect(pipeline.continue()).toBe(true);
            });

            it('should call continue on each step', () => {
                pipeline.continue();
                expect(step1.continue).toHaveBeenCalled();
                expect(step2.continue).toHaveBeenCalled();
            });
        });

        describe('when a step queues more steps', () => {
            beforeEach(() => {
                spyOn(step1, 'continue').and.callFake(() => {
                    pipeline.queueStep(step2);
                    return false;
                });
                spyOn(step2, 'continue').and.returnValue(false);
                pipeline.initialise([step1]);
            });

            it('should call continue on the queued step', () => {
                pipeline.continue();
                expect(step2.continue).toHaveBeenCalled();
            });

            it('should place the queued step before the executed step', () => {
                pipeline.continue();
                expect(pipeline.pipeline[0]).toBe(step2);
                expect(pipeline.pipeline[1]).toBe(step1);
            });
        });
    });
});
