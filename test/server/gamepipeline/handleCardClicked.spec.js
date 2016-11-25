/*global describe, it, beforeEach, expect, spyOn*/

const BaseStep = require('../../../server/game/gamesteps/basestep.js');
const GamePipeline = require('../../../server/game/gamepipeline.js');

describe('the GamePipeline', function() {
    var pipeline;
    var step = new BaseStep(null);
    var player = {};
    var card = {};

    beforeEach(function() {
        pipeline = new GamePipeline();
    });

    describe('the handleCardClicked() function', function() {
        describe('when the pipeline is empty', function() {
            beforeEach(() => {
                pipeline.initialise([]);
            });

            it('should return false', function() {
                expect(pipeline.handleCardClicked(player, card)).toBe(false);
            });
        });

        describe('when the step returns false', () => {
            beforeEach(() => {
                pipeline.initialise([step]);
                spyOn(step, 'onCardClicked').and.returnValue(false);
            });

            it('should call the onCardClicked handler', () => {
                pipeline.handleCardClicked(player, card);
                expect(step.onCardClicked).toHaveBeenCalledWith(player, card);
            });

            it('should return false', function() {
                expect(pipeline.handleCardClicked(player, card)).toBe(false);
            });
        });

        describe('when the step returns true', () => {
            beforeEach(() => {
                pipeline.initialise([step]);
                spyOn(step, 'onCardClicked').and.returnValue(true);
            });

            it('should call the onCardClicked handler', () => {
                pipeline.handleCardClicked(player, card);
                expect(step.onCardClicked).toHaveBeenCalledWith(player, card);
            });

            it('should return true', function() {
                expect(pipeline.handleCardClicked(player, card)).toBe(true);
            });
        });
    });
});
