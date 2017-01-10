/* global describe, it, beforeEach, expect, spyOn, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const Player = require('../../../server/game/player.js');

function addCardsToHand(hand, number) {
    for(var i = 0; i < number; i++) {
        hand.push({});
    }
}

describe('Player', function() {
    describe('setupDone', function() {
        beforeEach(function() {
            this.game = jasmine.createSpyObj('game', ['getOtherPlayer', 'playerDecked']);
            this.player = new Player('1', 'Player 1', true, this.game);
            this.player.deck = {};
            this.player.initialise();

            this.cardSpy = jasmine.createSpyObj('card', ['isUnique', 'addDuplicate']);
            this.duplicateSpy = jasmine.createSpyObj('card', ['isUnique', 'addDuplicate']);
            this.findSpy = spyOn(this.player, 'findCardByName');

            spyOn(this.player, 'drawCardsToHand');

            this.findSpy.and.returnValue(undefined);

            this.cardSpy.facedown = true;
            this.cardSpy.name = 'Card';
            this.duplicateSpy.facedown = true;
            this.duplicateSpy.name = 'Dupe';

            this.player.cardsInPlay.push(this.cardSpy);
            this.player.cardsInPlay.push(this.duplicateSpy);
            this.player.gold = 8;

            this.player.setupDone();
        });

        describe('when the hand size is less than the starting hand size', function() {
            beforeEach(function() {
                addCardsToHand(this.player.hand, 4);

                this.player.setupDone();
            });

            it('should draw cards back up to the starting hand size', function() {
                expect(this.player.drawCardsToHand).toHaveBeenCalledWith(3);
            });
        });

        describe('when the hand size is greater than the starting hand size', function() {
            beforeEach(function() {
                this.player.drawCardsToHand.calls.reset();

                addCardsToHand(this.player.hand, 8);

                this.player.setupDone();
            });

            it('should not draw any cards', function() {
                expect(this.player.drawCardsToHand).not.toHaveBeenCalled();
            });
        });

        describe('when the hand size is equal to the starting hand size', function() {
            beforeEach(function() {
                this.player.drawCardsToHand.calls.reset();

                addCardsToHand(this.player.hand, 8);

                this.player.setupDone();
            });

            it('should not draw any cards', function() {
                expect(this.player.drawCardsToHand).not.toHaveBeenCalled();
            });
        });

        describe('when cards are not unique', function() {
            it('should not attempt to add duplicates', function() {
                expect(this.findSpy).not.toHaveBeenCalled();
                expect(this.cardSpy.addDuplicate).not.toHaveBeenCalled();
            });

            it('should mark the card as face up', function() {
                expect(this.cardSpy.facedown).toBe(false);
            });
        });

        describe('when there is a unique card', function() {
            beforeEach(function() {
                this.cardSpy.isUnique.and.returnValue(true);
                this.duplicateSpy.isUnique.and.returnValue(true);

                this.player.setupDone();
            });

            describe('and a duplicate is found', function() {
                beforeEach(function() {
                    this.findSpy.and.callFake((list, name) => {
                        if(name === 'Dupe') {
                            return this.cardSpy;
                        }

                        return undefined;
                    });

                    this.player.setupDone();
                });

                it('should mark the card as face up', function() {
                    expect(this.duplicateSpy.facedown).toBe(false);
                });

                it('should add a duplicate', function() {
                    expect(this.cardSpy.addDuplicate).toHaveBeenCalled();
                });

                it('should remove the duplicate from the cards in play', function() {
                    expect(this.player.cardsInPlay).not.toContain(this.duplicateSpy);
                });
            });

            describe('and no duplicate is found', function() {
                beforeEach(function() {
                    this.findSpy.and.returnValue(undefined);

                    this.player.setupDone();
                });

                it('should not add any duplicates', function() {
                    expect(this.cardSpy.addDuplicate).not.toHaveBeenCalled();
                });

                it('should not remove any cards from in play', function() {
                    expect(this.player.cardsInPlay.size()).toBe(2);
                });
            });
        });

        it('should turn all cards faceup', function() {
            expect(_.any(this.player.cardsInPlay, card => {
                return card.facedown;
            })).toBe(false);
        });

        it('should return unspent setup gold', function() {
            expect(this.player.gold).toBe(0);
        });
    });
});
