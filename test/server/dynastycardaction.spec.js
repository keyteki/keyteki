const DynastyCardAction = require('../../server/game/dynastycardaction.js');

describe('DynastyCardAction', function () {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'on', 'removeListener', 'getEvent', 'openEventWindow']);
        this.playerSpy = jasmine.createSpyObj('player', ['isCardInPlayableLocation', 'replaceDynastyCard', 'getMinimumCost']);
        this.cardSpy = jasmine.createSpyObj('card', ['getType', 'canPlay', 'isLimited', 'anotherUniqueInPlay']);
        this.windowSpy = jasmine.createSpyObj('window', ['markActionAsTaken']);
        this.cardSpy.isDynasty = true;
        this.cardSpy.controller = this.playerSpy;
        this.cardSpy.owner = this.playerSpy;
        this.cardSpy.facedown = false;
        this.cardSpy.location = 'province 1';
        this.gameSpy.currentActionWindow = this.windowSpy;
        this.windowSpy.currentPlayer = this.playerSpy;
        this.gameSpy.abilityCardStack = ['framework'];
        this.playerSpy.fate = 10;
        this.context = {
            costs: {},
            game: this.gameSpy,
            player: this.playerSpy,
            source: this.cardSpy
        };
        this.context.copy = () => this.context;
        this.action = new DynastyCardAction(this.cardSpy);
    });

    describe('meetsRequirements()', function() {
        beforeEach(function() {
            this.gameSpy.currentPhase = 'dynasty';
            this.playerSpy.isCardInPlayableLocation.and.returnValue(true);
            this.playerSpy.getMinimumCost.and.returnValue(0);
            this.cardSpy.getType.and.returnValue('character');
            this.cardSpy.canPlay.and.returnValue(true);
            this.cardSpy.isLimited.and.returnValue(false);
            this.cardSpy.anotherUniqueInPlay.and.returnValue(false);
        });

        describe('when all conditions are met', function() {
            it('should return \'\'', function() {
                expect(this.action.meetsRequirements(this.context)).toBe('');
            });
        });

        describe('when the phase not dynasty', function() {
            beforeEach(function() {
                this.gameSpy.currentPhase = 'conflict';
            });

            it('should return \'phase\'', function() {
                expect(this.action.meetsRequirements(this.context)).toBe('phase');
            });
        });

        describe('when the card is not in a valid dynasty location', function() {
            beforeEach(function() {
                this.playerSpy.isCardInPlayableLocation.and.returnValue(false);
            });

            it('should return \'location\'', function() {
                expect(this.action.meetsRequirements(this.context)).toBe('location');
            });
        });

        xdescribe('when the card is an event', function() {
            beforeEach(function() {
                this.cardSpy.getType.and.returnValue('event');
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        xdescribe('when the card is forbidden from being played in dynasty', function() {
            beforeEach(function() {
                this.cardSpy.isDynasty = false;
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when there is another unique copy of that card in play', function() {
            beforeEach(function() {
                this.cardSpy.anotherUniqueInPlay.and.returnValue(true);
            });

            it('should return \'unique\'', function() {
                expect(this.action.meetsRequirements(this.context)).toBe('unique');
            });
        });

        describe('when the card cannot be put into play', function() {
            beforeEach(function() {
                this.cardSpy.canPlay.and.returnValue(false);
            });

            it('should return \'cannotTrigger\'', function() {
                expect(this.action.meetsRequirements(this.context)).toBe('cannotTrigger');
            });
        });
    });

    describe('executeHandler()', function() {
        beforeEach(function() {
            this.action.executeHandler(this.context);
        });

        it('should put the card into play', function() {
            expect(this.gameSpy.openEventWindow).toHaveBeenCalled();
        });
    });
});
