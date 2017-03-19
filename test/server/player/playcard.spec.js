/* global describe, it, beforeEach, expect, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');

const PlayActionPrompt = require('../../../server/game/gamesteps/playactionprompt.js');

describe('Player', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'raiseEvent', 'getOtherPlayer', 'playerDecked', 'resolveAbility', 'queueStep']);
        this.player = new Player('1', 'Player 1', true, this.gameSpy);
        this.player.initialise();
    });

    describe('playCard', function() {
        beforeEach(function() {
            this.playActionSpy = jasmine.createSpyObj('playAction', ['meetsRequirements', 'canPayCosts', 'canResolveTargets']);
            this.cardSpy = jasmine.createSpyObj('card', ['getPlayActions']);

            this.player.hand.push(this.cardSpy);
            this.cardSpy.location = 'hand';
            this.cardSpy.controller = this.player;
        });

        describe('when card is undefined', function() {
            beforeEach(function() {
                this.player.hand.pop();
                this.canPlay = this.player.playCard(undefined);
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
                this.cardSpy.getPlayActions.and.returnValue([this.playActionSpy]);
            });

            describe('when the requirements are met and the costs can be paid', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(true);
                    this.playActionSpy.canPayCosts.and.returnValue(true);
                    this.playActionSpy.canResolveTargets.and.returnValue(true);
                });

                it('should resolve the play action', function() {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).toHaveBeenCalledWith(this.playActionSpy, { game: this.gameSpy, player: this.player, source: this.cardSpy });
                });

                it('should return true', function() {
                    expect(this.player.playCard(this.cardSpy)).toBe(true);
                });
            });

            describe('when the requirements are met but the costs cannot be paid', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(true);
                    this.playActionSpy.canPayCosts.and.returnValue(false);
                    this.playActionSpy.canResolveTargets.and.returnValue(true);
                });

                it('should not resolve the play action', function() {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function() {
                    expect(this.player.playCard(this.cardSpy)).toBe(false);
                });
            });

            describe('when the costs can be paid but the requirements are not met', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(false);
                    this.playActionSpy.canPayCosts.and.returnValue(true);
                    this.playActionSpy.canResolveTargets.and.returnValue(true);
                });

                it('should not resolve the play action', function() {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function() {
                    expect(this.player.playCard(this.cardSpy)).toBe(false);
                });
            });

            describe('when targets cannot be resolved', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(true);
                    this.playActionSpy.canPayCosts.and.returnValue(true);
                    this.playActionSpy.canResolveTargets.and.returnValue(false);
                });

                it('should not resolve the play action', function() {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function() {
                    expect(this.player.playCard(this.cardSpy)).toBe(false);
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
                this.cardSpy.getPlayActions.and.returnValue([this.playActionSpy, this.playActionSpy2]);
            });

            it('should prompt the player to choose a play action', function() {
                this.player.playCard(this.cardSpy);
                expect(this.gameSpy.queueStep).toHaveBeenCalledWith(jasmine.any(PlayActionPrompt));
            });

            it('should return true', function() {
                expect(this.player.playCard(this.cardSpy)).toBe(true);
            });
        });
    });
});
