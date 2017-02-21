/*global describe, it, beforeEach, expect, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const FulfillMilitaryClaim = require('../../../server/game/gamesteps/challenge/fulfillmilitaryclaim.js');

describe('FulfillMilitaryClaim', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['promptForSelect', 'addMessage']);
        this.loser = jasmine.createSpyObj('loser', ['killCharacter']);
        this.loser.cardsInPlay = _([]);

        this.step = new FulfillMilitaryClaim(this.game, this.loser, 1);
    });

    describe('continue()', function() {
        beforeEach(function() {
            this.result = this.step.continue();
        });

        it('should prompt the loser to select cards for claim', function() {
            expect(this.game.promptForSelect).toHaveBeenCalledWith(this.loser, jasmine.any(Object));
        });

        it('should return true', function() {
            expect(this.result).toBe(true);
        });
    });

    describe('fulfillClaim()', function() {
        function makeCard(controller, type) {
            var card = jasmine.createSpyObj('card', ['getType']);
            card.getType.and.returnValue(type);
            card.controller = controller;
            return card;
        }
        beforeEach(function() {
            this.card1 = makeCard(this.loser, 'character');
            this.card2 = makeCard(this.loser, 'character');
            this.card3 = makeCard(this.loser, 'location');

            this.loser.cardsInPlay.push(this.card1);
            this.loser.cardsInPlay.push(this.card2);
            this.loser.cardsInPlay.push(this.card3);
        });

        describe('when the claim is 1', function() {
            beforeEach(function() {
                this.result = this.step.fulfillClaim(this.loser, this.card1);
            });

            it('should kill the character', function() {
                expect(this.loser.killCharacter).toHaveBeenCalledWith(this.card1);
            });

            it('should return true', function() {
                expect(this.result).toBe(true);
            });
        });

        describe('when the claim is 2 or more', function() {
            describe('and the loser has enough characters', function() {
                beforeEach(function() {
                    this.step.claim = 2;
                });

                describe('when not enough characters are selected', function() {
                    beforeEach(function() {
                        this.result = this.step.fulfillClaim(this.loser, [this.card1]);
                    });

                    it('should not kill the character', function() {
                        expect(this.loser.killCharacter).not.toHaveBeenCalled();
                    });

                    it('should return false', function() {
                        expect(this.result).toBe(false);
                    });
                });

                describe('when enough characters are selected', function() {
                    beforeEach(function() {
                        this.result = this.step.fulfillClaim(this.loser, [this.card1, this.card2]);
                    });

                    it('should kill the characters', function() {
                        expect(this.loser.killCharacter).toHaveBeenCalledWith(this.card1);
                        expect(this.loser.killCharacter).toHaveBeenCalledWith(this.card2);
                    });

                    it('should return true', function() {
                        expect(this.result).toBe(true);
                    });
                });
            });

            describe('and the loser does not have enough characters', function() {
                beforeEach(function() {
                    this.step.claim = 3;
                    this.result = this.step.fulfillClaim(this.loser, [this.card1]);
                });

                describe('when not all characters are selected', function() {
                    beforeEach(function() {
                        this.result = this.step.fulfillClaim(this.loser, [this.card1]);
                    });

                    it('should not kill the character', function() {
                        expect(this.loser.killCharacter).not.toHaveBeenCalled();
                    });

                    it('should return false', function() {
                        expect(this.result).toBe(false);
                    });
                });

                describe('when all characters are selected', function() {
                    beforeEach(function() {
                        this.result = this.step.fulfillClaim(this.loser, [this.card1, this.card2]);
                    });

                    it('should kill the characters', function() {
                        expect(this.loser.killCharacter).toHaveBeenCalledWith(this.card1);
                        expect(this.loser.killCharacter).toHaveBeenCalledWith(this.card2);
                    });

                    it('should return true', function() {
                        expect(this.result).toBe(true);
                    });
                });
            });
        });
    });
});
