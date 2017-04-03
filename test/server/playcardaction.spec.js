/* global describe, it, beforeEach, expect, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const PlayCardAction = require('../../server/game/playcardaction.js');

describe('PlayCardAction', function () {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'on', 'raiseEvent', 'removeListener']);
        this.playerSpy = jasmine.createSpyObj('player', ['moveCard']);
        this.cardSpy = jasmine.createSpyObj('card', ['canPlay', 'getType', 'play']);
        this.context = {
            costs: {},
            game: this.gameSpy,
            player: this.playerSpy,
            source: this.cardSpy
        };
        this.action = new PlayCardAction();
    });

    describe('meetsRequirements()', function() {
        beforeEach(function() {
            this.gameSpy.currentPhase = 'marshal';
            this.playerSpy.hand = _([this.cardSpy]);
            this.cardSpy.getType.and.returnValue('event');
            this.cardSpy.canPlay.and.returnValue(true);
            this.cardSpy.abilities = { actions: [] };
        });

        describe('when all conditions are met', function() {
            it('should return true', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(true);
            });
        });

        describe('when the phase is setup', function() {
            beforeEach(function() {
                this.gameSpy.currentPhase = 'setup';
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is not in hand', function() {
            beforeEach(function() {
                this.playerSpy.hand = _([]);
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is not an event', function() {
            beforeEach(function() {
                this.cardSpy.getType.and.returnValue('character');
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is forbidden from being played', function() {
            beforeEach(function() {
                this.cardSpy.cannotPlay = true;
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card cannot be played', function() {
            beforeEach(function() {
                this.cardSpy.canPlay.and.returnValue(false);
            });

            it('should check can play with the right arguments', function() {
                this.action.meetsRequirements(this.context);
                expect(this.cardSpy.canPlay).toHaveBeenCalledWith(this.playerSpy, this.cardSpy);
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });
    });

    describe('executeHandler()', function() {
        beforeEach(function() {
            this.action.executeHandler(this.context);
        });

        it('should play the card', function() {
            expect(this.cardSpy.play).toHaveBeenCalledWith(this.playerSpy);
        });

        it('should place the card in discard', function() {
            expect(this.playerSpy.moveCard).toHaveBeenCalledWith(this.cardSpy, 'discard pile');
        });

        it('should raise the onCardPlayed event', function() {
            expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardPlayed', this.playerSpy, this.cardSpy);
        });
    });
});
