/*global describe, it, beforeEach, expect*/
/* eslint camelcase: 0 */

const Player = require('../../../server/game/player.js');

describe('the Player', () => {
    var player = new Player('1', 'Player 1', true);
    var otherPlayer = new Player('2', 'Player 2', false);
    var attachment = { card: { uuid: '1111', code: '1', label: 'Attachment', type_code: 'attachment', owner: player.id } };
    var cardWithNoAttachments = { attachments: [], dupes: [], card: { uuid: '2222', code: '2', label: 'Character', type_code: 'character', is_unique: true } };
    var cardWithAttachment = { attachments: [attachment.card], card: { uuid: '3333', code: '3', label: 'Character', type_code: 'character' } };
    var characterInHand = { uuid: '4444', code: '4', label: 'Hand', type_code: 'character' };
    var locationInHand = { uuid: '5555', code: '5', label: 'Hand Location', type_code: 'location' };
    var attachmentInHand = { uuid: '7777', code: '7', label: 'Hand Attachment', type_code: 'attachment', text: 'Terminal. Some other Stuff.', owner: player.id };
    var eventInHand = { uuid: '8888', code: '8', label: 'Hand Event', type_code: 'event' };
    var cardNotInHand = { uuid: '6666', code: '6', label: 'NotInHand', type_code: 'character' };
    var dupe = { card: { uuid: '2222dupe', code: '2', label: 'Hand', type_code: 'character', is_unique: true } };
    var otherPlayerNonTerminalAttachment = { card: { uuid: '9999', code: '9', label: 'Attachment', type_code: 'attachment', owner: otherPlayer.id } };
    var otherPlayerTerminalAttachment = { card: { uuid: '1212', code: '12', label: 'Attachment', type_code: 'attachment', text: 'Terminal.', owner: otherPlayer.id } };

    beforeEach(() => {
        player.initialise();
        otherPlayer.initialise();

        cardWithNoAttachments.dupes = [];
        cardWithAttachment.attachments = [attachment.card];
    });

    describe('the drop() function', function() {
        var dropSucceeded = false;

        describe('when dragging a card from hand to play area', function() {
            describe('when the card is not in the hand', function() {
                beforeEach(function() {
                    dropSucceeded = player.drop(undefined, cardNotInHand, 'hand', 'play area');
                });

                it('should return false and not change the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.cardsInPlay.length).toBe(0);
                    expect(player.hand.length).toBe(0);
                });
            });

            describe('when the card is in hand and a character', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(undefined, characterInHand, 'hand', 'play area');
                });

                it('should return true and add the card to the play area', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.cardsInPlay.length).toBe(1);
                    expect(player.hand.length).toBe(0);
                });
            });

            describe('when the card is a character and a dupe is in play', function() {
                beforeEach(function() {
                    player.hand.push(dupe.card);
                    player.cardsInPlay.push(cardWithNoAttachments);

                    dropSucceeded = player.drop(undefined, dupe.card, 'hand', 'play area');
                });

                it('should return true and add a dupe to the play area', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.cardsInPlay.length).toBe(1);
                    expect(cardWithNoAttachments.dupes.length).toBe(1);
                });
            });

            describe('when the card is in hand and a location', function() {
                beforeEach(function() {
                    player.hand.push(locationInHand);
                    dropSucceeded = player.drop(undefined, locationInHand, 'hand', 'play area');
                });

                it('should return true and add the card to the play area', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.cardsInPlay.length).toBe(1);
                    expect(player.hand.length).toBe(0);
                });
            });

            describe('when the card is in hand and an event', function() {
                beforeEach(function() {
                    player.hand.push(eventInHand);
                    dropSucceeded = player.drop(undefined, eventInHand, 'hand', 'play area');
                });

                it('should return false and not add the card to the play area', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.cardsInPlay.length).toBe(0);
                    expect(player.hand.length).toBe(1);
                });
            });

            describe('when the card is in hand and an attachment', function() {
                beforeEach(function() {
                    player.hand.push(attachmentInHand);
                    dropSucceeded = player.drop(undefined, attachmentInHand, 'hand', 'play area');
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
            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(undefined, cardNotInHand, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.hand.length).toBe(1);
                    expect(player.deadPile.length).toBe(0);
                });
            });

            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {

                    player.hand.push(locationInHand);
                    dropSucceeded = player.drop(undefined, locationInHand, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.hand.length).toBe(1);
                    expect(player.deadPile.length).toBe(0);
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    player.hand.push(attachmentInHand);
                    dropSucceeded = player.drop(undefined, attachmentInHand, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.hand.length).toBe(1);
                    expect(player.deadPile.length).toBe(0);
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    player.hand.push(eventInHand);
                    dropSucceeded = player.drop(undefined, eventInHand, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.hand.length).toBe(1);
                    expect(player.deadPile.length).toBe(0);
                });
            });

            describe('when the card is in hand and is a character', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(undefined, characterInHand, 'hand', 'dead pile');
                });

                it('should return true and put the character in the dead pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.deadPile.length).toBe(1);
                });
            });
        });

        describe('when dragging a card from hand to the discard pile', function() {
            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(undefined, cardNotInHand, 'hand', 'discard pile');
                });

                it('should return false and not update the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.hand.length).toBe(1);
                    expect(player.discardPile.length).toBe(0);
                });
            });

            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {

                    player.hand.push(locationInHand);
                    dropSucceeded = player.drop(undefined, locationInHand, 'hand', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.discardPile.length).toBe(1);
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    player.hand.push(attachmentInHand);
                    dropSucceeded = player.drop(undefined, attachmentInHand, 'hand', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.discardPile.length).toBe(1);
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    player.hand.push(eventInHand);
                    dropSucceeded = player.drop(undefined, eventInHand, 'hand', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.discardPile.length).toBe(1);
                });
            });

            describe('when the card is in hand and is a character', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(undefined, characterInHand, 'hand', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.discardPile.length).toBe(1);
                });
            });
        });

        describe('when dragging a card from hand to the deck', function() {
            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(undefined, cardNotInHand, 'hand', 'draw deck');
                });

                it('should return false and not update the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.hand.length).toBe(1);
                    expect(player.drawDeck.length).toBe(0);
                });
            });

            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {

                    player.hand.push(locationInHand);
                    dropSucceeded = player.drop(undefined, locationInHand, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.drawDeck.length).toBe(1);
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    player.hand.push(attachmentInHand);
                    dropSucceeded = player.drop(undefined, attachmentInHand, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.drawDeck.length).toBe(1);
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    player.hand.push(eventInHand);
                    dropSucceeded = player.drop(undefined, eventInHand, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.drawDeck.length).toBe(1);
                });
            });

            describe('when the card is in hand and is a character', function() {
                beforeEach(function() {
                    player.hand.push(characterInHand);
                    dropSucceeded = player.drop(undefined, characterInHand, 'hand', 'draw deck');
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

                    dropSucceeded = player.drop(undefined, characterInHand, 'hand', 'draw deck');
                    dropSucceeded = player.drop(undefined, locationInHand, 'hand', 'draw deck');
                });

                it('should put the cards in the draw deck in the correct order', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.hand.length).toBe(0);
                    expect(player.drawDeck[0].code).toBe(locationInHand.code);
                    expect(player.drawDeck[1].code).toBe(characterInHand.code);
                });
            });
        });

        describe('when dragging a card from the play area to the discard pile', function() {
            describe('when the card is not in play', function() {
                beforeEach(function() {
                    player.cardsInPlay.push(cardWithNoAttachments);

                    dropSucceeded = player.drop(undefined, cardNotInHand, 'play area', 'discard pile');
                });

                it('should return false and not update the game state', function() {
                    expect(dropSucceeded).toBe(false);
                    expect(player.cardsInPlay.length).toBe(1);
                    expect(player.discardPile.length).toBe(0);
                });
            });

            describe('when the card is in play', function() {
                beforeEach(function() {
                    player.cardsInPlay.push(cardWithNoAttachments);

                    dropSucceeded = player.drop(undefined, cardWithNoAttachments.card, 'play area', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.cardsInPlay.length).toBe(0);
                    expect(player.discardPile.length).toBe(1);
                });
            });

            describe('when the card is in play and has a dupe', function() {
                beforeEach(function() {
                    cardWithNoAttachments.dupes.push(dupe.card);

                    player.cardsInPlay.push(cardWithNoAttachments);

                    dropSucceeded = player.drop(undefined, cardWithNoAttachments.card, 'play area', 'discard pile');
                });

                it('should return true and put the card and dupe in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.cardsInPlay.length).toBe(0);
                    expect(player.discardPile.length).toBe(2);
                    expect(player.discardPile[0]).toBe(dupe.card);
                    expect(player.discardPile[1]).toBe(cardWithNoAttachments.card);
                });
            });

            describe('when the card is in play and has a non terminal attachment belonging to this player', function() {
                beforeEach(function() {
                    player.cardsInPlay.push(cardWithAttachment);

                    dropSucceeded = player.drop(undefined, cardWithAttachment.card, 'play area', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.cardsInPlay.length).toBe(0);
                    expect(player.discardPile.length).toBe(1);
                });

                it('should return the attachment to the player\'s hand', function() {
                    expect(player.hand.length).toBe(1);
                });
            });

            describe('when the card is in play and has a terminal attachment belonging to this player', function() {
                beforeEach(function() {
                    cardWithAttachment.attachments = [attachmentInHand];
                    player.cardsInPlay.push(cardWithAttachment);

                    dropSucceeded = player.drop(undefined, cardWithAttachment.card, 'play area', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.cardsInPlay.length).toBe(0);
                    expect(player.discardPile.length).toBe(2);
                });

                it('should put the attachment in the player\'s hand', function() {
                    expect(player.discardPile[0]).toBe(attachmentInHand);
                });
            });

            describe('when the card is in play and has a non terminal attachment belonging to the other player', function() {
                beforeEach(function() {
                    cardWithAttachment.attachments = [otherPlayerNonTerminalAttachment.card];
                    player.cardsInPlay.push(cardWithAttachment);

                    dropSucceeded = player.drop(otherPlayer, cardWithAttachment.card, 'play area', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.cardsInPlay.length).toBe(0);
                    expect(player.discardPile.length).toBe(1);
                });

                it('should return the attachment to the other player\'s hand', function() {
                    expect(otherPlayer.hand.length).toBe(1);
                });
            });

            describe('when the card is in play and has a terminal attachment belonging to the other player', function() {
                beforeEach(function() {
                    cardWithAttachment.attachments = [otherPlayerTerminalAttachment.card];
                    player.cardsInPlay.push(cardWithAttachment);

                    dropSucceeded = player.drop(otherPlayer, cardWithAttachment.card, 'play area', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.cardsInPlay.length).toBe(0);
                    expect(player.discardPile.length).toBe(1);
                });

                it('should put the attachment in the other player\'s discard', function() {
                    expect(otherPlayer.discardPile.length).toBe(1);
                    expect(otherPlayer.discardPile[0]).toBe(otherPlayerTerminalAttachment.card);
                });
            });

            describe('when the card is in play and is attached to another card', function() {
                beforeEach(function() {
                    cardWithAttachment.attachments = [attachment.card];
                    attachment.card.parent = cardWithAttachment;
                    player.cardsInPlay.push(cardWithAttachment);

                    dropSucceeded = player.drop(undefined, attachment.card, 'play area', 'discard pile');
                });

                it('should return true and put the attachment in the discard pile', function() {
                    expect(dropSucceeded).toBe(true);
                    expect(player.discardPile.length).toBe(1);
                    expect(player.discardPile[0]).toBe(attachment.card);
                });

                it('should leave the parent card in play', function() {
                    expect(player.cardsInPlay.length).toBe(1);
                });

                it('should remove the attachment from the parent', function() {
                    expect(cardWithAttachment.attachments.length).toBe(0);
                });
            });
        });
    });
});
