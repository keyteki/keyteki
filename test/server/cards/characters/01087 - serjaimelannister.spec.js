/* global describe, it, expect, beforeEach, jasmine, afterEach */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const SerJaimeLannister = require('../../../../server/game/cards/characters/01/serjaimelannister.js');

describe('SerJaimeLannister', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'addPower', 'addMessage']);
        this.playerSpy = jasmine.createSpyObj('player', ['']);
        this.otherPlayerSpy = jasmine.createSpyObj('player2', ['']);

        this.playerSpy.game = this.gameSpy;
        this.otherPlayerSpy.game = this.gameSpy;

        this.playerSpy.cardsInChallenge = _([]);

        this.character = new SerJaimeLannister(this.playerSpy, {});
    });

    describe('when attackers are declared', function() {
        describe('and this card is not in play', function() {
            it('should not set renown on this card', function() {
                expect(this.character.isRenown()).toBe(false);
            });
        });

        describe('and this card is in play', function() {
            beforeEach(function() {
                this.character.inPlay = true;
                this.character.kneeled = true;
            });

            describe('and the attacker is not my owner', function() {
                beforeEach(function() {
                    this.character.onAttackersDeclared(this.otherPlayerSpy, 'military');
                });

                it('should not stand the card', function() {
                    expect(this.character.kneeled).toBe(true);
                });

                it('should set renown', function() {
                    expect(this.character.isRenown()).toBe(true);
                });
            });

            describe('and the attacker is my owner', function() {
                beforeEach(function() {
                    this.character.onAttackersDeclared(this.playerSpy, 'military');
                });

                describe('and this card is blank', function() {
                    beforeEach(function() {
                        this.character.setBlank();
                        this.character.onAttackersDeclared(this.playerSpy, 'military');
                    });

                    afterEach(function() {
                        this.character.clearBlank();
                    });

                    it('should not stand the card', function() {
                        expect(this.character.kneeled).toBe(true);
                    });

                    it('should not set renown', function() {
                        expect(this.character.isRenown()).toBe(false);
                    });
                });

                describe('and this card is not in the challenge', function() {
                    it('should set renown', function() {
                        expect(this.character.isRenown()).toBe(true);
                    });

                    it('should not stand the card', function() {
                        expect(this.character.kneeled).toBe(true);
                    });
                });

                describe('and this card is in the challenge', function() {
                    beforeEach(function() {
                        this.playerSpy.cardsInChallenge.push(this.character);

                        this.character.onAttackersDeclared(this.playerSpy, 'military');
                    });

                    it('should stand the card', function() {
                        expect(this.character.kneeled).toBe(false);
                    });

                    describe('and the challenge type is not military', function() {
                        beforeEach(function() {
                            this.character.kneeled = true;
                            this.character.renownCount = 0;
                            this.character.onAttackersDeclared(this.playerSpy, 'intrigue');
                        });

                        it('should set not renown', function() {
                            expect(this.character.isRenown()).toBe(false);
                        });

                        it('should not stand the card', function() {
                            expect(this.character.kneeled).toBe(true);
                        });
                    });
                });
            });
        });
    });
});
