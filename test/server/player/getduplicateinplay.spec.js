/* global describe, it, beforeEach, expect, spyOn, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');

describe('Player', function() {
    describe('getDuplicateInPlay', function() {
        beforeEach(function() {
            this.player = new Player('1', 'Player 1', true);
            this.player.initialise();

            this.dupeCard = { code: '1', name: 'Test' };

            this.player.cardsInPlay.push(this.dupeCard);

            this.findSpy = spyOn(this.player, 'findCardByUuid');
            this.cardSpy = jasmine.createSpyObj('card', ['isUnique']);

            this.cardSpy.isUnique.and.returnValue(true);
            this.findSpy.and.returnValue(this.cardSpy);
        });

        describe('when the card is not unique', function() {
            beforeEach(function() {
                this.cardSpy.isUnique.and.returnValue(false);

                this.dupe = this.player.getDuplicateInPlay(this.cardSpy);
            });

            it('should return undefined', function() {
                expect(this.isDupe).toBeUndefined;
            });
        });

        describe('when there is a matching card in play by code', function() {
            beforeEach(function() {
                this.cardSpy.code = '1';
                this.cardSpy.name = 'Other';

                this.dupe = this.player.getDuplicateInPlay(this.cardSpy);
            });

            it('should return dupe', function() {
                expect(this.dupe).toBe(this.dupeCard);
            });
        });

        describe('when there is a matching card in play by name', function() {
            beforeEach(function() {
                this.cardSpy.code = '2';
                this.cardSpy.name = 'Test';

                this.dupe = this.player.getDuplicateInPlay(this.cardSpy);
            });

            it('should return dupe', function() {
                expect(this.dupe).toBe(this.dupeCard);
            });
        });

        describe('when there is a card that doesnt match by name or code', function() {
            beforeEach(function() {
                this.cardSpy.code = '6';
                this.cardSpy.name = 'Other';

                this.dupe = this.player.getDuplicateInPlay(this.cardSpy);
            });

            it('should return dupe', function() {
                expect(this.dupe).toBe(undefined);
            });
        });
    });
});
