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
        this.defendingPlayer = new Player('2', 'Player 2', true, this.gameSpy);
        spyOn(this.defendingPlayer, 'winChallenge');

        this.attackerCard = new DrawCard(this.attackingPlayer, {});
        spyOn(this.attackerCard, 'getStrength').and.returnValue(5);
        this.defenderCard = new DrawCard(this.defendingPlayer, {});
        spyOn(this.defenderCard, 'getStrength').and.returnValue(3);

        this.challenge = new Challenge(this.gameSpy, this.attackingPlayer, this.defendingPlayer, 'military');
        this.challenge.addAttackers([this.attackerCard]);
        this.challenge.addDefenders([this.defenderCard]);
    });

    describe('removeFromChallenge()', function() {
        describe('when the card is an attacker', function() {
            beforeEach(function() {
                this.challenge.removeFromChallenge(this.attackerCard);
            });

            it('should remove the card from the attacker list', function() {
                expect(this.challenge.attackers).not.toContain(this.attackerCard);
            });

            it('should recalculate challenge strengths', function() {
                expect(this.challenge.attackerStrength).toBe(0);
                expect(this.challenge.defenderStrength).toBe(3);
            });
        });

        describe('when the card is a defender', function() {
            beforeEach(function() {
                this.challenge.removeFromChallenge(this.defenderCard);
            });

            it('should remove the card from the defender list', function() {
                expect(this.challenge.defenders).not.toContain(this.defenderCard);
            });

            it('should recalculate challenge strengths', function() {
                expect(this.challenge.attackerStrength).toBe(5);
                expect(this.challenge.defenderStrength).toBe(0);
            });
        });

        describe('when the card is not in the challenge', function() {
            beforeEach(function() {
                this.challenge.removeFromChallenge(new DrawCard(this.attackingPlayer, {}));
            });

            it('should not modify the participating cards', function() {
                expect(this.challenge.attackers).toContain(this.attackerCard);
                expect(this.challenge.defenders).toContain(this.defenderCard);
            });

            it('should not modify challenge strengths', function() {
                expect(this.challenge.attackerStrength).toBe(5);
                expect(this.challenge.defenderStrength).toBe(3);
            });
        });
    });
});
