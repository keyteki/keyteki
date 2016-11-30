/*global describe, it, beforeEach, expect, spyOn */
/* eslint no-invalid-this: 0 */

const GamePipeline = require('../../../server/game/gamepipeline.js');

describe('the GamePipeline', function() {
    beforeEach(function() {
        this.step = {};
        this.pipeline = new GamePipeline();
    });

    describe('the queueStep() function', function() {
        describe('when the pipeline is empty', function() {

            it('should add the step directly to the pipeline', function() {
                this.pipeline.queueStep(this.step);
                expect(this.pipeline.length).toBe(1);
                expect(this.pipeline.pipeline[0]).toBe(this.step);
            });

            it('should leave the queue empty', function() {
                this.pipeline.queueStep(this.step);
                expect(this.pipeline.queue.length).toBe(0);
            });
        });

        describe('when the pipeline is not empty', function() {
            describe('when the next step is normal', function() {
                beforeEach(function() {
                    this.existingStep = {};
                    this.pipeline.initialise([this.existingStep]);
                });

                it('should not modify the pipeline', function() {
                    this.pipeline.queueStep(this.step);
                    expect(this.pipeline.length).toBe(1);
                });

                it('should add it to the queue', function() {
                    this.pipeline.queueStep(this.step);
                    expect(this.pipeline.queue.length).toBe(1);
                    expect(this.pipeline.queue[0]).toBe(this.step);
                });
            });

            describe('when the next step is queueable', function() {
                beforeEach(function() {
                    this.existingStep = {
                        queueStep: function() {}
                    };
                    spyOn(this.existingStep, 'queueStep');
                    this.pipeline.initialise([this.existingStep]);
                });

                it('should call queueStep on the existing step', function() {
                    this.pipeline.queueStep(this.step);
                    expect(this.existingStep.queueStep).toHaveBeenCalledWith(this.step);
                });

                it('should not modify the pipeline', function() {
                    this.pipeline.queueStep(this.step);
                    expect(this.pipeline.length).toBe(1);
                });

                it('should leave the queue empty', function() {
                    this.pipeline.queueStep(this.step);
                    expect(this.pipeline.queue.length).toBe(0);
                });
            });
        });
    });
});
