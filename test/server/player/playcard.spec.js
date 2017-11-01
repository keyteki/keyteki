const Player = require('../../../server/game/player.js');

const PlayActionPrompt = require('../../../server/game/gamesteps/playactionprompt.js');

describe('Player', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'getOtherPlayer', 'playerDecked', 'resolveAbility', 'queueStep', 'raiseEvent']);
        this.player = new Player('1', {username: 'Player 1', settings: {}}, true, this.gameSpy);
        this.player.initialise();
    });

    describe('findAndUseAction', function() {
        beforeEach(function() {
            this.playActionSpy = jasmine.createSpyObj('playAction', ['meetsRequirements', 'canPayCosts', 'canResolveTargets']);
            this.cardSpy = jasmine.createSpyObj('card', ['getActions']);

            this.player.hand.push(this.cardSpy);
            this.cardSpy.location = 'hand';
            this.cardSpy.controller = this.player;
        });

        describe('when card is undefined', function() {
            beforeEach(function() {
                this.player.hand.pop();
                this.canPlay = this.player.findAndUseAction(undefined);
            });

            it('should return false', function() {
                expect(this.canPlay, false).toBe(false);
            });

            it('should not put the card in play', function() {
                expect(this.player.cardsInPlay).not.toContain(this.cardSpy);
            });
        });

        describe('when card has play actions', function() {
            beforeEach(function() {
                this.cardSpy.getActions.and.returnValue([this.playActionSpy]);
            });

            describe('when the requirements are met and the costs can be paid', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(true);
                    this.playActionSpy.canPayCosts.and.returnValue(true);
                    this.playActionSpy.canResolveTargets.and.returnValue(true);
                });

                it('should resolve the play action', function() {
                    this.player.findAndUseAction(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).toHaveBeenCalledWith(jasmine.objectContaining({ game: this.gameSpy, player: this.player, source: this.cardSpy, ability: this.playActionSpy }));
                });

                it('should return true', function() {
                    expect(this.player.findAndUseAction(this.cardSpy)).toBe(true);
                });
            });

            xdescribe('when the requirements are met but the costs cannot be paid', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(true);
                    this.playActionSpy.canPayCosts.and.returnValue(false);
                    this.playActionSpy.canResolveTargets.and.returnValue(false);
                });

                it('should not resolve the play action', function() {
                    this.player.findAndUseAction(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function() {
                    expect(this.player.findAndUseAction(this.cardSpy)).toBe(false);
                });
            });

            xdescribe('when the costs can be paid but the requirements are not met', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(false);
                    this.playActionSpy.canPayCosts.and.returnValue(true);
                    this.playActionSpy.canResolveTargets.and.returnValue(true);
                });

                it('should not resolve the play action', function() {
                    this.player.findAndUseAction(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function() {
                    expect(this.player.findAndUseAction(this.cardSpy)).toBe(false);
                });
            });

            xdescribe('when targets cannot be resolved', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(true);
                    this.playActionSpy.canPayCosts.and.returnValue(true);
                    this.playActionSpy.canResolveTargets.and.returnValue(false);
                });

                it('should not resolve the play action', function() {
                    this.player.findAndUseAction(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function() {
                    expect(this.player.findAndUseAction(this.cardSpy)).toBe(false);
                });
            });
        });

        describe('when card has multiple matching play actions', function() {
            beforeEach(function() {
                this.playActionSpy.meetsRequirements.and.returnValue(true);
                this.playActionSpy.canPayCosts.and.returnValue(true);
                this.playActionSpy.canResolveTargets.and.returnValue(true);
                this.playActionSpy2 = jasmine.createSpyObj('playAction', ['meetsRequirements', 'canPayCosts', 'canResolveTargets']);
                this.playActionSpy2.meetsRequirements.and.returnValue(true);
                this.playActionSpy2.canPayCosts.and.returnValue(true);
                this.playActionSpy2.canResolveTargets.and.returnValue(true);
                this.cardSpy.getActions.and.returnValue([this.playActionSpy, this.playActionSpy2]);
            });

            it('should prompt the player to choose a play action', function() {
                this.player.findAndUseAction(this.cardSpy);
                expect(this.gameSpy.queueStep).toHaveBeenCalledWith(jasmine.any(PlayActionPrompt));
            });

            it('should return true', function() {
                expect(this.player.findAndUseAction(this.cardSpy)).toBe(true);
            });
        });
    });
});
