/* global describe, it, beforeEach, expect, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const DynastyCardAction = require('../../server/game/dynastycardaction.js');

describe('DynastyCardAction', function () {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'on', 'removeListener']);
        this.playerSpy = jasmine.createSpyObj('player', ['canPutIntoPlay', 'isCardInPlayableLocation', 'putIntoPlay']);
        this.cardSpy = jasmine.createSpyObj('card', ['canBeDynastyed', 'getType']);
        this.cardSpy.canBeDynastyed.and.returnValue(true);
        this.cardSpy.controller = this.playerSpy;
        this.cardSpy.owner = this.playerSpy;
        this.context = {
            costs: {},
            game: this.gameSpy,
            player: this.playerSpy,
            source: this.cardSpy
        };
        this.action = new DynastyCardAction();
    });

    describe('meetsRequirements()', function() {
        beforeEach(function() {
            this.gameSpy.currentPhase = 'dynasty';
            this.playerSpy.canPutIntoPlay.and.returnValue(true);
            this.playerSpy.isCardInPlayableLocation.and.returnValue(true);
            this.cardSpy.getType.and.returnValue('character');
        });

        describe('when all conditions are met', function() {
            it('should return true', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(true);
            });
        });

        describe('when the phase not dynasty', function() {
            beforeEach(function() {
                this.gameSpy.currentPhase = 'conflict';
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is not in a valid dynasty location', function() {
            beforeEach(function() {
                this.playerSpy.isCardInPlayableLocation.and.returnValue(false);
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

        describe('when the card is forbidden from being played in dynasty', function() {
            beforeEach(function() {
                this.cardSpy.canBeDynastyed.and.returnValue(false);
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
            expect(this.playerSpy.putIntoPlay).toHaveBeenCalledWith(this.cardSpy, 'dynasty');
        });
    });
});
