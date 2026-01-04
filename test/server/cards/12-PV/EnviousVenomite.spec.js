describe('Envious Venomite', function () {
    describe("Envious Venomite's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    inPlay: ['ember-imp', 'envious-venomite']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'troll']
                }
            });
        });

        it('should gain poison when opponent has more amber', function () {
            this.player1.fightWith(this.enviousVenomite, this.krump);
            expect(this.krump.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain poison when opponent has less amber', function () {
            this.player2.amber = 1;
            this.player1.fightWith(this.enviousVenomite, this.krump);
            expect(this.krump.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should give poison to enemy creatures when fate is triggered', function () {
            this.player1.moveCard(this.enviousVenomite, 'hand');
            this.player1.activateProphecy(this.overreach, this.enviousVenomite);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            this.player2.fightWith(this.troll, this.emberImp);
            expect(this.troll.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
