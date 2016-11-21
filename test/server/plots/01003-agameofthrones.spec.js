/* global describe, it, expect, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const cards = require('../../../server/game/cards');
const AGameOfThrones = cards['01003'];

describe('AGameOfThrones', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'addPower', 'addMessage']);
        this.playerSpy = jasmine.createSpyObj('player', ['getNumberOfChallengesWon']);
        this.otherPlayerSpy = jasmine.createSpyObj('player2', ['']);

        this.playerSpy.game = this.gameSpy;
        this.otherPlayerSpy.game = this.gameSpy;

        this.playerSpy.getNumberOfChallengesWon.and.returnValue(0);

        this.plot = new AGameOfThrones(this.playerSpy, {});
    });

    describe('when called for intrigue challenge', function() {
        describe('and this plot is not in play', function() {
            beforeEach(function() {
                this.plot.inPlay = false;

                this.canChallenge = this.plot.canChallenge(this.playerSpy, 'intrigue');
            });

            it('should return true', function() {
                expect(this.canChallenge).toBe(true);
            });
        });

        describe('and this plot is in play', function() {
            beforeEach(function() {
                this.plot.inPlay = true;

                this.canChallenge = this.plot.canChallenge(this.playerSpy, 'intrigue');
            });

            it('should return true', function() {
                expect(this.canChallenge).toBe(true);
            });
        });
    });

    describe('when called for power challenge', function() {
        describe('and this plot is not in play', function() {
            beforeEach(function() {
                this.plot.inPlay = false;

                this.canChallenge = this.plot.canChallenge(this.playerSpy, 'power');
            });

            it('should return true', function() {
                expect(this.canChallenge).toBe(true);
            });
        });

        describe('and this plot is in play', function() {
            beforeEach(function() {
                this.plot.inPlay = true;
            });

            describe('and no intrique challenges have been won yet this round', function() {
                beforeEach(function() {
                    this.canChallenge = this.plot.canChallenge(this.playerSpy, 'power');
                });

                it('should return false', function() {
                    expect(this.canChallenge).toBe(false);
                });
            });

            describe('and at least one intrigue challenge has been won this round', function() {
                beforeEach(function() {
                    this.playerSpy.getNumberOfChallengesWon.and.returnValue(1);
                    this.canChallenge = this.plot.canChallenge(this.playerSpy, 'power');
                });

                it('should return true', function() {
                    expect(this.canChallenge).toBe(true);
                });
            });
        });
    });

    describe('when called for military challenge', function() {
        describe('and this plot is not in play', function() {
            beforeEach(function() {
                this.plot.inPlay = false;

                this.canChallenge = this.plot.canChallenge(this.playerSpy, 'military');
            });

            it('should return true', function() {
                expect(this.canChallenge).toBe(true);
            });
        });

        describe('and this plot is in play', function() {
            beforeEach(function() {
                this.plot.inPlay = true;
            });

            describe('and no intrique challenges have been won yet this round', function() {
                beforeEach(function() {
                    this.canChallenge = this.plot.canChallenge(this.playerSpy, 'military');
                });

                it('should return false', function() {
                    expect(this.canChallenge).toBe(false);
                });
            });

            describe('and at least one intrigue challenge has been won this round', function() {
                beforeEach(function() {
                    this.playerSpy.getNumberOfChallengesWon.and.returnValue(1);
                    this.canChallenge = this.plot.canChallenge(this.playerSpy, 'military');
                });

                it('should return true', function() {
                    expect(this.canChallenge).toBe(true);
                });
            });
        });
    });
});
