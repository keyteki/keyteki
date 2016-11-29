/*global describe, it, beforeEach, expect*/
/* eslint camelcase: 0 */

const DrawCard = require('../../../server/game/drawcard.js');

describe('the DrawCard', function() {
    var owner = {};
    var player = {};
    var targetCard;
    var attachment;

    describe('the canAttach() function', function() {
        describe('when the card is not an attachment', function() {
            beforeEach(function() {
                targetCard = new DrawCard(owner, { text: '' });
                attachment = new DrawCard(owner, { type_code: 'event' });
            });

            it('should return false', function() {
                expect(attachment.canAttach(player, targetCard)).toBe(false);
            });
        });

        describe('when the target card does not allow attachments', function() {
            beforeEach(function() {
                targetCard = new DrawCard(owner, { text: 'No attachments.' });
                attachment = new DrawCard(owner, { type_code: 'attachment' });
            });

            it('should return false', function() {
                expect(attachment.canAttach(player, targetCard)).toBe(false);
            });
        });

        describe('when the target card only allows certain kinds of attachments', function() {
            beforeEach(function() {
                targetCard = new DrawCard(owner, { text: 'No attachments except <b>Weapon</b>.' });
            });

            describe('and the card text has the target in italics', function() {
                beforeEach(function() {
                    targetCard = new DrawCard(owner, { text: 'No attachments except <i>Weapon</i>.' });
                });

                describe('and the attachment has that trait', function() {
                    beforeEach(function() {
                        attachment = new DrawCard(owner, { type_code: 'attachment', traits: 'Condition. Weapon.' });
                    });

                    it('should return true', function() {
                        expect(attachment.canAttach(player, targetCard)).toBe(true);
                    });
                });
            });

            describe('and the attachment has that trait', function() {
                beforeEach(function() {
                    attachment = new DrawCard(owner, { type_code: 'attachment', traits: 'Condition. Weapon.' });
                });

                it('should return true', function() {
                    expect(attachment.canAttach(player, targetCard)).toBe(true);
                });
            });

            describe('and the attachment does not have that trait', function() {
                beforeEach(function() {
                    attachment = new DrawCard(owner, { type_code: 'attachment', traits: 'Condition.' });
                });

                it('should return false', function() {
                    expect(attachment.canAttach(player, targetCard)).toBe(false);
                });
            });
        });

        describe('when there are no restrictions', function() {
            beforeEach(function() {
                targetCard = new DrawCard(owner, { text: '' });
                attachment = new DrawCard(owner, { type_code: 'attachment', traits: '' });
            });

            it('should return true', function() {
                expect(attachment.canAttach(player, targetCard)).toBe(true);
            });
        });
    });
});
