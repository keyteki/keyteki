describe('Evasive Maneuvers', function () {
    describe("Evasive Maneuvers's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['evasive-maneuvers'],
                    inPlay: ['ember-imp', 'urchin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'dust-pixie']
                }
            });
        });

        it('should prevent friendly creatures from taking damage for the remainder of the turn', function () {
            this.player1.play(this.evasiveManeuvers);
            this.player1.fightWith(this.urchin, this.krump);
            expect(this.urchin.tokens.damage).toBeUndefined();
            expect(this.krump.tokens.damage).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.krump, this.emberImp);
            expect(this.emberImp.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });

        it('should deal 2 damage to each friendly creature when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.evasiveManeuvers);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.urchin.location).toBe('play area');
            expect(this.emberImp.location).toBe('play area');
            expect(this.evasiveManeuvers.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
