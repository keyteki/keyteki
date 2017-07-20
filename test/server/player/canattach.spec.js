/*global describe, it, beforeEach, expect, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');

describe('Player', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['getOtherPlayer', 'playerDecked', 'raiseMergedEvent']);
        this.player = new Player('1', 'Player 1', true, this.gameSpy);
        this.player.initialise();

        this.cardSpy = jasmine.createSpyObj('card', ['allowAttachment']);
        this.cardSpy.allowAttachment.and.returnValue(true);
        this.cardSpy.location = 'play area';
        this.attachmentSpy = jasmine.createSpyObj('attachment', ['canAttach']);
        this.attachmentSpy.canAttach.and.returnValue(true);
    });

    describe('canAttach()', function() {
        describe('when everything is correct', function() {
            it('should return true', function() {
                expect(this.player.canAttach(this.attachmentSpy, this.cardSpy)).toBe(true);
            });
        });

        describe('when the card is not in play area', function() {
            beforeEach(function() {
                this.cardSpy.location = 'hand';
            });

            it('should return false', function() {
                expect(this.player.canAttach(this.attachmentSpy, this.cardSpy)).toBe(false);
            });
        });

        describe('when the card does not allow the attachment', function() {
            beforeEach(function() {
                this.cardSpy.allowAttachment.and.returnValue(false);
            });

            it('should return false', function() {
                expect(this.player.canAttach(this.attachmentSpy, this.cardSpy)).toBe(false);
            });
        });

        describe('when the attachment cannot be attached to the card', function() {
            beforeEach(function() {
                this.attachmentSpy.canAttach.and.returnValue(false);
            });

            it('should return false', function() {
                expect(this.player.canAttach(this.attachmentSpy, this.cardSpy)).toBe(false);
            });
        });
    });
});
