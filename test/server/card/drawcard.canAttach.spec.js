/*global describe, it, beforeEach, expect, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const DrawCard = require('../../../server/game/drawcard.js');

describe('DrawCard', function() {
    beforeEach(function() {
        this.owner = {
            game: jasmine.createSpyObj('game', ['raiseEvent'])
        };
    });

    describe('canAttach()', function() {
        describe('when the card is an attachment', function() {
            beforeEach(function() {
                this.targetCard = new DrawCard(this.owner, { text: '' });
                this.attachment = new DrawCard(this.owner, { type_code: 'attachment' });
            });

            it('should return true', function() {
                expect(this.attachment.canAttach(this.player, this.targetCard)).toBe(true);
            });
        });

        describe('when the card is not an attachment', function() {
            beforeEach(function() {
                this.targetCard = new DrawCard(this.owner, { text: '' });
                this.attachment = new DrawCard(this.owner, { type_code: 'event' });
            });

            it('should return false', function() {
                expect(this.attachment.canAttach(this.player, this.targetCard)).toBe(false);
            });
        });
    });

    describe('allowAttachment()', function() {
        describe('when the target card does not allow attachments', function() {
            beforeEach(function() {
                this.targetCard = new DrawCard(this.owner, { text: 'No attachments.' });
                this.attachment = new DrawCard(this.owner, { type_code: 'attachment' });
            });

            it('should return false', function() {
                expect(this.targetCard.allowAttachment(this.attachment)).toBe(false);
            });

            describe('but the target card is blank', function() {
                beforeEach(function() {
                    this.targetCard.setBlank();
                });

                it('should return true', function() {
                    expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
                });
            });
        });

        describe('when the target card only allows certain kinds of attachments', function() {
            beforeEach(function() {
                this.targetCard = new DrawCard(this.owner, { text: 'No attachments except <b>Weapon</b>.' });
            });

            describe('and the card text has the target in italics', function() {
                beforeEach(function() {
                    this.targetCard = new DrawCard(this.owner, { text: 'No attachments except <i>Weapon</i>.' });
                });

                describe('and the attachment has that trait', function() {
                    beforeEach(function() {
                        this.attachment = new DrawCard(this.owner, { type_code: 'attachment', traits: 'Condition. Weapon.' });
                    });

                    it('should return true', function() {
                        expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
                    });
                });
            });

            describe('and the attachment has that trait', function() {
                beforeEach(function() {
                    this.attachment = new DrawCard(this.owner, { type_code: 'attachment', traits: 'Condition. Weapon.' });
                });

                it('should return true', function() {
                    expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
                });
            });

            describe('and the attachment does not have that trait', function() {
                beforeEach(function() {
                    this.attachment = new DrawCard(this.owner, { type_code: 'attachment', traits: 'Condition.' });
                });

                it('should return false', function() {
                    expect(this.targetCard.allowAttachment(this.attachment)).toBe(false);
                });

                describe('but the target card is blank', function() {
                    beforeEach(function() {
                        this.targetCard.setBlank();
                    });

                    it('should return true', function() {
                        expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
                    });
                });
            });
        });

        describe('when there are no restrictions', function() {
            beforeEach(function() {
                this.targetCard = new DrawCard(this.owner, { text: '' });
                this.attachment = new DrawCard(this.owner, { type_code: 'attachment', traits: '' });
            });

            it('should return true', function() {
                expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
            });
        });
    });
});
