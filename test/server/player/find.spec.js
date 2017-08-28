const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('the Player', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['getOtherPlayer', 'playerDecked', 'raiseEvent']);
        this.player = new Player('1', 'Player 1', true, this.game);
        this.attachment = new DrawCard(this.player, { code: '1', label: 'Attachment', type: 'attachment' });
        this.attachment.uuid = '1111';
        this.cardWithNoAttachments = new DrawCard(this.player, { code: '2', label: 'Character', type: 'character' });
        this.cardWithNoAttachments.uuid = '2222';
        this.cardWithAttachment = new DrawCard(this.player, { code: '3', label: 'Character', type: 'character' });
        this.cardWithAttachment.uuid = '3333';
        this.cardWithAttachment.attachments.push(this.attachment);

        this.player.initialise();

        this.player.cardsInPlay.push(this.cardWithNoAttachments);
        this.player.cardsInPlay.push(this.cardWithAttachment);
    });

    describe('the findCardInPlayByUuid() function', function() {
        describe('when called for a card that isn\'t in play', function() {
            it('should return undefined', function() {
                this.card = this.player.findCardInPlayByUuid('notinplay');

                expect(this.card).toBe(undefined);
            });
        });

        describe('when called for a card that is in play', function() {
            beforeEach(function() {
                this.card = this.player.findCardInPlayByUuid('2222');
            });

            it('should return the card', function() {
                expect(this.card).not.toBe(undefined);
                expect(this.card.code).toBe('2');
            });
        });

        describe('when called for an attachment that is on a card in play', function() {
            beforeEach(function() {
                this.card = this.player.findCardInPlayByUuid('1111');
            });

            it('should return the attachment', function() {
                expect(this.card).not.toBe(undefined);
                expect(this.card.code).toBe('1');
            });
        });
    });
});
