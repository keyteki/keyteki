const Player = require('../../../server/game/player.js');

describe('Player', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'getOtherPlayer', 'playerDecked', 'resolveAbility', 'queueStep', 'raiseEvent', 'promptWithHandlerMenu']);
        this.player = new Player('1', {username: 'Player 1', settings: {}}, true, this.gameSpy);
        this.player.initialise();
    });

    xdescribe('initiateCardAction', function() {
        beforeEach(function() {
            this.playActionSpy = jasmine.createSpyObj('playAction', ['meetsRequirements', 'createContext']);
            this.cardSpy = jasmine.createSpyObj('card', ['getActions']);
            this.context = { game: this.gameSpy, player: this.player, ability: this.playActionSpy, source: this.cardSpy };
            this.playActionSpy.createContext.and.returnValue(this.context);

            this.player.hand.push(this.cardSpy);
            this.cardSpy.location = 'hand';
            this.cardSpy.name = 'Card';
            this.cardSpy.controller = this.player;
        });

        describe('when card is undefined', function() {
            beforeEach(function() {
                this.player.hand.pop();
                this.canPlay = this.player.initiateCardAction(undefined);
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
                    this.playActionSpy.meetsRequirements.and.returnValue('');
                });

                it('should resolve the play action', function() {
                    this.player.initiateCardAction(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).toHaveBeenCalledWith(this.context);
                });

                it('should return true', function() {
                    expect(this.player.initiateCardAction(this.cardSpy)).toBe(true);
                });
            });

            xdescribe('when the requirements are met but the costs cannot be paid', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(true);
                    this.playActionSpy.canPayCosts.and.returnValue(false);
                    this.playActionSpy.canResolveTargets.and.returnValue(false);
                });

                it('should not resolve the play action', function() {
                    this.player.initiateCardAction(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function() {
                    expect(this.player.initiateCardAction(this.cardSpy)).toBe(false);
                });
            });

            xdescribe('when the costs can be paid but the requirements are not met', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(false);
                    this.playActionSpy.canPayCosts.and.returnValue(true);
                    this.playActionSpy.canResolveTargets.and.returnValue(true);
                });

                it('should not resolve the play action', function() {
                    this.player.initiateCardAction(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function() {
                    expect(this.player.initiateCardAction(this.cardSpy)).toBe(false);
                });
            });

            xdescribe('when targets cannot be resolved', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(true);
                    this.playActionSpy.canPayCosts.and.returnValue(true);
                    this.playActionSpy.canResolveTargets.and.returnValue(false);
                });

                it('should not resolve the play action', function() {
                    this.player.initiateCardAction(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function() {
                    expect(this.player.initiateCardAction(this.cardSpy)).toBe(false);
                });
            });
        });

        describe('when card has multiple matching play actions', function() {
            beforeEach(function() {
                this.playActionSpy.meetsRequirements.and.returnValue('');
                this.playActionSpy2 = jasmine.createSpyObj('playAction', ['meetsRequirements', 'canPayCosts', 'canResolveTargets']);
                this.playActionSpy2.meetsRequirements.and.returnValue('');
                this.cardSpy.getActions.and.returnValue([this.playActionSpy, this.playActionSpy2]);
            });

            it('should prompt the player to choose a play action', function() {
                this.player.initiateCardAction(this.cardSpy);
                expect(this.gameSpy.promptWithHandlerMenu).toHaveBeenCalledWith(this.player, jasmine.objectContaining({ activePromptTitle: 'Play Card:' }));
            });

            it('should return true', function() {
                expect(this.player.initiateCardAction(this.cardSpy)).toBe(true);
            });
        });
    });
});
