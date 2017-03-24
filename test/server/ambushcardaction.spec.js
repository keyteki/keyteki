/* global describe, it, beforeEach, expect, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const AmbushCardAction = require('../../server/game/ambushcardaction.js');

describe('AmbushCardAction', function () {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'on', 'removeListener']);
        this.playerSpy = jasmine.createSpyObj('player', ['canPutIntoPlay', 'putIntoPlay']);
        this.cardSpy = jasmine.createSpyObj('card', ['getType', 'isAmbush']);
        this.context = {
            costs: {},
            game: this.gameSpy,
            player: this.playerSpy,
            source: this.cardSpy
        };
        this.action = new AmbushCardAction();
    });

    describe('meetsRequirements()', function() {
        beforeEach(function() {
            this.gameSpy.currentPhase = 'challenge';
            this.playerSpy.hand = _([this.cardSpy]);
            this.playerSpy.canPutIntoPlay.and.returnValue(true);
            this.cardSpy.getType.and.returnValue('character');
            this.cardSpy.isAmbush.and.returnValue(true);
        });

        describe('when all conditions are met', function() {
            it('should return true', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(true);
            });
        });

        describe('when the phase is not challenge', function() {
            beforeEach(function() {
                this.gameSpy.currentPhase = 'marshal';
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

        describe('when the card is an event', function() {
            beforeEach(function() {
                this.cardSpy.getType.and.returnValue('event');
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is not an ambushable card', function() {
            beforeEach(function() {
                this.cardSpy.isAmbush.and.returnValue(false);
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card cannot be put into play', function() {
            beforeEach(function() {
                this.playerSpy.canPutIntoPlay.and.returnValue(false);
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

        it('should put the card into play', function() {
            expect(this.playerSpy.putIntoPlay).toHaveBeenCalledWith(this.cardSpy, 'ambush');
        });
    });
});
