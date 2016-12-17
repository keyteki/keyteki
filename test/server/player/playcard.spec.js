/* global describe, it, beforeEach, expect, spyOn, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');

describe('Player', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'raiseEvent']);
        this.player = new Player('1', 'Player 1', true, this.gameSpy);
        this.player.initialise();
    });

    describe('playCard', function() {
        beforeEach(function() {
            this.canPlaySpy = spyOn(this.player, 'canPlayCard');
            this.cardSpy = jasmine.createSpyObj('card', ['getType', 'getCost', 'isUnique', 'isLimited', 'play']);
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
            });

            describe('and this is the setup phase', function() {
                beforeEach(function() {
                    this.player.phase = 'setup';

                    this.canPlay = this.player.playCard(this.cardSpy);
                });

                it('should return true', function() {
                    expect(this.canPlay).toBe(true);
                });

                it('should not try to add a duplicate to the card in play', function() {
                    expect(this.dupeCardSpy.addDuplicate).not.toHaveBeenCalled();
                });

                it('should add a new card in play facedown', function() {
                    expect(this.player.cardsInPlay).toContain(this.cardSpy);
                    expect(this.cardSpy.facedown).toBe(true);
                });
            });

            describe('and this is not the setup phase', function() {
                beforeEach(function() {
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
