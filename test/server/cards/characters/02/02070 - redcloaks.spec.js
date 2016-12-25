/* global describe, it, expect, beforeEach, jasmine, afterEach */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const RedCloaks = require('../../../../../server/game/cards/characters/02/redcloaks.js');

describe('RedCloaks', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'addPower', 'addMessage']);
        this.playerSpy = jasmine.createSpyObj('player', ['']);
        this.otherPlayerSpy = jasmine.createSpyObj('player2', ['']);

        this.playerSpy.game = this.gameSpy;
        this.otherPlayerSpy.game = this.gameSpy;

        this.card = new RedCloaks(this.playerSpy, {});
        this.card.inPlay = true;
    });

    describe('addGold', function() {
        describe('when called while i am not in play', function() {
            beforeEach(function() {
                this.card.inPlay = false;
                this.playerSpy.gold = 10;
                this.card.addGold(this.playerSpy);
            });

            it('should not add any gold to the card', function() {
                expect(this.card.tokens['gold']).toBe(0);
            });
        });

        describe('when not called for my owner', function() {
            beforeEach(function() {
                this.card.addGold(this.otherPlayerSpy);
            });

            it('should not add any gold to the card', function() {
                expect(this.card.tokens['gold']).toBe(0);
            });
        });

        describe('when called for the first time', function() {
            describe('and my owner has no gold', function() {
                beforeEach(function() {
                    this.playerSpy.gold = 0;
                    this.card.addGold(this.playerSpy);
                });

                it('should not add any gold to the card', function() {
                    expect(this.card.tokens['gold']).toBe(0);
                });
            });

            describe('and my owner has gold to move', function() {
                beforeEach(function() {
                    this.playerSpy.gold = 10;
                    this.card.addGold(this.playerSpy);
                });

                it('should add a gold token to the card', function() {
                    expect(this.card.tokens['gold']).toBe(1);
                });

                it('should reduce my owner\'s gold count by 1', function() {
                    expect(this.playerSpy.gold).toBe(9);
                });

                describe('and then called again in the same round', function() {
                    beforeEach(function() {
                        this.card.addGold(this.playerSpy);
                    });

                    it('should not add another gold token to the card', function() {
                        expect(this.card.tokens['gold']).toBe(1);
                    });
                });

                describe('and then called again in a new phase', function() {
                    beforeEach(function() {
                        this.card.onPhaseEnded();
                        this.card.addGold(this.playerSpy);
                    });

                    it('should add another gold token to the card', function() {
                        expect(this.card.tokens['gold']).toBe(2);
                    });
                });
            });
        });
    });

    describe('when attackers are declared', function() {
        describe('if the card has gold on it', function() {
            beforeEach(function() {
                this.playerSpy.gold = 10;
                this.card.addGold(this.playerSpy);
                this.challenge = {
                    attackingPlayer: this.playerSpy,
                    challengeType: 'intrigue'
                };
            });

            describe('and this is not an intrigue challenge', function() {
                beforeEach(function() {
                  this.challenge.challengeType = 'power';
                    this.card.onAttackersDeclared({}, this.challenge);
                });

                it('should not increase the strength modifier', function() {
                    expect(this.card.strengthModifier).toBe(0);
                });
            });

            describe('and this card is not in play', function() {
                beforeEach(function() {
                    this.card.inPlay = false;
                    this.card.onAttackersDeclared({}, this.challenge);
                });

                it('should not increase the strength modifier', function() {
                    expect(this.card.strengthModifier).toBe(0);
                });
            });

            describe('and this is an intrigue challenge', function() {
                beforeEach(function() {
                    this.card.onAttackersDeclared({}, this.challenge);
                });

                it('should increase the strength modifier', function() {
                    expect(this.card.strengthModifier).toBe(1);
                });
            });
        });
    });
});
