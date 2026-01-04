describe('Agamignus', function () {
    describe("Agamignus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'redemption',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['agamignus', 'doomsayer', 'ruthless-avenger'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    amber: 4,
                    hand: ['fandangle', 'toad'],
                    inPlay: ['krump', 'cephaloist']
                }
            });
        });

        it('should gain 1 amber when another Mutant enters play (and not self)', function () {
            this.player1.playCreature(this.agamignus); // No gain for self
            this.player1.playCreature(this.doomsayer); // Gain
            this.player1.playCreature(this.ruthlessAvenger); // No gain
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.fandangle); // Gain
            this.player2.playCreature(this.toad); // No gain
            expect(this.player1.amber).toBe(3);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should destroy each non-Mutant creature when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.agamignus);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.cephaloist.location).toBe('play area');
            expect(this.krump.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            expect(this.agamignus.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
