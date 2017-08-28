const GamePipeline = require('../../../server/game/gamepipeline.js');

describe('the GamePipeline', function() {
    beforeEach(function() {
        this.pipeline = new GamePipeline();
    });

    describe('the cancelStep() function', function() {
        describe('when the next step is normal', function() {
            beforeEach(function() {
                this.step = {};
                this.pipeline.initialise([this.step]);
            });

            it('should remove the step', function() {
                this.pipeline.cancelStep();
                expect(this.pipeline.length).toBe(0);
            });
        });

        describe('when the next step is cancellable', function() {
            beforeEach(function() {
                this.step = {
                    cancelStep: function() {},
                    isComplete: function() {}
                };
                spyOn(this.step, 'cancelStep');
                spyOn(this.step, 'isComplete');
                this.pipeline.initialise([this.step]);
            });

            it('should call cancelStep on the step', function() {
                this.pipeline.cancelStep();
                expect(this.step.cancelStep).toHaveBeenCalled();
            });

            it('should keep the step if it is not complete', function() {
                this.step.isComplete.and.returnValue(false);
                this.pipeline.cancelStep();
                expect(this.pipeline.length).toBe(1);
            });

            it('should remove the step if it is complete', function() {
                this.step.isComplete.and.returnValue(true);
                this.pipeline.cancelStep();
                expect(this.pipeline.length).toBe(0);
            });
        });
    });
});
