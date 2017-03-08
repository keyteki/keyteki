/* global describe, it, beforeEach, expect, spyOn, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');

describe('Player', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['queueStep', 'raiseEvent', 'playerDecked']);
        this.player = new Player('1', 'Player 1', true, this.gameSpy);
        this.player.initialise();

        spyOn(this.player, 'getDuplicateInPlay');

        this.cardSpy = jasmine.createSpyObj('card', ['getType', 'getCost', 'isBestow', 'play', 'moveTo']);
        this.dupeCardSpy = jasmine.createSpyObj('dupecard', ['addDuplicate']);
        this.player.hand.push(this.cardSpy);
        this.cardSpy.location = 'hand';
    });

    describe('putIntoPlay', function() {
        describe('when the playing type is marshal', function() {
            describe('and the card is not a duplicate', function() {
                beforeEach(function() {
                    this.player.getDuplicateInPlay.and.returnValue(null);
                    this.player.putIntoPlay(this.cardSpy, 'marshal');
                });

                it('should add the card to cards in play', function() {
                    expect(this.player.cardsInPlay).toContain(this.cardSpy);
                });

                it('should be placed face up', function() {
                    expect(this.cardSpy.facedown).toBe(false);
                });

                it('should be marked as new', function() {
                    expect(this.cardSpy.new).toBe(true);
                });

                it('should play the card as non-ambush', function() {
                    expect(this.cardSpy.play).toHaveBeenCalledWith(this.player, false);
                });

                it('should raise the onCardEntersPlay event', function() {
                    expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardEntersPlay', this.cardSpy);
                });

                describe('when it has the Bestow keyword', function() {
                    beforeEach(function() {
                        this.cardSpy.isBestow.and.returnValue(true);
                        this.player.putIntoPlay(this.cardSpy, 'marshal');
                    });

                    it('should queue the bestow prompt', function() {
                        expect(this.gameSpy.queueStep).toHaveBeenCalled();
                        expect(this.gameSpy.queueStep.calls.mostRecent().args[0].constructor.name).toBe('BestowPrompt');
                    });
                });
            });

            describe('and the card is a duplicate', function() {
                beforeEach(function() {
                    this.player.getDuplicateInPlay.and.returnValue(this.dupeCardSpy);
                    this.player.putIntoPlay(this.cardSpy, 'marshal');
                });

                it('should not add the card to cards in play', function() {
                    expect(this.player.cardsInPlay).not.toContain(this.cardSpy);
                });

                it('should not play the card as an ambush', function() {
                    expect(this.cardSpy.play).not.toHaveBeenCalled();
                });

                it('should not raise the onCardEntersPlay event', function() {
                    expect(this.gameSpy.raiseEvent).not.toHaveBeenCalledWith('onCardEntersPlay', this.cardSpy);
                });

                it('should add as a duplicate', function() {
                    expect(this.dupeCardSpy.addDuplicate).toHaveBeenCalledWith(this.cardSpy);
                });

                describe('when it has the Bestow keyword', function() {
                    beforeEach(function() {
                        this.cardSpy.isBestow.and.returnValue(true);
                        this.player.putIntoPlay(this.cardSpy, 'marshal');
                    });

                    it('should not queue the bestow prompt', function() {
                        expect(this.gameSpy.queueStep).not.toHaveBeenCalled();
                    });
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
                    this.player.getDuplicateInPlay.and.returnValue(null);
                    this.player.putIntoPlay(this.cardSpy, 'marshal');
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
                    this.player.getDuplicateInPlay.and.returnValue(this.dupeCardSpy);
                    this.player.putIntoPlay(this.cardSpy, 'marshal');
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

        describe('when the playing type is setup', function() {
            describe('and the card is not a duplicate', function() {
                beforeEach(function() {
                    this.player.getDuplicateInPlay.and.returnValue(null);
                    this.gameSpy.currentPhase = 'setup';
                    this.player.putIntoPlay(this.cardSpy, 'setup');
                });

                it('should add the card to cards in play', function() {
                    expect(this.player.cardsInPlay).toContain(this.cardSpy);
                });

                it('should be placed face down', function() {
                    expect(this.cardSpy.facedown).toBe(true);
                });

                it('should be marked as new', function() {
                    expect(this.cardSpy.new).toBe(true);
                });

                it('should play the card as non-ambush', function() {
                    expect(this.cardSpy.play).toHaveBeenCalledWith(this.player, false);
                });

                it('should raise the onCardEntersPlay event', function() {
                    expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardEntersPlay', this.cardSpy);
                });

                describe('when it has the Bestow keyword', function() {
                    beforeEach(function() {
                        this.cardSpy.isBestow.and.returnValue(true);
                        this.player.putIntoPlay(this.cardSpy, 'setup');
                    });

                    it('should not queue the bestow prompt', function() {
                        expect(this.gameSpy.queueStep).not.toHaveBeenCalled();
                    });
                });
            });

            describe('and the card is a duplicate', function() {
                beforeEach(function() {
                    this.player.getDuplicateInPlay.and.returnValue(this.dupeCardSpy);
                    this.gameSpy.currentPhase = 'setup';
                    this.player.putIntoPlay(this.cardSpy, 'setup');
                });

                it('should add the card to cards in play', function() {
                    expect(this.player.cardsInPlay).toContain(this.cardSpy);
                });

                it('should be placed face down', function() {
                    expect(this.cardSpy.facedown).toBe(true);
                });

                it('should be marked as new', function() {
                    expect(this.cardSpy.new).toBe(true);
                });

                it('should not play the card', function() {
                    expect(this.cardSpy.play).not.toHaveBeenCalled();
                });

                it('should raise the onCardEntersPlay event', function() {
                    expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardEntersPlay', this.cardSpy);
                });

                it('should not add as a duplicate', function() {
                    expect(this.dupeCardSpy.addDuplicate).not.toHaveBeenCalledWith(this.cardSpy);
                });
            });
        });

        describe('when the playing type is ambush', function() {
            describe('and the card is not a duplicate', function() {
                beforeEach(function() {
                    this.player.getDuplicateInPlay.and.returnValue(null);
                    this.player.putIntoPlay(this.cardSpy, 'ambush');
                });

                it('should add the card to cards in play', function() {
                    expect(this.player.cardsInPlay).toContain(this.cardSpy);
                });

                it('should be placed face up', function() {
                    expect(this.cardSpy.facedown).toBe(false);
                });

                it('should be marked as new', function() {
                    expect(this.cardSpy.new).toBe(true);
                });

                it('should play the card as an ambush', function() {
                    expect(this.cardSpy.play).toHaveBeenCalledWith(this.player, true);
                });

                it('should raise the onCardEntersPlay event', function() {
                    expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardEntersPlay', this.cardSpy);
                });
            });

            describe('and the card is a duplicate', function() {
                beforeEach(function() {
                    this.player.getDuplicateInPlay.and.returnValue(this.dupeCardSpy);
                    this.player.putIntoPlay(this.cardSpy, 'ambush');
                });

                it('should not add the card to cards in play', function() {
                    expect(this.player.cardsInPlay).not.toContain(this.cardSpy);
                });

                it('should not play the card as an ambush', function() {
                    expect(this.cardSpy.play).not.toHaveBeenCalled();
                });

                it('should not raise the onCardEntersPlay event', function() {
                    expect(this.gameSpy.raiseEvent).not.toHaveBeenCalledWith('onCardEntersPlay', this.cardSpy);
                });

                it('should add as a duplicate', function() {
                    expect(this.dupeCardSpy.addDuplicate).toHaveBeenCalledWith(this.cardSpy);
                });
            });
        });
    });
});
