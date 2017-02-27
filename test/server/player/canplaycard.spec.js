/* global describe, it, beforeEach, expect, jasmine, spyOn */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');
const Player = require('../../../server/game/player.js');

describe('Player', function () {
    describe('canPlayCard()', function () {
        beforeEach(function () {
            this.gameSpy = jasmine.createSpyObj('game', ['drop', 'getOtherPlayer', 'playerDecked']);

            this.player = new Player('1', 'Test 1', true, this.gameSpy);

            this.cardSpy = jasmine.createSpyObj('card', ['getType', 'getCost', 'isLimited', 'isUnique', 'canPlay']);
            this.cardSpy.uuid = '1111';
            this.cardSpy.name = 'Test Card';

            this.dupeSpy = spyOn(this.player, 'getDuplicateInPlay');
            this.dupeSpy.and.returnValue(undefined);

            this.cardSpy.canPlay.and.returnValue(true);

            this.player.initialise();
            this.player.phase = 'marshal';
            this.player.hand = _([this.cardSpy]);
        });

        describe('when not setup or marshal phase', function() {
            beforeEach(function() {
                this.player.phase = 'notsetupormarshal';

                this.canPlay = this.player.canPlayCard(this.cardSpy);
            });

            it('should return false', function() {
                expect(this.canPlay).toBe(false);
            });
        });

        describe('when card is not in hand', function() {
            beforeEach(function() {
                this.player.hand = _([]);

                this.canPlay = this.player.canPlayCard(this.cardSpy);
            });

            it('should return false', function() {
                expect(this.canPlay).toBe(false);
            });
        });

        describe('when the card costs more than the player has', function() {
            beforeEach(function() {
                this.player.gold = 0;

                this.cardSpy.getCost.and.returnValue(5);
                this.canPlay = this.player.canPlayCard(this.cardSpy);
            });

            describe('and a duplicate is in play', function() {
                beforeEach(function() {
                    this.dupeSpy.and.returnValue(this.cardSpy);

                    this.canPlay = this.player.canPlayCard(this.cardSpy);
                });

                it('should return true', function() {
                    expect(this.canPlay).toBe(true);
                });
            });

            it('should return false', function() {
                expect(this.canPlay).toBe(false);
            });
        });

        describe('when a limited card has already been played', function() {
            beforeEach(function() {
                this.player.limitedPlayed = true;

                this.canPlay = this.player.canPlayCard(this.cardSpy);
            });

            describe('and a non limited card is played', function() {
                it('should return true', function() {
                    expect(this.canPlay).toBe(true);
                });
            });

            describe('and a limited card is played', function() {
                beforeEach(function() {
                    this.cardSpy.isLimited.and.returnValue(true);

                    this.canPlay = this.player.canPlayCard(this.cardSpy);
                });

                describe('that is a duplicate', function() {
                    beforeEach(function() {
                        this.dupeSpy.and.returnValue(this.cardSpy);

                        this.canPlay = this.player.canPlayCard(this.cardSpy);
                    });

                    it('should return false', function() {
                        expect(this.canPlay).toBe(false);
                    });
                });

                it('should return false', function() {
                    expect(this.canPlay).toBe(false);
                });
            });
        });

        describe('when a card is not a character', function() {
            beforeEach(function() {
                this.canPlay = this.player.canPlayCard(this.cardSpy);
            });

            it('should return true', function() {
                expect(this.canPlay).toBe(true);
            });
        });

        describe('when a card is a character', function() {
            beforeEach(function() {
                this.cardSpy.getType.and.returnValue('character');

                this.canPlay = this.player.canPlayCard(this.cardSpy);
            });

            describe('that is not unique', function() {
                it('should return true', function() {
                    expect(this.canPlay).toBe(true);
                });
            });

            describe('that is unique', function() {
                beforeEach(function() {
                    this.cardSpy.isUnique.and.returnValue(true);
                });

                describe('and is in the dead pile', function() {
                    beforeEach(function() {
                        this.player.deadPile = _([{ name: this.cardSpy.name }]);

                        this.canPlay = this.player.canPlayCard(this.cardSpy);
                    });

                    it('should return false', function() {
                        expect(this.canPlay).toBe(false);
                    });
                });

                describe('and is not in the dead pile', function() {
                    it('should return true', function() {
                        expect(this.canPlay).toBe(true);
                    });
                });
            });
        });
    });
});
