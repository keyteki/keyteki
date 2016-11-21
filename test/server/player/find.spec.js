/*global describe, it, beforeEach, expect*/
/* eslint camelcase: 0 */

const _ = require('underscore');

const Player = require('../../../server/game/player.js');

describe('the Player', () => {
    var player = new Player('1', 'Player 1', true);
    var attachment = { uuid: '1111', code: '1', label: 'Attachment', type_code: 'attachment' };
    var cardWithNoAttachments = { uuid: '2222', code: '2', label: 'Character', type_code: 'character' };
    var cardWithAttachment = { attachments: _([attachment]), uuid: '3333', code: '3', label: 'Character', type_code: 'character' };

    beforeEach(() => {
        player.initialise();

        player.cardsInPlay.push(cardWithNoAttachments);
        player.cardsInPlay.push(cardWithAttachment);
    });

    describe('the findCardInPlayByUuid() function', () => {
        var card = undefined;

        describe('when called for a card that isn\'t in play', () => {
            it('should return undefined', () => {
                card = player.findCardInPlayByUuid('notinplay');

                expect(card).toBe(undefined);
            });
        });

        describe('when called for a card that is in play', () => {
            beforeEach(() => {
                card = player.findCardInPlayByUuid('2222');
            });

            it('should return the card', () => {
                expect(card).not.toBe(undefined);
                expect(card.code).toBe('2');
            });
        });

        describe('when called for an attachment that is on a card in play', () => {
            beforeEach(() => {
                card = player.findCardInPlayByUuid('1111');
            });

            it('should return the attachment', () => {
                expect(card).not.toBe(undefined);
                expect(card.code).toBe('1');
            });
        });
    });
});
