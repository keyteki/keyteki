const _ = require('underscore');

const SetupCardAction = require('../../server/game/setupcardaction');

describe('SetupCardAction', function () {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener']);
        this.playerSpy = jasmine.createSpyObj('player', ['putIntoPlay']);
        this.cardSpy = jasmine.createSpyObj('card', ['getType']);
        this.context = {
            game: this.gameSpy,
            player: this.playerSpy,
            source: this.cardSpy
        };
        this.action = new SetupCardAction();
    });

    describe('meetsRequirements()', function() {
        beforeEach(function() {
            this.gameSpy.currentPhase = 'setup';
            this.playerSpy.hand = _([this.cardSpy]);
            this.cardSpy.getType.and.returnValue('character');
        });

        describe('when all conditions are met', function() {
            it('should return true', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(true);
            });
        });

        describe('when the phase is not setup', function() {
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
    });

    describe('executeHandler()', function() {
        it('should put the card in play for the player', function() {
            this.action.executeHandler(this.context);
            expect(this.playerSpy.putIntoPlay).toHaveBeenCalledWith(this.cardSpy);
        });
    });
});
