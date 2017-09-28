const _ = require('underscore');
const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('Player', function() {
    describe('moveCard', function() {
        beforeEach(function() {
            this.gameSpy = jasmine.createSpyObj('game', ['raiseEvent', 'getOtherPlayer', 'playerDecked']);
            this.player = new Player('1', {username: 'Player 1', settings: {}}, true, this.gameSpy);
            this.player.initialise();
            this.player.phase = 'dynasty';

            this.gameSpy.raiseEvent.and.callFake((name, params, handler) => {
                if(handler) {
                    handler(params);
                }
            });
            this.card = new DrawCard(this.player, { code: '1', name: 'Test' });
            this.card.isConflict = true;
            spyOn(this.card, 'leavesPlay');
        });

        describe('when the card is not in a pile', function() {
            beforeEach(function() {
                this.card.location = '';
            });

            it('should add the card to the player hand', function() {
                this.player.moveCard(this.card, 'hand');
                expect(this.player.hand).toContain(this.card);
                expect(this.card.location).toBe('hand');
            });

            it('should add the card to the player conflict discard pile', function() {
                this.player.moveCard(this.card, 'conflict discard pile');
                expect(this.player.conflictDiscardPile).toContain(this.card);
                expect(this.card.location).toBe('conflict discard pile');
            });

            it('should add the card to the player dynasty discard pile', function() {
                this.player.moveCard(this.card, 'dynasty discard pile');
                expect(this.player.dynastyDiscardPile).toContain(this.card);
                expect(this.card.location).toBe('dynasty discard pile');
            });

            it('should add the card to the player play area', function() {
                this.player.moveCard(this.card, 'play area');
                expect(this.player.cardsInPlay).toContain(this.card);
                expect(this.card.location).toBe('play area');
            });
        });

        describe('when the card is in a non-play-area pile', function() {
            beforeEach(function() {
                this.player.conflictDiscardPile.push(this.card);
                this.card.location = 'conflict discard pile';

                this.player.moveCard(this.card, 'hand');
            });

            it('should move it to the target pile', function() {
                expect(this.player.hand).toContain(this.card);
            });

            it('should remove it from the original pile', function() {
                expect(this.player.conflictDiscardPile).not.toContain(this.card);
            });

            it('should not make the card leave play', function() {
                expect(this.card.leavesPlay).not.toHaveBeenCalled();
            });
        });

        describe('when the card is in the play area', function() {
            beforeEach(function() {
                this.player.cardsInPlay.push(this.card);
                this.card.location = 'play area';
            });

            it('should make the card leave play', function() {
                this.player.moveCard(this.card, 'conflict discard pile');
                expect(this.card.leavesPlay).toHaveBeenCalled();
            });

            it('should raise the left play event', function() {
                this.player.moveCard(this.card, 'conflict discard pile');
                expect(this.gameSpy.raiseEvent).toHaveBeenCalled();
            });

            describe('when the card has attachments', function() {
                beforeEach(function() {
                    this.attachment = new DrawCard(this.player, {});
                    this.attachment.parent = this.card;
                    this.attachment.location = 'play area';
                    this.card.attachments.push(this.attachment);
                    spyOn(this.player, 'removeAttachment');

                    this.player.moveCard(this.card, 'hand');
                });

                it('should remove the attachments', function() {
                    expect(this.player.removeAttachment).toHaveBeenCalledWith(this.attachment, false);
                });
            });

            describe('when the card is an attachment', function() {
                beforeEach(function() {
                    this.attachment = new DrawCard(this.player, {});
                    this.attachment.isConflict = true;
                    this.attachment.parent = this.card;
                    this.attachment.location = 'play area';
                    this.card.attachments.push(this.attachment);
                    spyOn(this.player, 'removeAttachment');

                    this.player.moveCard(this.attachment, 'hand');
                });

                it('should place the attachment in the target pile', function() {
                    expect(this.player.hand).toContain(this.attachment);
                    expect(this.attachment.location).toBe('hand');
                });

                it('should remove the attachment from the card', function() {
                    expect(this.card.attachments).not.toContain(this.attachment);
                });
            });

        });

        describe('when the target location is the conflict deck', function() {
            beforeEach(function() {
                this.player.conflictDeck = _([{}, {}, {}]);
            });

            it('should add the card to the top of the deck', function() {
                this.player.moveCard(this.card, 'conflict deck');
                expect(this.player.conflictDeck.first()).toBe(this.card);
            });

            it('should add the card to the bottom of the deck when the option is passed', function() {
                this.player.moveCard(this.card, 'conflict deck', { bottom: true });
                expect(this.player.conflictDeck.last()).toBe(this.card);
            });

            it('should be able to move a card from top to bottom of the deck', function() {
                this.player.conflictDeck = _([this.card, {}, {}, {}]);
                this.card.location = 'conflict deck';
                this.player.moveCard(this.card, 'conflict deck', { bottom: true });
                expect(this.player.conflictDeck.size()).toBe(4);
                expect(this.player.conflictDeck.last()).toBe(this.card);
            });
        });

        describe('when the card location property and actual location do not match', function() {
            // Game.takeControl used to push the card directly onto cardsInPlay
            // but did not update the location for the card. This caused weird
            // problems where the strength of the card would be doubled for both
            // challenges and dominance.
            beforeEach(function() {
                // Put into play with the wrong location.
                this.card.location = 'conflict discard pile';
                this.player.cardsInPlay = _([this.card]);

                this.player.moveCard(this.card, 'play area');
            });

            it('should not duplicate the card', function() {
                expect(this.player.cardsInPlay.size()).toBe(1);
                expect(this.player.cardsInPlay.toArray()).toEqual([this.card]);
            });
        });

    });
});
