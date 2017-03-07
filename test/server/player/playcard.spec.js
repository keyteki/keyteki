/* global describe, it, beforeEach, expect, spyOn, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');

describe('Player', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'raiseEvent', 'getOtherPlayer', 'playerDecked', 'resolveAbility']);
        this.player = new Player('1', 'Player 1', true, this.gameSpy);
        this.player.initialise();
    });

    describe('playCard', function() {
        beforeEach(function() {
            this.playActionSpy = jasmine.createSpyObj('playAction', ['meetsRequirements', 'canPayCosts']);
            this.canPlaySpy = spyOn(this.player, 'canPlayCard');
            this.cardSpy = jasmine.createSpyObj('card', ['getType', 'getCost', 'isUnique', 'isLimited', 'play', 'isAmbush', 'moveTo', 'getAmbushCost', 'getPlayActions']);
            this.dupeCardSpy = jasmine.createSpyObj('dupecard', ['addDuplicate']);

            this.canPlaySpy.and.returnValue(true);
            this.player.hand.push(this.cardSpy);
            this.cardSpy.location = 'hand';
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
                });

                it('should resolve the play action', function() {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).toHaveBeenCalledWith(this.playActionSpy, { game: this.gameSpy, player: this.player, source: this.cardSpy });
                });
            });

            describe('when the requirements are met but the costs cannot be paid', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(true);
                    this.playActionSpy.canPayCosts.and.returnValue(false);
                });

                it('should not resolve the play action', function() {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });
            });

            describe('when the costs can be paid but the requirements are not met', function() {
                beforeEach(function() {
                    this.playActionSpy.meetsRequirements.and.returnValue(false);
                    this.playActionSpy.canPayCosts.and.returnValue(true);
                });

                it('should not resolve the play action', function() {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });
            });
        });

        describe('when card cannot be played', function() {
            beforeEach(function() {
                this.canPlaySpy.and.returnValue(false);
            });

            describe('and not forcing play', function() {
                beforeEach(function() {
                    this.canPlay = this.player.playCard(this.cardSpy, false);
                });

                it('should return false', function() {
                    expect(this.canPlay).toBe(false);
                });

                it('should not change the hand', function() {
                    expect(this.player.hand).toContain(this.cardSpy);
                });
            });

            describe('and forcing play', function() {
                beforeEach(function() {
                    this.canPlay = this.player.playCard(this.cardSpy, true);
                });

                it('should return true', function() {
                    expect(this.canPlay).toBe(true);
                });

                it('should remove the card from hand', function() {
                    expect(this.player.hand).not.toContain(this.cardSpy);
                });
            });
        });

        describe('when the card has ambush', function() {
            beforeEach(function() {
                this.cardSpy.isAmbush.and.returnValue(true);
            });

            describe('and it is the challenge phase', function() {
                beforeEach(function() {
                    this.gameSpy.currentPhase = 'challenge';
                    this.canPlay = this.player.playCard(this.cardSpy, false);
                });

                it('should play the card as an ambush', function() {
                    expect(this.cardSpy.play).toHaveBeenCalledWith(this.player, true);
                });
            });

            describe('and it is not the challenge phase', function() {
                beforeEach(function() {
                    this.gameSpy.currentPhase = 'marshal';
                    this.canPlay = this.player.playCard(this.cardSpy, false);
                });

                it('should not play the card as an ambush', function() {
                    expect(this.cardSpy.play).toHaveBeenCalledWith(this.player, false);
                });
            });
        });

        describe('when card is an attachment', function() {
            beforeEach(function() {
                spyOn(this.player, 'promptForAttachment');

                this.cardSpy.getType.and.returnValue('attachment');
            });

            describe('and there is no duplicate out', function() {
                beforeEach(function() {
                    this.canPlay = this.player.playCard(this.cardSpy);
                });

                it('should return true', function() {
                    expect(this.canPlay).toBe(true);
                });

                it('should prompt for attachment target', function() {
                    expect(this.player.promptForAttachment).toHaveBeenCalled();
                });

                it('should not remove the card from hand', function() {
                    expect(this.player.hand).toContain(this.cardSpy);
                });
            });

            describe('and there is a duplicate out', function() {
                beforeEach(function() {
                    spyOn(this.player, 'getDuplicateInPlay').and.returnValue(this.dupeCardSpy);
                    this.canPlay = this.player.playCard(this.cardSpy);
                });

                it('should return true', function() {
                    expect(this.canPlay).toBe(true);
                });

                it('should not prompt for attachment target', function() {
                    expect(this.player.promptForAttachment).not.toHaveBeenCalled();
                });

                it('should remove the card from hand', function() {
                    expect(this.player.hand).not.toContain(this.cardSpy);
                });

                it('should add a duplicate to the existing card in play', function() {
                    expect(this.dupeCardSpy.addDuplicate).toHaveBeenCalledWith(this.cardSpy);
                });

                it('should not add a new card to play', function() {
                    expect(this.player.cardsInPlay).not.toContain(this.cardSpy);
                });
            });
        });

        describe('when card is a duplicate of a card in play', function() {
            beforeEach(function() {
                spyOn(this.player, 'getDuplicateInPlay').and.returnValue(this.dupeCardSpy);
                this.canPlay = this.player.playCard(this.cardSpy);
            });

            it('should return true', function() {
                expect(this.canPlay).toBe(true);
            });

            it('should add a duplicate to the existing card in play', function() {
                expect(this.dupeCardSpy.addDuplicate).toHaveBeenCalled();
            });

            it('should not add a new card to play', function() {
                expect(this.player.cardsInPlay).not.toContain(this.cardSpy);
            });
        });

        describe('when card is limited and not forcing play', function() {
            beforeEach(function() {
                this.cardSpy.isLimited.and.returnValue(true);
                this.canPlay = this.player.playCard(this.cardSpy);
            });

            it('should set the limited played flag', function() {
                expect(this.player.limitedPlayed).toBe(1);
            });
        });

        describe('when card is limited and forcing play', function() {
            beforeEach(function() {
                this.cardSpy.isLimited.and.returnValue(true);
                this.canPlay = this.player.playCard(this.cardSpy, true);
            });

            it('should not set the limited played flag', function() {
                expect(this.player.limitedPlayed).toBe(0);
            });
        });
    });
});
