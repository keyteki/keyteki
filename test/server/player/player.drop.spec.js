/*global describe, it, beforeEach, expect*/
/* eslint camelcase: 0 */

const Player = require('../../../server/game/player.js');

describe('the Player', () => {
    var player = new Player('1', 'Player 1', true);
    var attachment = { card: { uuid: '1111', code: '1', label: 'Attachment', type_code: 'attachment' } };
    var cardWithNoAttachments = { attachments: [], dupes: [], card: { uuid: '2222', code: '2', label: 'Character', type_code: 'character', is_unique: true } };
    var cardWithAttachment = { attachments: [attachment.card], card: { uuid: '3333', code: '3', label: 'Character', type_code: 'character' } };
    var characterInHand = { uuid: '4444', code: '4', label: 'Hand', type_code: 'character' };
    var locationInHand = { uuid: '5555', code: '5', label: 'Hand Location', type_code: 'location' };
    var attachmentInHand = { uuid: '7777', code: '7', label: 'Hand Attachment', type_code: 'attachment' };
    var eventInHand = { uuid: '8888', code: '8', label: 'Hand Event', type_code: 'event' };
    var cardNotInHand = { uuid: '6666', code: '6', label: 'NotInHand', type_code: 'character' };
    var dupe = { uuid: '2222dupe', code: '2', label: 'Hand', type_code: 'character', is_unique: true };

    beforeEach(() => {
        player.initialise();

        // player.cardsInPlay.push(cardWithAttachment);
    });

    describe('the drop() function', function() {
        var dropSucceeded = false;

        describe('when dragging a card from hand to play area', function() {

            describe('if the card is not in the hand', function() {
                beforeEach(function() {
                    dropSucceeded = player.drop(cardNotInHand, 'hand', 'play area');
                });

                it('should return false and not change the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.cardsInPlay.length).toBe(0);
                    expect(player.hand.length).toBe(0);
                });
            });

            describe('if the card is in hand and a character', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(characterInHand, 'hand', 'play area');
                });

                it('should return true and add the card to the play area', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.cardsInPlay.length).toBe(1);
                    expect(player.hand.length).toBe(0);
                });
            });

            describe('if the card is a character and a dupe is in play', function() {
                beforeEach(function() {
                    player.hand.push(dupe);
                    player.cardsInPlay.push(cardWithNoAttachments);

                    cardWithNoAttachments.dupes = [];

                    dropSucceeded = player.drop(dupe, 'hand', 'play area');
                });

                it('should return true and add a dupe to the play area', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.cardsInPlay.length).toBe(1);
                    expect(cardWithNoAttachments.dupes.length).toBe(1);
                });
            });

            describe('if the card is in hand and a location', function() {
                beforeEach(function() {
                    player.hand.push(locationInHand);
                    dropSucceeded = player.drop(locationInHand, 'hand', 'play area');
                });

                it('should return true and add the card to the play area', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.cardsInPlay.length).toBe(1);
                    expect(player.hand.length).toBe(0);
                });
            });

            describe('if the card is in hand and an event', function() {
                beforeEach(function() {
                    player.hand.push(eventInHand);
                    dropSucceeded = player.drop(eventInHand, 'hand', 'play area');
                });

                it('should return false and not add the card to the play area', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.cardsInPlay.length).toBe(0);
                    expect(player.hand.length).toBe(1);
                });
            });

            describe('if the card is in hand and an attachment', function() {
                beforeEach(function() {
                    player.hand.push(attachmentInHand);
                    dropSucceeded = player.drop(attachmentInHand, 'hand', 'play area');
                });

                it('should return true and setup the card for attaching', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.menuTitle).toBe('Select target for attachment');
                    expect(player.selectCard).toBe(true);
                    expect(player.selectedAttachment).toBe(attachmentInHand);
                    expect(player.cardsInPlay.length).toBe(0);
                    expect(player.hand.length).toBe(1);
                });
            });
        });

        describe('when dragging a card from hand to the dead pile', function() {
            describe('if the card is not in hand', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(cardNotInHand, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.hand.length).toBe(1);
                    expect(player.deadPile.length).toBe(0);
                });
            });

            describe('if the card is in hand and is a location', function() {
                beforeEach(function() {

                    player.hand.push(locationInHand);
                    dropSucceeded = player.drop(locationInHand, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.hand.length).toBe(1);
                    expect(player.deadPile.length).toBe(0);
                });
            });

            describe('if the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    player.hand.push(attachmentInHand);
                    dropSucceeded = player.drop(attachmentInHand, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.hand.length).toBe(1);
                    expect(player.deadPile.length).toBe(0);
                });
            });

            describe('if the card is in hand and is an event', function() {
                beforeEach(function() {
                    player.hand.push(eventInHand);
                    dropSucceeded = player.drop(eventInHand, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.hand.length).toBe(1);
                    expect(player.deadPile.length).toBe(0);
                });
            });

            describe('if the card is in hand and is a character', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(characterInHand, 'hand', 'dead pile');
                });

                it('should return true and put the character in the dead pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.deadPile.length).toBe(1);
                });
            });
        });

        describe('when dragging a card from hand to the discard pile', function() {
            describe('if the card is not in hand', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(cardNotInHand, 'hand', 'discard pile');
                });

                it('should return false and not update the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.hand.length).toBe(1);
                    expect(player.discardPile.length).toBe(0);
                });
            });

            describe('if the card is in hand and is a location', function() {
                beforeEach(function() {

                    player.hand.push(locationInHand);
                    dropSucceeded = player.drop(locationInHand, 'hand', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.discardPile.length).toBe(1);
                });
            });

            describe('if the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    player.hand.push(attachmentInHand);
                    dropSucceeded = player.drop(attachmentInHand, 'hand', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.discardPile.length).toBe(1);
                });
            });

            describe('if the card is in hand and is an event', function() {
                beforeEach(function() {
                    player.hand.push(eventInHand);
                    dropSucceeded = player.drop(eventInHand, 'hand', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.discardPile.length).toBe(1);
                });
            });

            describe('if the card is in hand and is a character', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(characterInHand, 'hand', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.discardPile.length).toBe(1);
                });
            });
        });

        describe('when dragging a card from hand to the deck', function() {
            describe('if the card is not in hand', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(cardNotInHand, 'hand', 'draw deck');
                });

                it('should return false and not update the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.hand.length).toBe(1);
                    expect(player.drawDeck.length).toBe(0);
                });
            });

            describe('if the card is in hand and is a location', function() {
                beforeEach(function() {

                    player.hand.push(locationInHand);
                    dropSucceeded = player.drop(locationInHand, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.drawDeck.length).toBe(1);
                });
            });

            describe('if the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    player.hand.push(attachmentInHand);
                    dropSucceeded = player.drop(attachmentInHand, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.drawDeck.length).toBe(1);
                });
            });

            describe('if the card is in hand and is an event', function() {
                beforeEach(function() {
                    player.hand.push(eventInHand);
                    dropSucceeded = player.drop(eventInHand, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.drawDeck.length).toBe(1);
                });
            });

            describe('if the card is in hand and is a character', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(characterInHand, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.drawDeck.length).toBe(1);
                });
            });

            describe('when two cards are dragged to the draw deck', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    player.hand.push(locationInHand);

                    dropSucceeded = player.drop(characterInHand, 'hand', 'draw deck');
                    dropSucceeded = player.drop(locationInHand, 'hand', 'draw deck');
                });

                it('should put the cards in the draw deck in the correct order', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.drawDeck[0].code).toBe(locationInHand.code);
                    expect(player.drawDeck[1].code).toBe(characterInHand.code);
                });
            });
        });
    });
});
