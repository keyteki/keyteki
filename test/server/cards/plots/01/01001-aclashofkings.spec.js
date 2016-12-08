/* global describe, it, expect, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const cards = require('../../../../../server/game/cards');
const AClashOfKings = cards['01001'];
const Challenge = require('../../../../../server/game/challenge.js');

describe('AClashOfKings', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'transferPower', 'addMessage']);
        this.playerSpy = jasmine.createSpyObj('player', ['']);
        this.otherPlayerSpy = jasmine.createSpyObj('player2', ['']);

        this.playerSpy.game = this.gameSpy;
        this.otherPlayerSpy.game = this.gameSpy;

        this.plot = new AClashOfKings(this.playerSpy, {});
    });

    describe('when revealed', function() {
        beforeEach(function() {
            this.plot.onReveal();
        });

        it('should register its afterChallenge handler', function() {
            expect(this.gameSpy.on).toHaveBeenCalledWith('afterChallenge', this.plot.afterChallenge);
        });
    });

    describe('when card leaves play', function() {
        beforeEach(function() {
            this.plot.leavesPlay();
        });

        it('should be marked as not in play', function() {
            expect(this.plot.inPlay).toBe(false);
        });

        it('should unregister its afterChallenge handler', function() {
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith('afterChallenge', this.plot.afterChallenge);
        });
    });

    describe('when a challenge is finished', function() {
        beforeEach(function() {
            this.challenge = new Challenge(this.gameSpy, this.playerSpy, this.otherPlayerSpy, 'power');
            this.challenge.winner = this.playerSpy
            this.challenge.loser = this.otherPlayerSpy;
        });

        describe('and this plot is not in play', function() {
            beforeEach(function() {
                this.plot.inPlay = false;
                this.challenge.winner = this.otherPlayerSpy;
                this.challenge.loser = this.playerSpy
                this.plot.afterChallenge({}, this.challenge);
            });

            it('should not change any power', function() {
                expect(this.gameSpy.transferPower).not.toHaveBeenCalled();
            });
        });

        describe('and this plot is in play', function() {
            beforeEach(function() {
                this.plot.inPlay = true;
            });

            describe('and the challenge type was not power', function() {
                beforeEach(function() {
                    this.challenge.challengeType = 'not power';
                    this.plot.afterChallenge({}, this.challenge);
                });

                it('should not change any power', function() {
                    expect(this.gameSpy.transferPower).not.toHaveBeenCalled();
                });
            });

            describe('and the challenge type was power', function() {
                describe('and our owner lost', function() {
                    beforeEach(function() {
                        this.challenge.winner = this.otherPlayerSpy;
                        this.challenge.loser = this.playerSpy
                        this.plot.afterChallenge({}, this.challenge);
                    });

                    it('should not change any power', function() {
                        expect(this.gameSpy.transferPower).not.toHaveBeenCalled();
                    });
                });

                describe('and our owner won', function() {
                    describe('but the loser did not have any power', function() {
                        beforeEach(function() {
                            this.plot.afterChallenge({}, this.challenge);
                        });

                        it('should not change any power', function() {
                            expect(this.gameSpy.transferPower).not.toHaveBeenCalled();
                        });
                    });

                    describe('and the loser had power', function() {
                        beforeEach(function() {
                            this.otherPlayerSpy.power = 1;
                            this.plot.afterChallenge({}, this.challenge);
                        });

                        it('should transfer one power from the loser to our owner', function() {
                            expect(this.gameSpy.transferPower).toHaveBeenCalledWith(this.playerSpy, this.otherPlayerSpy, 1);
                        });
                    });
                });
            });
        });
    });
});
