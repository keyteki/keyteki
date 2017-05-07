/*global describe, it, beforeEach, expect, spyOn, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const Challenge = require('../../../server/game/challenge.js');
const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('Challenge', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['applyGameAction', 'on', 'raiseEvent']);
        this.gameSpy.applyGameAction.and.callFake((type, card, handler) => {
            handler(card);
        });

        this.attackingPlayer = new Player('1', 'Player 1', true, this.gameSpy);
        spyOn(this.attackingPlayer, 'winChallenge');
        spyOn(this.attackingPlayer, 'loseChallenge');
        this.defendingPlayer = new Player('2', 'Player 2', true, this.gameSpy);
        spyOn(this.defendingPlayer, 'winChallenge');
        spyOn(this.defendingPlayer, 'loseChallenge');

        this.attackerCard = new DrawCard(this.attackingPlayer, {});
        this.defenderCard = new DrawCard(this.defendingPlayer, {});

        this.challenge = new Challenge(this.gameSpy, this.attackingPlayer, this.defendingPlayer, 'military');
    });

    describe('determineWinner()', function() {
        describe('when the attacker has higher strength', function() {
            beforeEach(function() {
                spyOn(this.attackerCard, 'getStrength').and.returnValue(5);
                spyOn(this.defenderCard, 'getStrength').and.returnValue(4);
                this.challenge.addAttackers([this.attackerCard]);
                this.challenge.addDefenders([this.defenderCard]);
                this.challenge.determineWinner();
            });

            it('should have the attacking player be the winner', function() {
                expect(this.challenge.winner).toBe(this.attackingPlayer);
            });

            it('should mark the win for the attacking player', function() {
                expect(this.attackingPlayer.winChallenge).toHaveBeenCalledWith('military', true);
            });

            it('should have the defending player be the loser', function() {
                expect(this.challenge.loser).toBe(this.defendingPlayer);
            });

            it('should mark the loss for the defending player', function() {
                expect(this.defendingPlayer.loseChallenge).toHaveBeenCalledWith('military', false);
            });
        });


        describe('when the attacker and defender have equal strength', function() {
            beforeEach(function() {
                spyOn(this.attackerCard, 'getStrength').and.returnValue(5);
                spyOn(this.defenderCard, 'getStrength').and.returnValue(5);
                this.challenge.addAttackers([this.attackerCard]);
                this.challenge.addDefenders([this.defenderCard]);
                this.challenge.determineWinner();
            });

            it('should have the attacking player be the winner', function() {
                expect(this.challenge.winner).toBe(this.attackingPlayer);
            });

            it('should mark the win for the attacking player', function() {
                expect(this.attackingPlayer.winChallenge).toHaveBeenCalledWith('military', true);
            });

            it('should have the defending player be the loser', function() {
                expect(this.challenge.loser).toBe(this.defendingPlayer);
            });

            it('should mark the loss for the defending player', function() {
                expect(this.defendingPlayer.loseChallenge).toHaveBeenCalledWith('military', false);
            });
        });

        describe('when the defender has higher strength', function() {
            beforeEach(function() {
                spyOn(this.attackerCard, 'getStrength').and.returnValue(4);
                spyOn(this.defenderCard, 'getStrength').and.returnValue(5);
                this.challenge.addAttackers([this.attackerCard]);
                this.challenge.addDefenders([this.defenderCard]);
                this.challenge.determineWinner();
            });

            it('should have the defending player be the winner', function() {
                expect(this.challenge.winner).toBe(this.defendingPlayer);
            });

            it('should mark the win for the defending player', function() {
                expect(this.defendingPlayer.winChallenge).toHaveBeenCalledWith('military', false);
            });

            it('should have the attacking player be the loser', function() {
                expect(this.challenge.loser).toBe(this.attackingPlayer);
            });

            it('should mark the loss for the attacking player', function() {
                expect(this.attackingPlayer.loseChallenge).toHaveBeenCalledWith('military', true);
            });
        });
    });
});
