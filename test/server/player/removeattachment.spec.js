const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('Player', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'queueSimpleStep', 'raiseEvent', 'getOtherPlayer', 'playerDecked']);
        this.gameSpy.queueSimpleStep.and.callFake(step => step());
        this.player = new Player('1', 'Player 1', true, this.gameSpy);
        this.player.deck = {};
        this.player.initialise();
        this.player.phase = 'dynasty';
        this.attachmentOwner = new Player('2', 'Player 2', false, this.gameSpy);
        this.attachmentOwner.initialise();
        this.attachment = new DrawCard(this.attachmentOwner, {});
        spyOn(this.attachment, 'canAttach').and.returnValue(true);
        this.card = new DrawCard(this.player, {});
        this.card.location = 'play area';
        this.player.cardsInPlay.push(this.card);
        this.player.attach(this.player, this.attachment, this.card.uuid);

        this.gameSpy.raiseEvent.and.callFake((name, params, handler) => {
            if(handler) {
                handler(params);
            }
        });
    });

    describe('removeAttachment', function() {
        beforeEach(function() {
            spyOn(this.attachment, 'leavesPlay');
            spyOn(this.attachment, 'isAncestral');
        });

        describe('when the attachment is ancestral', function() {
            beforeEach(function() {
                this.attachment.isAncestral.and.returnValue(true);
                this.player.removeAttachment(this.attachment);
            });

            it('should leave play', function() {
                expect(this.attachment.leavesPlay).toHaveBeenCalled();
            });

            it('should remove the attachment from its parent', function() {
                expect(this.card.attachments).not.toContain(this.attachment);
            });

            it('should unset its parent property', function() {
                expect(this.attachment.parent).toBeUndefined();
            });

            it('should return the attachment to its owners hand', function() {
                expect(this.attachmentOwner.hand).toContain(this.attachment);
                expect(this.attachmentOwner.conflictDiscardPile).not.toContain(this.attachment);
            });
        });

        describe('when the attachment is not ancestral', function() {
            beforeEach(function() {
                this.attachment.isAncestral.and.returnValue(false);
                this.player.removeAttachment(this.attachment);
            });

            it('should leave play', function() {
                expect(this.attachment.leavesPlay).toHaveBeenCalled();
            });

            it('should remove the attachment from its parent', function() {
                expect(this.card.attachments).not.toContain(this.attachment);
            });

            it('should unset its parent property', function() {
                expect(this.attachment.parent).toBeUndefined();
            });

            it('should return the attachment to its owners discard pile', function() {
                expect(this.attachmentOwner.hand).not.toContain(this.attachment);
                expect(this.attachmentOwner.conflictDiscardPile).toContain(this.attachment);
            });
        });
    });
});
