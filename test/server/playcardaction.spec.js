const PlayCardAction = require('../../server/game/playcardaction.js');

describe('PlayCardAction', function () {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'on', 'raiseEvent', 'raiseEvent', 'removeListener']);
        this.playerSpy = jasmine.createSpyObj('player', ['isCardInPlayableLocation', 'moveCard']);
        this.cardSpy = jasmine.createSpyObj('card', ['canBePlayed', 'canPlay', 'getType', 'play']);
        this.cardSpy.canBePlayed.and.returnValue(true);
        this.context = {
            costs: {},
            game: this.gameSpy,
            player: this.playerSpy,
            source: this.cardSpy
        };

        this.gameSpy.raiseEvent.and.callFake((name, params, handler) => {
            if(handler) {
                handler(params);
            }
        });

        this.action = new PlayCardAction();
    });

    describe('meetsRequirements()', function() {
        beforeEach(function() {
            this.gameSpy.currentPhase = 'marshal';
            this.playerSpy.isCardInPlayableLocation.and.returnValue(true);
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

        describe('when the card is not in a playable location', function() {
            beforeEach(function() {
                this.playerSpy.isCardInPlayableLocation.and.returnValue(false);
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
                this.cardSpy.canBePlayed.and.returnValue(false);
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
    });
});
